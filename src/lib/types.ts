// src/lib/types.ts
export interface Note {
    id: string;
    userId: string;          // matches `user_id` in schema
    title: string;
    content: Record<string, any> | null;  // matches jsonb type
    createdAt: Date;       // matches `created_at` timestamp
    updatedAt: Date;       // matches `updated_at` timestamp
}

export type Notes = Note[];
