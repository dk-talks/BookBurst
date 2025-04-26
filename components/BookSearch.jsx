// components/BookSearch.jsx
"use client";

import { useState } from "react";

// Add this function to your BookSearch component
const testSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    
    try {
      // Use a fixed, known-good query
      const testQuery = "harry potter";
      console.log("Testing search with query:", testQuery);
      
      const response = await fetch(`/api/search/books?q=${encodeURIComponent(testQuery)}`);
      console.log("Test search response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Test search failed (${response.status}):`, errorText);
        throw new Error(`Test search failed: Status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Test search results:", data);
      
      setResults(data.books || []);
    } catch (err) {
      console.error("Test search error:", err);
      setError("Test search error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
  
  // Add a test button to your component
  <button
    type="button"
    onClick={testSearch}
    className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
  >
    Test Search API
  </button>

export default function BookSearch({ onBookSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const searchBooks = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError("");
    setResults([]);
    
    try {
      console.log("Searching for books with query:", query);
      
      // Log the actual URL being used
      const searchUrl = `/api/search/books?q=${encodeURIComponent(query)}`;
      console.log("Request URL:", searchUrl);
      
      const response = await fetch(searchUrl);
      
      console.log("Search response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Search failed (${response.status}):`, errorText);
        throw new Error(`Search failed: Status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Search results:", data);
      
      setResults(data.books || []);
    } catch (err) {
      console.error("Book search error:", err);
      setError("Error searching books: " + (err.message || "Please try again"));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks();
  };
  
  return (
    <div className="mb-8 w-full">
      <form onSubmit={handleSubmit} className="mb-4 flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="flex-grow rounded-l border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-r bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      
      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-800">
          {error}
        </div>
      )}
      
      {results.length > 0 ? (
        <div className="overflow-hidden rounded-lg border shadow">
          <div className="grid max-h-80 gap-4 overflow-y-auto p-4 md:grid-cols-2">
            {results.map((book) => (
              <div
                key={book.googleBooksId}
                className="flex cursor-pointer rounded border p-3 hover:bg-gray-50"
                onClick={() => onBookSelect(book)}
              >
                <div className="mr-4 min-w-[70px]">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-auto w-full rounded"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded bg-gray-200 text-gray-500">
                      No Cover
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    {book.authors.join(", ") || "Unknown Author"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-4">Searching for books...</div>
      ) : query.trim() && !error ? (
        <div className="text-center py-4 text-gray-500">No books found matching your search</div>
      ) : null}
    </div>
  );
}