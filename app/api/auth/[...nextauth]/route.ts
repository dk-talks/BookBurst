// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "../auth"; // Import from the separate file

// Create the handler using imported authOptions
const handler = NextAuth(authOptions);

// Export only the handler methods
export { handler as GET, handler as POST };