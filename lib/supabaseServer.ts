import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnon = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function getAdminClient(): SupabaseClient {
	return createClient(supabaseUrl, supabaseServiceRole || supabaseAnon, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
}

export function getUserClient(accessToken: string): SupabaseClient {
	return createClient(supabaseUrl, supabaseAnon, {
		global: { headers: { Authorization: `Bearer ${accessToken}` } },
		auth: { autoRefreshToken: false, persistSession: false }
	});
}

export async function getUserFromToken(accessToken: string) {
	// Per security guideline, verify on server using getUser(jwt)
	const anon = createClient(supabaseUrl, supabaseAnon, { auth: { autoRefreshToken: false, persistSession: false } });
	const { data, error } = await anon.auth.getUser(accessToken);
	if (error || !data?.user) {
		throw new Error('Unauthorized');
	}
	return data.user;
}

