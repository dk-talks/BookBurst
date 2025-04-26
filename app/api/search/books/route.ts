// app/api/search/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    console.log("Book search API called");
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log("No session found - unauthorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    console.log("Search query received:", query);
    
    if (!query) {
      console.log("No search query provided");
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      console.error("Google Books API key is missing");
      return NextResponse.json(
        { message: "Configuration error - API key is missing" },
        { status: 500 }
      );
    }
    
    // Make request to Google Books API
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&key=${apiKey}`;
    console.log("Full Google Books API URL:", googleBooksUrl);
    // Log the URL with redacted API key for debugging
    const redactedUrl = googleBooksUrl.replace(apiKey, "REDACTED");
    console.log("Calling Google Books API:", redactedUrl);
    
    try {
      const response = await fetch(googleBooksUrl);
      
      // Log the status code
      console.log("Google Books API response status:", response.status);
      
      // Get the raw response for debugging
      const responseText = await response.text();
      console.log("Google Books API response preview:", responseText.substring(0, 200) + "...");
      
      // If not successful, return the error
      if (!response.ok) {
        console.error(`Google Books API error (${response.status}):`, responseText.substring(0, 500));
        return NextResponse.json(
          { message: `Error from Google Books API: ${response.status}` },
          { status: response.status }
        );
      }
      
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Successfully parsed Google Books response");
      } catch (e) {
        console.error("Failed to parse Google Books API response as JSON:", e);
        return NextResponse.json(
          { message: "Invalid response from Google Books API" },
          { status: 500 }
        );
      }
      
      // Check if we got results
      if (!data.items || data.items.length === 0) {
        console.log("No books found in the search results");
        return NextResponse.json({ books: [] });
      }
      
      console.log(`Found ${data.items.length} books in search results`);
      
      // Format the results
      const books = data.items.map((item: any) => ({
        googleBooksId: item.id,
        title: item.volumeInfo?.title || "Unknown Title",
        authors: item.volumeInfo?.authors || [],
        description: item.volumeInfo?.description || "",
        coverImage: item.volumeInfo?.imageLinks?.thumbnail || "",
        isbn: item.volumeInfo?.industryIdentifiers?.[0]?.identifier || "",
      }));
      
      return NextResponse.json({ books });
    } catch (fetchError: unknown) {
      console.error("Error fetching from Google Books API:", fetchError);
      
      // Handle the unknown type properly
      let errorMessage = "Failed to fetch from Google Books API";
      
      // Only access message property if it's an Error object
      if (fetchError instanceof Error) {
        errorMessage += `: ${fetchError.message}`;
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in book search API:", error);
    return NextResponse.json({ 
      message: "Server error", 
      details: error.message 
    }, { status: 500 });
  }
}