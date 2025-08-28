// src/lib/repositories/notes.ts
import { db } from "$lib/database";
import { notes } from "$lib/schema";
import { and, eq, sql } from "drizzle-orm";

export async function createNote(userId: string, title: string = '', content: any = null) {
    const inserted = await db.insert(notes).values({ userId, title, content }).returning();
    
    return inserted[0]; 
}

export async function updateNote(id: string, title: string, content: any) {
    return db
        .update(notes)
        .set({ title, content, updatedAt: sql`now()` })
        .where(eq(notes.id, id))
        .returning();
}

export async function deleteNote(id: string, userId: string) {
    return db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId))).returning();
}

export async function getUserNotes(userId: string) {
    try {
        const result = await db.select().from(notes).where(eq(notes.userId, userId));
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getNote(noteId: string, userId: string) {
    try {
        const result = await db.select().from(notes).where(and(eq(notes.id, noteId), eq(notes.userId, userId)));
        return result;
    } catch (error) {
        throw error;
    }
}
