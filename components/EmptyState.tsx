// components/EmptyState.tsx
"use client";

export default function EmptyState({ 
  message, 
  actionText, 
  onAction 
}: { 
  message: string,
  actionText?: string,
  onAction?: () => void
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-8 text-center">
      <svg 
        className="mx-auto h-12 w-12 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
        />
      </svg>
      <p className="mt-4 text-gray-600">{message}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}