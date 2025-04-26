// components/RatingStars.tsx
"use client";

import { useState } from "react";

interface RatingStarsProps {
  initialRating: number | null;
  onRatingChange?: (rating: number) => void; // Make this optional with the ? symbol
  readOnly?: boolean;
}

export default function RatingStars({ 
  initialRating, 
  onRatingChange, 
  readOnly = false 
}: RatingStarsProps) {
  const [rating, setRating] = useState<number>(initialRating || 0);
  const [hover, setHover] = useState<number>(0);
  
  const handleClick = (newRating: number) => {
    if (readOnly) return;
    
    setRating(newRating);
    onRatingChange && onRatingChange(newRating);
  };
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <button
            type="button"
            key={ratingValue}
            className={`text-2xl ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => !readOnly && setHover(ratingValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            <span className="star">
              <svg
                className={`h-6 w-6 ${
                  ratingValue <= (hover || rating) ? "text-yellow-500" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          </button>
        );
      })}
    </div>
  );
}