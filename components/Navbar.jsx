"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              BookBurst
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden space-x-4 md:flex">
            <Link href="/" className="hover:text-blue-200">
              Home
            </Link>
            
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <Link href="/my-books" className="hover:text-blue-200">
                  My Books
                </Link>
                {/* <Link href="/discover" className="hover:text-blue-200">
                  Discover
                </Link> */}
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:text-blue-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link href="/register" className="hover:text-blue-200">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link 
                href="/"
                className="block px-3 py-2 hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {status === "authenticated" ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="block px-3 py-2 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/my-books"
                    className="block px-3 py-2 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Books
                  </Link>
                  <Link 
                    href="/discover"
                    className="block px-3 py-2 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Discover
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full px-3 py-2 text-left hover:bg-blue-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="block px-3 py-2 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="block px-3 py-2 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}