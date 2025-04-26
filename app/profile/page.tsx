// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    reading: 0,
    finished: 0,
    wantToRead: 0,
    total: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    
    if (status === "authenticated" && session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
      setLoading(false);
      
      // Fetch user's reading statistics
      const fetchStats = async () => {
        try {
          const response = await fetch("/api/stats");
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };
      
      fetchStats();
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
    } catch (error: Error | unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error:", errorMessage);
      }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="rounded-lg bg-white p-6 shadow-md">
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded bg-green-100 p-3 text-green-800">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border p-2"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium" htmlFor="image">
              Profile Image URL
            </label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/your-image.jpg"
              className="w-full rounded border p-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a URL to an image or leave blank for default avatar
            </p>
          </div>

          {image && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium">Preview</p>
              <div className="h-24 w-24 overflow-hidden rounded-full border">
                <img
                  src={image}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      name
                    )}&background=random`;
                  }}
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Email</label>
            <p className="rounded bg-gray-100 p-2 text-gray-700">
              {session?.user?.email}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Reading Statistics</h2>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-sm text-gray-600">Currently Reading</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.reading}
            </p>
          </div>
          
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm text-gray-600">Finished</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.finished}
            </p>
          </div>
          
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <p className="text-sm text-gray-600">Want to Read</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats.wantToRead}
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Total Books</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
      </div>
    </div>
  );
}