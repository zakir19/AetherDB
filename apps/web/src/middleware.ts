import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Check whether Clerk is properly configured.
 * When running locally without real keys the middleware must not
 * attempt to call the Clerk API – it would fail on every request.
 */
const isClerkConfigured =
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("CHANGE_ME");

async function clerkMiddlewareHandler(req: NextRequest) {
  // Dynamic import so the module is only loaded when keys are valid
  const { clerkMiddleware, createRouteMatcher } = await import(
    "@clerk/nextjs/server"
  );

  const isProtectedRoute = createRouteMatcher(["/builder(.*)"]);

  const handler = clerkMiddleware(async (auth, request) => {
    if (isProtectedRoute(request)) {
      await auth.protect();
    }
  });

  return handler(req, {} as any);
}

export default async function middleware(req: NextRequest) {
  if (!isClerkConfigured) {
    // Clerk not configured — let the request through
    return NextResponse.next();
  }
  return clerkMiddlewareHandler(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
