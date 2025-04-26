// components/ReviewList.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import RatingStars from "./RatingStars";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  reviewText: string;
  isPublic: boolean;
  createdAt: string;
}

interface ReviewListProps {
  googleBooksId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ googleBooksId, refreshTrigger = 0 }: ReviewListProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await fetch(
          `/api/reviews?googleBooksId=${googleBooksId}&isPublic=true`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        
        const data = await response.json();
        setReviews(data.reviews);
      } catch (err: any) {
        setError(err.message || "Error loading reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [googleBooksId, refreshTrigger]);
  
  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }
  
  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to review this book!
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="rounded-lg border p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 text-center leading-10">
                {review.user.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  review.user.name.charAt(0)
                )}
              </div>
              <div className="ml-3">
                <h4 className="font-medium">{review.user.name}</h4>
                <div className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>
            
            <div>
              
            </div>
          </div>
          
          <p className="mt-3 text-gray-700">{review.reviewText}</p>
          
          {session?.user?.id && review.user._id && session.user.id === review.user._id && (
            <div className="mt-3 text-right">
                <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => {
                    // Add edit functionality here
                }}
                >
                Edit
                </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}