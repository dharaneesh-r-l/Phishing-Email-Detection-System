
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  emailId: text("email_id"),
  subject: text("subject"),
  content: text("content").notNull(),
  prediction: text("prediction").notNull(), // "Phishing" or "Legitimate"
  confidence: real("confidence").notNull(), // 0.0 to 1.0
  probability: real("probability").notNull(), // 0.0 to 1.0 (phishing prob)
  stats: jsonb("stats").notNull(), // { wordCount, urlCount, specialCharCount, etc. }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanSchema = createInsertSchema(scans).omit({ 
  id: true, 
  createdAt: true 
});

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;

// Request type
export type AnalyzeRequest = {
  emailId?: string;
  subject?: string;
  content: string;
};

// Response type
export type AnalyzeResponse = Scan;
