import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
    const token_hash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type') as EmailOtpType | null
    const next = url.searchParams.get('next') ?? '/dashboard'
    const code = url.searchParams.get('code')

    console.log('Confirm callback params:', { token_hash, type, next, code })

    /**
     * Clean up the redirect URL by deleting the Auth flow parameters.
     *
     * `next` is preserved for now, because it's needed in the error case.
     */
    const redirectTo = new URL(url)
    redirectTo.pathname = next
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')
    redirectTo.searchParams.delete('code')

    // Handle OAuth callback (GitHub, etc.)
    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data?.session) {
            console.log('OAuth success, redirecting to:', next)
            redirectTo.searchParams.delete('next')
            redirect(303, redirectTo)
        } else {
            console.error('OAuth exchange error:', error)
        }
    }

    // Handle email verification (existing logic)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash })
        if (!error) {
            console.log('Email verification success, redirecting to:', next)
            redirectTo.searchParams.delete('next')
            redirect(303, redirectTo)
        } else {
            console.error('Email verification error:', error)
        }
    }

    console.log('Auth failed, redirecting to error page')
    redirectTo.pathname = '/auth/error'
    redirect(303, redirectTo)
}