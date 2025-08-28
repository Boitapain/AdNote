// src/lib/schema.ts
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";


// Define the "notes" table
export const notes = pgTable("notes", {
    id: uuid("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),

    userId: uuid("user_id").notNull(),

    title: text("title").notNull(),

    content: jsonb("content").$type<Record<string, any> | null>(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
