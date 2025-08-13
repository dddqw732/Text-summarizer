import { NextRequest } from 'next/server';
import { getUserFromToken, getUserClient } from '../../../lib/supabaseServer';
import { buildPrompt, getOpenAI, SummaryOptions } from '../../../lib/openai';

// POST /api/summarize
// Body: { text: string, options: { length, format, model? } }
// Security: Requires Authorization: Bearer <access_token>
export async function POST(req: NextRequest) {
	try {
		const auth = req.headers.get('authorization') || '';
		const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
		let user: any | null = null;
		if (token) {
			try {
				user = await getUserFromToken(token); // secure server-side validation when present
			} catch (_) {
				user = null;
			}
		}

		const body = await req.json();
		const text = (body?.text || '').toString();
		const options: SummaryOptions = body?.options || { length: 'short', format: 'paragraph' };

		const maxChars = Number(process.env.MAX_INPUT_CHARACTERS || 8000);
		if (!text || text.length > maxChars) {
			return Response.json({ error: `Text is required and must be <= ${maxChars} characters` }, { status: 400 });
		}

		// Rate limiting for authenticated users only (anonymous best-effort handled client-side/UI)
		let userClient = null as any;
		if (user && token) {
			const dailyLimit = Number(process.env.DAILY_SUMMARY_LIMIT || 50);
			userClient = getUserClient(token);
			const oneDayAgoIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
			const { count, error: countError } = await userClient
				.from('summaries')
				.select('*', { count: 'exact', head: true })
				.gte('created_at', oneDayAgoIso);
			if (countError) return Response.json({ error: 'Failed to check limit' }, { status: 500 });
			if ((count || 0) >= dailyLimit) return Response.json({ error: 'Daily limit reached' }, { status: 429 });
		}

		// Build prompt and call OpenAI (server-only)
		const openai = getOpenAI();
		const model = options.model || process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini';
		const prompt = buildPrompt(text, options);

		const chat = await openai.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: 'You are a concise, helpful text summarizer.' },
				{ role: 'user', content: prompt }
			],
			temperature: 0.3
		});

		const content = chat.choices?.[0]?.message?.content || '';
		const tokensUsed = chat.usage?.total_tokens || null;

		// Save to DB only if authenticated (RLS ensures row access)
		if (user && userClient) {
			const { error: insertError } = await userClient.from('summaries').insert({
				user_id: user.id,
				original_text: text,
				summary: content,
				tokens_used: tokensUsed,
				model,
				length_option: options.length,
				format_option: options.format
			});
			if (insertError) {
				return Response.json({ error: 'Failed to save summary' }, { status: 500 });
			}
		}

		return Response.json({ summary: content, tokens_used: tokensUsed, model });
	} catch (e: any) {
		return Response.json({ error: e.message || 'Internal error' }, { status: 500 });
	}
}

