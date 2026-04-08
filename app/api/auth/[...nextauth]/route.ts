import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// NextAuth handler
const handler = NextAuth(authOptions);

// Export GET and POST for App Router
export { handler as GET, handler as POST };