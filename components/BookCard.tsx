// components/BookCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookType } from "../app/types";

interface BookCardProps {
  book: BookType;  // Use the same BookType interface from above
  onStatusChange?: () => void;
  onDelete?: () => void;
  isDiscoverCard?: boolean;
  onView?: () => void;
}

export default function BookCard({ 
  book, 
  onStatusChange, 
  onDelete,
  isDiscoverCard = false,
  onView 
}: BookCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const router = useRouter();
  
  const handleStatusChange = async (newStatus: string) => {
    if (isDiscoverCard) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/books/${book._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update book status");
      }
      
      onStatusChange && onStatusChange();
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (isDiscoverCard) return;
    
    try {
      const response = await fetch(`/api/books/${book._id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }
      
      onDelete && onDelete();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };
  
  const getStatusBadgeColor = (status: string | undefined) => {
    switch (status) {
      case "reading":
        return "bg-yellow-100 text-yellow-800";
      case "finished":
        return "bg-green-100 text-green-800";
      case "want-to-read":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = () => {
    if (isDiscoverCard && onView) {
      onView();
    } else if (!isDiscoverCard) {
      router.push(`/my-books/${book._id}`);
    }
  };

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showStatusDropdown && !(event.target as HTMLElement).closest('.dropdown')) {
        setShowStatusDropdown(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);
  
  
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm transition hover:shadow">
      <div className="flex h-full flex-col">
        <div 
          className="flex cursor-pointer p-4" 
          onClick={handleView}
        >
          <div className="mr-4 w-20 flex-shrink-0">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-auto w-full rounded"
              />
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded bg-gray-200 text-center text-gray-500">
                No Cover
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold">{book.title}</h3>
              
              {!isDiscoverCard && (
                <span className={`rounded-full px-2 py-1 text-xs ${getStatusBadgeColor(book.status || "")}`}>
                  {book.status === "reading" && "Reading"}
                  {book.status === "finished" && "Finished"}
                  {book.status === "want-to-read" && "Want to Read"}
                </span>
              )}
            </div>
            
            <p className="mb-2 text-sm text-gray-600">
              {book.authors?.join(", ") || "Unknown Author"}
            </p>
            
            {book.rating && (
              <div className="mb-2 flex items-center">
                <span className="mr-1 text-sm text-gray-600">Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < (book.rating || 0) ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
            
            {isDiscoverCard && book.user && (
              <p className="text-xs text-gray-500">
                Added by: {book.user.name}
              </p>
            )}
            
            {isDiscoverCard && book.reviewCount && (
              <p className="text-xs text-gray-500">
                {book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'}
              </p>
            )}
          </div>
        </div>
        
        {!isDiscoverCard && (
          <div className="mt-auto border-t bg-gray-50 p-3">
            <div className="flex justify-between">
              


            <div className="dropdown relative">
                <button
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={isUpdating}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering handleView
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                >
                  {isUpdating ? "Updating..." : "Change Status"}
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-0 left-0 -translate-y-full mt-2 w-40 rounded border bg-white shadow-lg z-50">
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering handleView
                        handleStatusChange("reading");
                        setShowStatusDropdown(false);
                      }}
                    >
                      Reading
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering handleView
                        handleStatusChange("finished");
                        setShowStatusDropdown(false);
                      }}
                    >
                      Finished
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering handleView
                        handleStatusChange("want-to-read");
                        setShowStatusDropdown(false);
                      }}
                    >
                      Want to Read
                    </button>
                  </div>
                )}
              </div>
              
              
              <button
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                onClick={() => setShowConfirmDelete(true)}
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Delete Book</h3>
            <p className="mb-6">
              Are you sure you want to remove &quot;{book.title}&quot; from your bookshelf?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                onClick={() => {
                  handleDelete();
                  setShowConfirmDelete(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}