import type { PageServerLoad, Actions } from './$types';
import { getNote, updateNote } from '$lib/repositories/notes';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
    const userId = locals.session?.user?.id; // Ensure the user is authenticated
    if (!userId) throw error(401, 'Unauthorized');

    const noteId = params.id; // Get the note ID from the route parameters
    if (!noteId) throw error(400, 'Missing note ID');

    const note = await getNote(noteId, userId); // Fetch the note using the existing `getNote` function
    if (!note || note.length === 0) throw error(404, 'Note not found');

    return {
        note: note[0], // Pass the first (and only) note to the frontend
    };
};