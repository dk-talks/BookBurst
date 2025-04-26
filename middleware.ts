// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Middleware token check:", !!token);

  // Get the pathname of the request
  const { pathname } = req.nextUrl;
  console.log("Middleware processing path:", pathname);

  // Protect routes that require authentication
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/my-books")) {
    if (!token) {
      console.log("Unauthorized access, redirecting to login");
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users from login/register to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    console.log("Already authenticated, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/my-books/:path*", "/login", "/register"],
};