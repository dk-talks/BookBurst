// app/api/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/auth";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

// Your existing GET function
export async function GET(request: NextRequest) {
  try {
    console.log("Books API called");
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log("No session found in books API");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    console.log("Session user:", session.user.id);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    
    await dbConnect();
    
    interface BookQuery {
      user: string;
      status?: string;
    }
    
    const query: BookQuery = { user: session.user.id! };
    
    // Filter by status if provided
    if (status && ["reading", "finished", "want-to-read"].includes(status)) {
      query.status = status;
    }
    
    console.log("Book query:", query);
    
    const books = await Book.find(query).sort({ updatedAt: -1 });
    
    console.log(`Found ${books.length} books`);
    
    return NextResponse.json({ books });
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error:", errorMessage);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}

// Add this POST function to handle adding new books
export async function POST(request: NextRequest) {
  try {
    console.log("POST to /api/books called");
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log("No session found in POST /api/books");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const bookData = await request.json();
    console.log("Book data received:", bookData);
    
    // Validate required fields
    if (!bookData.googleBooksId || !bookData.title) {
      console.log("Missing required fields");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Check if book already exists for this user
    const existingBook = await Book.findOne({
      user: session.user.id,
      googleBooksId: bookData.googleBooksId,
    });
    
    if (existingBook) {
      console.log("Book already exists in user's collection");
      return NextResponse.json(
        { message: "Book already exists in your shelf" },
        { status: 409 }
      );
    }
    
    // Create new book with user ID
    const newBook = await Book.create({
      ...bookData,
      user: session.user.id,
      status: bookData.status || "want-to-read", // Default status
    });
    
    console.log("Book created successfully:", newBook._id);
    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error:", errorMessage);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}