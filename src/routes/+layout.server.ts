import type { LayoutServerLoad } from './$types'
import type { Notes } from '$lib/types'
import { getUserNotes } from '$lib/repositories/notes'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
    const { session } = await safeGetSession()
    
    let notes: Notes = []
    if (session?.user?.id) {
        notes = await getUserNotes(session.user.id) ?? [];
        // console.log('📝 Notes loaded in root layout:', notes)
        // console.log('User ID:', session.user.id)
    }
    
    return {
        session,
        notes,
        cookies: cookies.getAll(),
    }
}