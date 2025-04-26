import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/auth";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Book from "@/models/Book";

// Get a specific review
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    
    const review = await Review.findById(id).populate("user", "name email image");
    
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }
    
    // If the review is not public, check authorization
    if (!review.isPublic) {
      const session = await getServerSession(authOptions);
      
      if (!session || session.user.id !== review.user._id.toString()) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }
    
    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Update a review
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const updates = await request.json();
    
    await dbConnect();
    
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }
    
    // Check if the user owns this review
    if (review.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Update allowed fields
    const allowedUpdates = ["rating", "reviewText", "isPublic"];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        review[key] = updates[key];
      }
    });
    
    await review.save();
    
    // If rating changed, update book rating too
    if (updates.rating) {
      const book = await Book.findById(review.book);
      if (book && book.user.toString() === session.user.id) {
        book.rating = updates.rating;
        await book.save();
      }
    }
    
    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Delete a review
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }
    
    // Check if the user owns this review
    if (review.user.toString() !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await Review.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}