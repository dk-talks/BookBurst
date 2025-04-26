// app/api/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    // Count books by status
    const [reading, finished, wantToRead] = await Promise.all([
      Book.countDocuments({ user: session.user.id, status: "reading" }),
      Book.countDocuments({ user: session.user.id, status: "finished" }),
      Book.countDocuments({ user: session.user.id, status: "want-to-read" }),
    ]);
    
    return NextResponse.json({
      reading,
      finished,
      wantToRead,
      total: reading + finished + wantToRead,
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}