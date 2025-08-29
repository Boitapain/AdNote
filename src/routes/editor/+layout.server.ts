import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, parent }) => {
    const { session } = await safeGetSession()
    
    // Redirection si pas connecté
    if (!session) {
        redirect(303, '/auth')
    }
    
    // Get parent layout data (including notes)
    const parentData = await parent()
    // console.log('🔍 Dashboard server - parent data:', parentData)
    
    // Return parent data + any dashboard-specific data
    return {
        ...parentData,
        session,
        cookies: cookies.getAll(),
    }
}