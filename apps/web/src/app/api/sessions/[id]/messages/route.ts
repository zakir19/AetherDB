import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, and, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { resolveUser } from "@/lib/db/resolve-user";

const DB_ENABLED = !!process.env.DATABASE_URL;

/* ── POST /api/sessions/[id]/messages — add a message ── */
export async function POST(
  req: NextRequest,
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
    const body = await req.json();
    const { role, content, schema: schemaData, preview, model, provider } = body;

    if (!role || !content) {
      return NextResponse.json({ error: "role and content are required" }, { status: 400 });
    }

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

    // Insert message
    const [msg] = await db
      .insert(schema.messages)
      .values({
        sessionId,
        role,
        content,
        schema: schemaData ?? null,
        preview: preview ?? null,
        model: model ?? null,
        provider: provider ?? null,
      })
      .returning();

    // Update session message count + timestamp
    await db
      .update(schema.chatSessions)
      .set({
        messageCount: sql`${schema.chatSessions.messageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.chatSessions.id, sessionId));

    return NextResponse.json({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      schema: msg.schema,
      preview: msg.preview,
      model: msg.model,
      provider: msg.provider,
    });
  } catch (e: any) {
    console.error("POST /api/sessions/[id]/messages error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
