import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession()
    
    // Notes are loaded at layout level, no need to load them here
    // Just return any page-specific data if needed
    return {}
}