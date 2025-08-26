import type { LayoutServerLoad } from './$types'
import type { Notes } from '$lib/types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
    const { session } = await safeGetSession()
    
    let notes: Notes = []
    if (session?.user?.id) {
        const { data } = await supabase
            .from('notes')
            .select('id, user_id, title, content, created_at, updated_at')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
        notes = data ?? []
        // console.log('📝 Notes loaded in root layout:', notes)
        // console.log('User ID:', session.user.id)
    }
    
    return {
        session,
        notes,
        cookies: cookies.getAll(),
    }
}