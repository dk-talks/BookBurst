// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    const user = await User.findById(session.user.id).select("-password");
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error:", errorMessage);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate input
    if (!data.name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Update user fields
    user.name = data.name;
    
    if (data.image !== undefined) {
      user.image = data.image;
    }
    
    await user.save();
    
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error:", errorMessage);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}