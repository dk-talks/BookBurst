import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/auth";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

// Get a specific book
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    const book = await Book.findOne({
      _id: id,
      user: session.user.id,
    });
    
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    
    return NextResponse.json({ book });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Update a book
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const updates = await request.json();
    
    await dbConnect();
    
    // Check if book exists and belongs to user
    const book = await Book.findOne({
      _id: id,
      user: session.user.id,
    });
    
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    
    // Update only allowed fields
    const allowedUpdates = ["status", "rating", "notes"];
    
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        book[key] = updates[key];
      }
    });
    
    await book.save();
    
    return NextResponse.json({ book });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Delete a book
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    const book = await Book.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });
    
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Book removed successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// Get all books for the current user
// export async function GET(request) {
//   try {
//     console.log("Books API called");
//     const session = await getServerSession(authOptions);
    
//     if (!session) {
//       console.log("No session found in books API");
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
    
//     console.log("Session user:", session.user.id);
    
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get("status");
    
//     await dbConnect();
    
//     const query = { user: session.user.id };
    
//     // Filter by status if provided
//     if (status && ["reading", "finished", "want-to-read"].includes(status)) {
//       query.status = status;
//     }
    
//     console.log("Book query:", query);
    
//     const books = await Book.find(query).sort({ updatedAt: -1 });
    
//     console.log(`Found ${books.length} books`);
    
//     return NextResponse.json({ books });
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

// Add a new book to the user's shelf
export async function POST(request) {
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
      console.log("Missing required fields:", { 
        hasGoogleBooksId: !!bookData.googleBooksId, 
        hasTitle: !!bookData.title 
      });
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
    const newBookData = {
      ...bookData,
      user: session.user.id,
      status: bookData.status || "want-to-read", // Default status
    };
    
    console.log("Creating new book:", newBookData);
    const newBook = await Book.create(newBookData);
    
    console.log("Book created successfully:", newBook._id);
    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json(
      { message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}