// components/ErrorDisplay.tsx
"use client";

export default function ErrorDisplay({ 
  message, 
  retry 
}: { 
  message: string,
  retry?: () => void
}) {
  return (
    <div className="rounded-lg bg-red-50 p-6 text-center">
      <svg 
        className="mx-auto h-12 w-12 text-red-500" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      </svg>
      <h3 className="mt-3 text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="mt-2 text-red-700">{message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}