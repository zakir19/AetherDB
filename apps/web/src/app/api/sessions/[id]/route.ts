import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, and, asc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { resolveUser } from "@/lib/db/resolve-user";

const DB_ENABLED = !!process.env.DATABASE_URL;

/* ── GET /api/sessions/[id] — get session with all messages ── */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!DB_ENABLED) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const db = getDb();
    const user = await resolveUser(clerkId);

    // Verify session belongs to user
    const [session] = await db
      .select()
      .from(schema.chatSessions)
      .where(
        and(
          eq(schema.chatSessions.id, sessionId),
          eq(schema.chatSessions.userId, user.id)
        )
      )
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const msgs = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.sessionId, sessionId))
      .orderBy(asc(schema.messages.createdAt));

    return NextResponse.json({
      session: {
        id: session.id,
        title: session.title,
        timestamp: session.updatedAt.toISOString(),
        messageCount: session.messageCount,
      },
      messages: msgs.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        schema: m.schema,
        preview: m.preview,
        model: m.model,
        provider: m.provider,
      })),
    });
  } catch (e: any) {
    console.error("GET /api/sessions/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ── DELETE /api/sessions/[id] — delete a session ── */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!DB_ENABLED) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const db = getDb();
    const user = await resolveUser(clerkId);

    // Only delete if belongs to user
    await db
      .delete(schema.chatSessions)
      .where(
        and(
          eq(schema.chatSessions.id, sessionId),
          eq(schema.chatSessions.userId, user.id)
        )
      );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/sessions/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
