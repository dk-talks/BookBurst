"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BookSearch from "@/components/BookSearch";
import BookCard from "@/components/BookCard";
import { useCookies } from "react-cookie";

export default function MyBooks() {
    const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingBook, setIsAddingBook] = useState(false);
  // Use the official useCookies hook
  const [cookies, setCookie] = useCookies(["lastBookshelfTab"]);
  
  // Set last active tab from cookie when component mounts
  useEffect(() => {
    if (cookies.lastBookshelfTab) {
      setActiveTab(cookies.lastBookshelfTab);
    }
  }, [cookies.lastBookshelfTab]);
  
  // Fetch books when component mounts or tab changes
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    
    if (status === "authenticated") {
      fetchBooks(activeTab);
    }
  }, [status, router, activeTab]);
  
  // Save active tab to cookie when it changes
  useEffect(() => {
    setCookie("lastBookshelfTab", activeTab, { path: "/" });
  }, [activeTab, setCookie]);
  

  const fetchBooks = async (tabStatus) => {
    setLoading(true);
    setError("");
    
    try {
      let url = "/api/books";
      
      if (tabStatus !== "all") {
        url += `?status=${tabStatus}`;
      }
      
      console.log("Fetching books from:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching books: Status ${response.status}`, errorText);
        throw new Error(`Failed to fetch books: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Books fetched successfully:", data.books.length);
      setBooks(data.books);
    } catch (err) {
      console.error("Error in fetchBooks:", err);
      setError("Error loading books. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleAddBook = async (book) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add book");
      }
      
      // Refresh book list after adding
      fetchBooks(activeTab);
      setIsAddingBook(false);
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };
  
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookshelf</h1>
        
        <button
          onClick={() => setIsAddingBook(!isAddingBook)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {isAddingBook ? "Cancel" : "Add Book"}
        </button>
      </div>
      
      {isAddingBook && (
        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Add a New Book</h2>
          <BookSearch onBookSelect={handleAddBook} />
        </div>
      )}
      
      <div className="mb-6 border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 ${
              activeTab === "all"
                ? "border-b-2 border-blue-600 font-medium text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("all")}
          >
            All Books
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "reading"
                ? "border-b-2 border-blue-600 font-medium text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("reading")}
          >
            Currently Reading
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "finished"
                ? "border-b-2 border-blue-600 font-medium text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("finished")}
          >
            Finished
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "want-to-read"
                ? "border-b-2 border-blue-600 font-medium text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("want-to-read")}
          >
            Want to Read
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center">
          <div className="text-xl">Loading books...</div>
        </div>
      ) : error ? (
        <div className="rounded bg-red-100 p-4 text-red-800">{error}</div>
      ) : books.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No books in this shelf yet</h3>
          <p className="mb-4 text-gray-600">
            Add some books to start building your collection
          </p>
          <button
            onClick={() => setIsAddingBook(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onStatusChange={() => fetchBooks(activeTab)}
              onDelete={() => fetchBooks(activeTab)}
            />
          ))}
        </div>
      )}
    </div>
  );
}