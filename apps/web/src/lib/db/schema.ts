import { pgTable, text, timestamp, integer, jsonb, uuid } from "drizzle-orm/pg-core";

/* ── Users ─────────────────────────────────────────────────────
   Synced from Clerk via webhook or on first API call.
   `clerk_id` is the canonical identifier from Clerk. */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ── Chat sessions ─────────────────────────────────────────── */
export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("New Chat"),
  messageCount: integer("message_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ── Messages ──────────────────────────────────────────────── */
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "error"] }).notNull(),
  content: text("content").notNull(),
  schema: jsonb("schema"),
  preview: text("preview"),
  model: text("model"),
  provider: text("provider"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ── Type exports for use in API routes ────────────────────── */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ChatSessionRow = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type MessageRow = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
