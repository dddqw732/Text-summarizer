import OpenAI from 'openai';

export function getOpenAI() {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
	return new OpenAI({ apiKey });
}

export type SummaryOptions = {
	length: 'short' | 'medium' | 'long';
	format: 'paragraph' | 'bullets' | 'tldr';
	model?: string;
};

export function buildPrompt(text: string, options: SummaryOptions) {
	const lengthGuide = options.length === 'short' ? 'about 2-3 sentences' : options.length === 'medium' ? '1 short paragraph' : '2 short paragraphs';
	const formatGuide = options.format === 'paragraph'
		? 'Return as cohesive paragraphs.'
		: options.format === 'bullets'
		? 'Return as concise bullet points.'
		: 'Return a single TL;DR line prefixed with "TL;DR:"';
	return `Summarize the following content in ${lengthGuide}. ${formatGuide}\n\nContent:\n${text}`;
}

