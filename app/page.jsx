export default function Home() {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to BookBurst</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Your personal reading companion. Track books, share reviews, and discover your next great read.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold">Track Your Reading</h2>
            <p className="text-gray-600">
              Keep track of books you&apos;re reading, want to read, or have finished.
            </p>
          </div>
          
          <div className="rounded-lg bg-purple-50 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold">Write Reviews</h2>
            <p className="text-gray-600">
              Share your thoughts and insights with personalized book reviews.
            </p>
          </div>
          
          <div className="rounded-lg bg-green-50 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold">Discover New Books</h2>
            <p className="text-gray-600">
              Find your next favorite read based on community recommendations.
            </p>
          </div>
        </div>
      </div>
    );
  }