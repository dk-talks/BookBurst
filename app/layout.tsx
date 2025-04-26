// app/layout.tsx
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import "./globals.css";
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BookBurst - Track Your Reading Journey',
  description: 'A personal reading tracker and social discovery platform for book lovers',
  keywords: 'books, reading, tracker, bookshelf, reviews',
};


export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-100 py-6">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>© {new Date().getFullYear()} BookBurst. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}