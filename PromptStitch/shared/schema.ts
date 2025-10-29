import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  description: text("description"),
  categoryId: varchar("category_id"),
  tags: json("tags").$type<string[]>().default([]),
  isFavorite: boolean("is_favorite").default(false),
  isArchived: boolean("is_archived").default(false),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon").default("fas fa-folder"),
  color: text("color").default("#8B5CF6"),
  parentId: varchar("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usageHistory = pgTable("usage_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  promptId: varchar("prompt_id").notNull(),
  target: text("target"), // e.g., "ChatGPT", "Claude", "Gemini"
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: json("metadata").$type<Record<string, any>>().default({}),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default("settings"),
  theme: text("theme").default("dark"),
  autoSave: boolean("auto_save").default(true),
  syncEnabled: boolean("sync_enabled").default(false),
  syncProvider: text("sync_provider"), // "google_drive", "dropbox", etc.
  exportFormat: text("export_format").default("json"),
  particleEffects: boolean("particle_effects").default(true),
  soundEffects: boolean("sound_effects").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUsedAt: true,
}).extend({
  tags: z.array(z.string()).optional(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertUsageHistorySchema = createInsertSchema(usageHistory).omit({
  id: true,
  timestamp: true,
});

export const updateSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type UsageHistory = typeof usageHistory.$inferSelect;
export type InsertUsageHistory = z.infer<typeof insertUsageHistorySchema>;
export type Settings = typeof settings.$inferSelect;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;
