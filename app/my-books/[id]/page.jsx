"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RatingStars from "@/components/RatingStars";

export default function BookDetail({ params }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    
    if (status === "authenticated") {
      fetchBook();
    }
  }, [status, router, id]);
  
  const fetchBook = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/books/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch book");
      }
      
      const data = await response.json();
      setBook(data.book);
      setNotes(data.book.notes || "");
    } catch (err) {
      setError("Error loading book details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRatingChange = async (newRating) => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: newRating }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update rating");
      }
      
      const data = await response.json();
      setBook(data.book);
      setSaveMessage("Rating updated successfully!");
    } catch (err) {
      setError("Error updating rating. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }
  };
  
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };
  
  const saveNotes = async () => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save notes");
      }
      
      const data = await response.json();
      setBook(data.book);
      setSaveMessage("Notes saved successfully!");
    } catch (err) {
      setError("Error saving notes. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }
  };
  
  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded bg-red-100 p-4 text-red-800">{error}</div>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded bg-yellow-100 p-4 text-yellow-800">
          Book not found. It may have been removed.
        </div>
        <button
          onClick={() => router.push("/my-books")}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to My Books
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:underline"
      >
        <svg className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Books
      </button>
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="md:flex">
          <div className="mb-6 md:mb-0 md:mr-8 md:w-1/4">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="mx-auto h-auto w-full max-w-[200px] rounded shadow"
              />
            ) : (
              <div className="mx-auto flex h-64 w-full max-w-[200px] items-center justify-center rounded bg-gray-200 text-center text-gray-500">
                No Cover Available
              </div>
            )}
            
            <div className="mt-4">
              <div className="mb-2 text-center text-sm font-medium text-gray-600">Your Rating</div>
              <div className="flex justify-center">
                <RatingStars
                  initialRating={book.rating}
                  onRatingChange={handleRatingChange}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="mb-2 rounded-full px-4 py-1 text-center text-sm font-medium text-white" 
                   style={{
                     backgroundColor: 
                       book.status === "reading" ? "#F59E0B" : 
                       book.status === "finished" ? "#10B981" : 
                       "#3B82F6"
                   }}>
                {book.status === "reading" && "Currently Reading"}
                {book.status === "finished" && "Finished"}
                {book.status === "want-to-read" && "Want to Read"}
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <h1 className="mb-2 text-3xl font-bold">{book.title}</h1>
            <h2 className="mb-4 text-xl text-gray-600">
              {book.authors?.join(", ") || "Unknown Author"}
            </h2>
            
            {book.description && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Description</h3>
                <p className="text-gray-700">{book.description}</p>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-medium">Your Notes</h3>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                className="w-full rounded border p-2"
                rows={6}
                placeholder="Add your personal notes about this book..."
              />
              
              <div className="mt-2 flex items-center">
                <button
                  onClick={saveNotes}
                  disabled={isSaving}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSaving ? "Saving..." : "Save Notes"}
                </button>
                
                {saveMessage && (
                  <span className="ml-4 text-green-600">{saveMessage}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}