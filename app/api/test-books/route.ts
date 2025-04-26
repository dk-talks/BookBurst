// app/api/test-search/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Test search API called");
  return NextResponse.json({ message: "Test successful" });
}
