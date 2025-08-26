export interface Note {
    id: string;
    user_id: string;
    title: string;
    content: any;
    created_at: string;
    updated_at: string;
}

export type Notes = Note[];
