import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { resolveUser } from "@/lib/db/resolve-user";

const DB_ENABLED = !!process.env.DATABASE_URL;

/* ── GET /api/sessions — list sessions for authenticated user ── */
export async function GET() {
  if (!DB_ENABLED) {
    return NextResponse.json({ sessions: [] });
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const user = await resolveUser(clerkId);

    const sessions = await db
      .select()
      .from(schema.chatSessions)
      .where(eq(schema.chatSessions.userId, user.id))
      .orderBy(desc(schema.chatSessions.updatedAt));

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        title: s.title,
        timestamp: s.updatedAt.toISOString(),
        messageCount: s.messageCount,
      })),
    });
  } catch (e: any) {
    console.error("GET /api/sessions error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ── POST /api/sessions — create a new session ── */
export async function POST(req: NextRequest) {
  if (!DB_ENABLED) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();
    const db = getDb();
    const user = await resolveUser(clerkId);

    const [session] = await db
      .insert(schema.chatSessions)
      .values({ userId: user.id, title: title || "New Chat" })
      .returning();

    return NextResponse.json({
      id: session.id,
      title: session.title,
      timestamp: session.updatedAt.toISOString(),
      messageCount: session.messageCount,
    });
  } catch (e: any) {
    console.error("POST /api/sessions error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ── DELETE /api/sessions — delete all sessions (reset) ── */
export async function DELETE() {
  if (!DB_ENABLED) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const user = await resolveUser(clerkId);

    await db
      .delete(schema.chatSessions)
      .where(eq(schema.chatSessions.userId, user.id));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/sessions error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
