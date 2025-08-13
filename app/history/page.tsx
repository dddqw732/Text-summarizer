'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseBrowser } from '../../lib/supabaseClient';

const supabase = getSupabaseBrowser();

type SummaryRow = {
	id: string;
	created_at: string;
	original_text: string;
	summary: string;
	tokens_used: number | null;
	model: string | null;
	length_option: 'short' | 'medium' | 'long' | null;
	format_option: 'paragraph' | 'bullets' | 'tldr' | null;
};

export default function HistoryPage() {
	const [token, setToken] = useState<string | null>(null);
	const [rows, setRows] = useState<SummaryRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!supabase) return;
		supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token || null));
		const { data: sub } = supabase.auth.onAuthStateChange((_, session) => setToken(session?.access_token || null));
		return () => sub?.subscription?.unsubscribe?.();
	}, []);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		fetch('/api/summaries', { headers: { Authorization: `Bearer ${token}` } })
			.then(async (r) => {
				const j = await r.json();
				if (!r.ok) throw new Error(j.error || 'Failed');
				setRows(j.summaries || []);
			})
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false));
	}, [token]);

	function copy(text: string) {
		navigator.clipboard.writeText(text);
	}

	async function remove(id: string) {
		if (!token) return;
		const res = await fetch(`/api/summaries/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
		if (res.ok) setRows((s) => s.filter((r) => r.id !== id));
	}

	function download(row: SummaryRow) {
		const blob = new Blob([row.summary], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `summary-${row.id}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const sorted = useMemo(() => rows.slice().sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)), [rows]);

	return (
		<main>
			<h2>السجل</h2>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: '#ff8080' }}>{error}</p>}
			<div style={{ display: 'grid', gap: 12 }}>
				{sorted.map((r) => (
					<div key={r.id} style={{ background: '#0f1530', padding: 12, borderRadius: 8 }}>
						<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
							<small style={{ opacity: 0.7 }}>{new Date(r.created_at).toLocaleString()}</small>
							<div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
								<button onClick={() => copy(r.summary)}>نسخ</button>
								<button onClick={() => download(r)}>تنزيل</button>
								<button onClick={() => remove(r.id)} style={{ color: '#ff8080' }}>حذف</button>
							</div>
						</div>
						<details style={{ marginTop: 8 }}>
							<summary>النص الأصلي</summary>
							<pre style={{ whiteSpace: 'pre-wrap' }}>{r.original_text}</pre>
						</details>
						<pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{r.summary}</pre>
					</div>
				))}
				{sorted.length === 0 && !loading && <p>لا توجد ملخصات بعد.</p>}
			</div>
		</main>
	);
}

