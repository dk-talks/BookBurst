// components/ReviewForm.tsx
"use client";

import { useState } from "react";
import RatingStars from "./RatingStars";

interface ReviewFormProps {
  bookId: string;
  googleBooksId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ bookId, googleBooksId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (!rating) {
      setError("Please select a rating");
      setLoading(false);
      return;
    }
    
    if (!reviewText.trim()) {
      setError("Please write a review");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleBooksId,
          rating,
          reviewText,
          isPublic,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error submitting review");
      }
      
      setSuccess("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      
      // Notify parent component
      onReviewSubmitted();
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 text-xl font-semibold">Write a Review</h3>
      
      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</div>
      )}
      
      {success && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-800">{success}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block font-medium">Your Rating</label>
          <RatingStars 
            initialRating={rating} 
            onRatingChange={(value) => setRating(value)} 
          />
        </div>
        
        <div className="mb-4">
          <label className="mb-2 block font-medium" htmlFor="reviewText">
            Your Review
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full rounded border p-2"
            rows={5}
            placeholder="Share your thoughts about this book..."
          />
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2"
            />
            <span>Make this review public</span>
          </label>
          <p className="mt-1 text-sm text-gray-600">
            Public reviews will be visible to other users
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}