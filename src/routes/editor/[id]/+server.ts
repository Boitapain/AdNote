import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { deleteNote, updateNote } from '$lib/repositories/notes';

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const userId = (locals as any).user?.id ?? (locals as any).session?.user?.id;
    if (!userId) throw error(401, 'Unauthorized');

    const id = params.id;
    if (!id) throw error(400, 'Missing id');

    await deleteNote(id, userId);
    return new Response(null, { status: 204 });
};

// PATCH request to update a note
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const userId = (locals as any).user?.id ?? (locals as any).session?.user?.id;
    if (!userId) throw error(401, 'Unauthorized');

    const noteId = params.id;
    if (!noteId) throw error(400, 'Missing note ID');

    const { title, content } = await request.json(); // Parse the request body

    const updatedNote = await updateNote(noteId, title, content); // Update the note using the existing `updateNote` function
    if (!updatedNote || updatedNote.length === 0) throw error(500, 'Failed to update note');

    return new Response(JSON.stringify({ success: true }), { status: 200 });
};