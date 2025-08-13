import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anon) return null;
	if (!cachedClient) {
		cachedClient = createClient(url, anon);
	}
	return cachedClient;
}

