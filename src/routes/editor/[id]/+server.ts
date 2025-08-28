import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { deleteNote } from '$lib/repositories/notes';

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const userId = (locals as any).user?.id ?? (locals as any).session?.user?.id;
    if (!userId) throw error(401, 'Unauthorized');

    const id = params.id;
    if (!id) throw error(400, 'Missing id');

    await deleteNote(id, userId);
    return new Response(null, { status: 204 });
};