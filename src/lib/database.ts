// src/lib/database.ts
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { DATABASE_URL } from '$env/static/private';

// Supabase client (still used in hooks + some pages)
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// Drizzle client (for type-safe Postgres queries)
const client = postgres(DATABASE_URL, { ssl: 'require' }); // Supabase Postgres usually needs SSL
export const db = drizzle(client);
