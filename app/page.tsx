'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '../lib/supabaseClient';
import Landing from '../components/Landing';

const supabase = getSupabaseBrowser();

type Options = {
	length: 'short' | 'medium' | 'long';
	format: 'paragraph' | 'bullets' | 'tldr';
	model?: string;
};

export default function HomePage() {
	const [text, setText] = useState('');
	const [length, setLength] = useState<Options['length']>('short');
	const [format, setFormat] = useState<Options['format']>('paragraph');
	const [model, setModel] = useState<string>('gpt-4o-mini');
	const [summary, setSummary] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sessionToken, setSessionToken] = useState<string | null>(null);

	useEffect(() => {
		if (!supabase) return;
		const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
			setSessionToken(session?.access_token || null);
		});
		supabase.auth.getSession().then(({ data }) => setSessionToken(data.session?.access_token || null));
		return () => {
			listener?.subscription?.unsubscribe?.();
		};
	}, []);

	async function handleSummarize() {
		setError(null);
		setSummary('');
		// يسمح بالتلخيص دون تسجيل دخول، لكن لن يتم حفظه في السجل
		if (!text.trim()) return;
		setLoading(true);
		try {
			const res = await fetch('/api/summarize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sessionToken}`
				},
				body: JSON.stringify({ text, options: { length, format, model } })
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed to summarize');
			setSummary(json.summary);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<main>
			{!sessionToken && (
				<div style={{ marginBottom: 24 }}>
					<Landing />
				</div>
			)}
			<section style={{ display: 'grid', gap: 12 }}>
			<label style={{ fontSize: 14, opacity: 0.9 }}>نصّك</label>
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					rows={10}
					style={{ width: '100%', padding: 12, borderRadius: 8 }}
					placeholder="ألصق النص الطويل هنا..."
				/>
				<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
					<select value={length} onChange={(e) => setLength(e.target.value as any)}>
						<option value="short">قصير</option>
						<option value="medium">متوسط</option>
						<option value="long">طويل</option>
					</select>
					<select value={format} onChange={(e) => setFormat(e.target.value as any)}>
						<option value="paragraph">فقرة</option>
						<option value="bullets">نقاط</option>
						<option value="tldr">TL;DR</option>
					</select>
					<select value={model} onChange={(e) => setModel(e.target.value)}>
						<option value="gpt-4o-mini">gpt-4o-mini (افتراضي)</option>
						<option value="gpt-4o">gpt-4o</option>
					</select>
					<button onClick={handleSummarize} disabled={loading} style={{ padding: '8px 12px' }}>
						{loading ? 'جارِ التلخيص...' : 'لخّص'}
					</button>
				</div>
				{error && <div style={{ color: '#ff8080' }}>{error}</div>}
			</section>
			{summary && (
				<section style={{ marginTop: 24 }}>
					<h3>الملخّص</h3>
					<pre style={{ whiteSpace: 'pre-wrap', background: '#0f1530', padding: 12, borderRadius: 8 }}>{summary}</pre>
				</section>
			)}
		</main>
	);
}

