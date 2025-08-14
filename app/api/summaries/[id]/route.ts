import { NextRequest } from 'next/server';
import { getUserClient, getUserFromToken } from '../../../../lib/supabaseServer';

// DELETE /api/summaries/:id — delete a summary owned by the user (RLS enforced)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const auth = req.headers.get('authorization') || '';
		const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
		if (!token) return Response.json({ error: 'Missing auth token' }, { status: 401 });
		await getUserFromToken(token);
		const userClient = getUserClient(token);
		const id = params.id;
		if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
		const { error } = await userClient.from('summaries').delete().eq('id', id);
		if (error) return Response.json({ error: 'Failed to delete' }, { status: 500 });
		return new Response(null, { status: 204 });
	} catch (e: any) {
		return Response.json({ error: e.message || 'Internal error' }, { status: 500 });
	}
}

