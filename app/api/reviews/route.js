import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Book from "@/models/Book";

// Get all reviews (with optional filtering)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const googleBooksId = searchParams.get("googleBooksId");
    const userId = searchParams.get("userId");
    const isPublic = searchParams.get("isPublic");
    
    await dbConnect();
    
    // const query: any = {};
    const query = {};
    
    if (bookId) query.book = bookId;
    if (googleBooksId) query.googleBooksId = googleBooksId;
    if (userId) query.user = userId;
    
    // Handle public filter
    if (isPublic === "true") query.isPublic = true;
    
    // If not public, user must be authenticated to see their own reviews
    if (isPublic !== "true") {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      
      // If no specific user is requested, default to current user
      if (!userId) {
        query.user = session.user.id;
      }
    }
    
    const reviews = await Review.find(query)
      .populate("user", "name email image")
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Create a new review
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.googleBooksId || !data.rating || !data.reviewText) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find the book in the user's library or create a reference if not exists
    let book = await Book.findOne({
      user: session.user.id,
      googleBooksId: data.googleBooksId,
    });
    
    if (!book) {
      return NextResponse.json(
        { message: "You can only review books in your library" },
        { status: 400 }
      );
    }
    
    // Check if user already has a review for this book
    const existingReview = await Review.findOne({
      user: session.user.id,
      book: book._id,
    });
    
    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this book" },
        { status: 409 }
      );
    }
    
    // Create the review
    const review = await Review.create({
      user: session.user.id,
      book: book._id,
      googleBooksId: data.googleBooksId,
      rating: data.rating,
      reviewText: data.reviewText,
      isPublic: data.isPublic !== false, // Default to public if not specified
    });
    
    // Also update the book's rating
    book.rating = data.rating;
    await book.save();
    
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}