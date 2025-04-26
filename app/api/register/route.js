// app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  console.log("Register API called");
  
  try {
    const body = await request.json().catch(err => {
      console.error("Failed to parse request body:", err);
      return {};
    });
    
    console.log("Request body:", body);
    
    const { name, email, password } = body;
    
    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Connect to the database
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Connected to database");
    
    // Check if user already exists
    console.log("Checking if user exists:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }
    
    // Hash password
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    console.log("Creating user");
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    
    console.log("User created successfully", newUser._id);
    
    // Return user without password
    const user = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    };
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Server error", details: error.message },
      { status: 500 }
    );
  }
}