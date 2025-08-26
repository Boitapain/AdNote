import type { LayoutServerLoad } from './$types'
import type { Notes } from '$lib/types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
    const { session } = await safeGetSession()
    
    let notes: Notes = []
    if (session?.user?.id) {
        const { data } = await supabase
            .from('notes')
            .select('id, note')
            .eq('user_id', session.user.id)
            .order('id')
        notes = data ?? []
    }
    
    return {
        session,
        notes,
        cookies: cookies.getAll(),
    }
}