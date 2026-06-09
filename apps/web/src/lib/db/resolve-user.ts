import { eq } from "drizzle-orm";
import { getDb, schema } from "./index";

export async function resolveUser(clerkId: string, meta?: { name?: string; email?: string; imageUrl?: string }) {
  const db = getDb();

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.clerkId, clerkId))
    .limit(1);

  if (existing) {
    if (
      meta &&
      (meta.name !== existing.name ||
        meta.email !== existing.email ||
        meta.imageUrl !== existing.imageUrl)
    ) {
      await db
        .update(schema.users)
        .set({
          name: meta.name ?? existing.name,
          email: meta.email ?? existing.email,
          imageUrl: meta.imageUrl ?? existing.imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, existing.id));
    }
    return existing;
  }

  const [newUser] = await db
    .insert(schema.users)
    .values({
      clerkId,
      name: meta?.name ?? "",
      email: meta?.email ?? "",
      imageUrl: meta?.imageUrl,
    })
    .returning();

  return newUser;
}
