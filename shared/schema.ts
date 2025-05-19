// ...existing code...
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Resume skills schemas
export const skillSchema = z.object({
  name: z.string(),
  category: z.enum(["technical", "soft", "languages"]),
  description: z.string().optional(),
});

export const resumeInputSchema = z.object({
  text: z.string().optional(),
  fileContent: z.string().optional(),
}).refine(data => data.text || data.fileContent, {
  message: "Either resume text or file content must be provided",
});

export const extractSkillsResponseSchema = z.object({
  skills: z.array(skillSchema),
  suggestions: z.array(z.string()).optional(),
});

export type Skill = z.infer<typeof skillSchema>;
export type ResumeInput = z.infer<typeof resumeInputSchema>;
export type ExtractSkillsResponse = z.infer<typeof extractSkillsResponseSchema>;
