import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Matches all paths except static files and _next folder
    '/',                      // Matches the root path
    '/api/(.*)',              // Matches all routes under /api
    '/callback',              // Matches the /callback route
    '/(trpc)(.*)',            // Matches all routes under /trpc
  ],
};
