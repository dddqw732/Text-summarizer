'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '../../lib/supabaseClient';

const supabase = getSupabaseBrowser();

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// no-op: supabase handles deep link on same domain
	}, []);

	async function sendMagicLink(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (!supabase) {
			setError('Missing Supabase config on client');
			return;
		}
		const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
		if (error) setError(error.message);
		else setSent(true);
	}

	return (
		<main>
			<h2>تسجيل الدخول</h2>
			<form onSubmit={sendMagicLink} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
				<input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
				<button type="submit">إرسال رابط الدخول</button>
			</form>
			{sent && <p>تحقق من بريدك الإلكتروني لفتح رابط الدخول.</p>}
			{error && <p style={{ color: '#ff8080' }}>{error}</p>}
		</main>
	);
}

