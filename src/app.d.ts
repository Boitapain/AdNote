import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from './database.types' // import generated types
import type { Notes } from '$lib/types' // import notes type

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
			session: Session | null
			user: User | null
		}
		interface PageData {
			session: Session | null
			supabase?: SupabaseClient<Database>
			notes?: Notes
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { }