import { NextRequest } from 'next/server';
import { getUserClient, getUserFromToken } from '../../../lib/supabaseServer';

// GET /api/summaries — list current user's summaries
export async function GET(req: NextRequest) {
	try {
		const auth = req.headers.get('authorization') || '';
		const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
		if (!token) return Response.json({ error: 'Missing auth token' }, { status: 401 });
		await getUserFromToken(token);
		const userClient = getUserClient(token);
		const { data, error } = await userClient
			.from('summaries')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(100);
		if (error) return Response.json({ error: 'Failed to fetch summaries' }, { status: 500 });
		return Response.json({ summaries: data || [] });
	} catch (e: any) {
		return Response.json({ error: e.message || 'Internal error' }, { status: 500 });
	}
}

