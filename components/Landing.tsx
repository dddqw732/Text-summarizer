export default function Landing() {
	return (
		<div>
			<section style={{ position: 'relative', padding: '48px 0', overflow: 'hidden' }}>
				<div style={{
					position: 'absolute', inset: -120, background: 'radial-gradient(800px 400px at 20% 0%, rgba(93,119,255,0.18), transparent), radial-gradient(800px 400px at 80% 50%, rgba(255,99,169,0.12), transparent)'
				}} />
				<div style={{ position: 'relative', display: 'grid', gap: 16 }}>
					<h2 style={{ fontSize: 40, margin: 0, lineHeight: 1.1 }}>
						<span style={{ background: 'linear-gradient(90deg,#a3b8ff,#ff8bcf)', WebkitBackgroundClip: 'text', color: 'transparent' }}>ملخّص النص</span>
						<br />
						<span style={{ opacity: 0.9 }}>يلخّص أي نص بسرعة وبساطة.</span>
					</h2>
					<p style={{ opacity: 0.9, maxWidth: 720 }}>
						ألصق النص الطويل، اختر الطول والصيغة، واحصل على ملخص نظيف خلال ثوانٍ. لديك سجلّ، نسخ سريع، حذف، وتنزيل—كلها في مكان واحد.
					</p>
					<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
						<a href="/login" style={{ background: '#5d77ff', color: '#0b1020', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>ابدأ عبر البريد</a>
						<a href="#features" style={{ color: '#b7c4ff', padding: '10px 16px', textDecoration: 'none' }}>كيفية الاستخدام</a>
					</div>
				</div>
			</section>

			<section id="features" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: 24 }}>
				<div style={{ background: '#0f1530', padding: 16, borderRadius: 12, border: '1px solid #1b2350' }}>
					<h3 style={{ marginTop: 0 }}>سريع وفعّال</h3>
					<p style={{ opacity: 0.85 }}>اختر قصير/متوسط/طويل و TL;DR/فقرة/نقاط لتحصل على مخرجات مناسبة.</p>
				</div>
				<div style={{ background: '#0f1530', padding: 16, borderRadius: 12, border: '1px solid #1b2350' }}>
					<h3 style={{ marginTop: 0 }}>خصوصية بالتصميم</h3>
					<p style={{ opacity: 0.85 }}>التوثيق عبر Supabase وRLS. مفتاح OpenAI يبقى على الخادم فقط.</p>
				</div>
				<div style={{ background: '#0f1530', padding: 16, borderRadius: 12, border: '1px solid #1b2350' }}>
					<h3 style={{ marginTop: 0 }}>سجلّ وتصدير</h3>
					<p style={{ opacity: 0.85 }}>سجلّ الملخصات، نسخ سريع، حذف، وتنزيل كملف نصي.</p>
				</div>
			</section>
		</div>
	);
}

