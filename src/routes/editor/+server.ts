import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { createNote } from '$lib/repositories/notes';

export const POST: RequestHandler = async ({ locals }) => {
    // adapt to how you store the logged user in locals
    const userId = (locals as any).user?.id ?? (locals as any).session?.user?.id;
    if (!userId) throw redirect(303, '/auth');

    const newRow = await createNote(userId, 'New Document', '');
    const id = newRow?.id;
    if (!id) throw new Error('Failed to create note');

    // redirect the browser to the editor page for the new note
    throw redirect(303, `/editor/${id}`);
};