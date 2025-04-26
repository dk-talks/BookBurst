"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
        
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link 
          href="/my-books"
          className="flex h-48 flex-col items-center justify-center rounded-lg bg-blue-100 p-6 text-center transition hover:bg-blue-200"
        >
          <h2 className="mb-2 text-2xl font-semibold">My Bookshelf</h2>
          <p className="text-gray-600">Manage your reading list and track your progress</p>
        </Link>
        
        {/* <Link 
          href="/discover"
          className="flex h-48 flex-col items-center justify-center rounded-lg bg-purple-100 p-6 text-center transition hover:bg-purple-200"
        >
          <h2 className="mb-2 text-2xl font-semibold">Discover Books</h2>
          <p className="text-gray-600">Find new books and see what others are reading</p>
        </Link> */}
        
        <Link 
          href="/profile"
          className="flex h-48 flex-col items-center justify-center rounded-lg bg-green-100 p-6 text-center transition hover:bg-green-200"
        >
          <h2 className="mb-2 text-2xl font-semibold">My Profile</h2>
          <p className="text-gray-600">Update your profile and manage settings</p>
        </Link>
      </div>
    </div>
  );
}