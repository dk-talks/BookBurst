// app/api/discover/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import Review from "@/models/Review";

export async function GET() {
  try {
    await dbConnect();
    
    // Get recently added books (with public status)
    const recentBooks = await Book.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name");
    
    // Get highly rated books
    const highlyRatedBooks = await Book.find({ rating: { $gte: 4 } })
      .sort({ rating: -1 })
      .limit(10)
      .populate("user", "name");
    
    // Get books with most reviews
    const popularBooks = await Review.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: "$googleBooksId", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get the book details for popular books
    const popularBookDetails = await Promise.all(
      popularBooks.map(async (item) => {
        const book = await Book.findOne({ googleBooksId: item._id }).populate("user", "name");
        return {
          ...book?.toObject(),
          reviewCount: item.count,
          avgRating: item.avgRating
        };
      })
    );
    
    return NextResponse.json({
      recentBooks,
      highlyRatedBooks,
      popularBooks: popularBookDetails.filter(book => book),
    });
  } catch (error) {
    console.error("Error fetching discover data:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}