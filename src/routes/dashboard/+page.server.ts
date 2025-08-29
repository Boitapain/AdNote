import type { PageServerLoad } from './$types';
import { getUserNotes } from '$lib/repositories/notes';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    
    if (!session?.user?.id) {
        return {
            notes: []
        };
    }

    try {
        // Force reload notes from database
        const notes = await getUserNotes(session.user.id);
        return {
            notes: notes || []
        };
    } catch (error) {
        console.error('Error loading notes in dashboard:', error);
        return {
            notes: []
        };
    }
};