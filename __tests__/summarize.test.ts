import { POST } from '../app/api/summarize/route';

jest.mock('../lib/supabaseServer', () => ({
	getUserFromToken: jest.fn(async () => ({ id: 'user-1' })),
	getUserClient: jest.fn(() => ({
		from: () => ({
			select: () => ({ gte: () => ({}) }),
			insert: () => ({ error: null })
		})
	}))
}));

jest.mock('../lib/openai', () => ({
	getOpenAI: () => ({
		chat: { completions: { create: async () => ({ choices: [{ message: { content: 'Mock summary' } }], usage: { total_tokens: 123 } }) } }
	}),
	buildPrompt: (t: string) => `prompt:${t}`
}));

function mockRequest(body: any, token = 'token') {
	return new Request('http://localhost/api/summarize', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify(body)
	}) as any;
}

describe('POST /api/summarize', () => {
	it('returns summary', async () => {
		const req = mockRequest({ text: 'hello world', options: { length: 'short', format: 'paragraph' } });
		const res: any = await POST(req);
		const json = await res.json();
		expect(res.status).toBe(200);
		expect(json.summary).toBe('Mock summary');
		expect(json.tokens_used).toBe(123);
	});

	it('requires auth', async () => {
		const req = mockRequest({ text: 'hi', options: { length: 'short', format: 'paragraph' } }, '');
		const res: any = await POST(req);
		const json = await res.json();
		expect(res.status).toBe(401);
		expect(json.error).toBeDefined();
	});
});

