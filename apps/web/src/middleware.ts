import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isClerkConfigured =
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes("CHANGE_ME");

async function clerkMiddlewareHandler(req: NextRequest) {
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
    return NextResponse.next();
  }
  return clerkMiddlewareHandler(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
