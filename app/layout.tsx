export const metadata = {
	title: 'ملخص النص',
	description: 'تطبيق لتلخيص النصوص بسرعة وبساطة'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ar" dir="rtl">
			<body style={{ fontFamily: 'Tajawal, Inter, system-ui, Arial', margin: 0, background: '#0b1020', color: '#eaf0ff' }}>
				<div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
					<header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
						<img src="/logo.gif" alt="الشعار" width={32} height={32} style={{ borderRadius: 4 }} />
						<h1 style={{ margin: 0, fontSize: 20 }}>ملخص النص</h1>
						<nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
							<a href="/" style={{ color: '#b7c4ff', textDecoration: 'none' }}>الرئيسية</a>
							<a href="/history" style={{ color: '#b7c4ff', textDecoration: 'none' }}>السجل</a>
							<a href="/login" style={{ color: '#b7c4ff', textDecoration: 'none' }}>دخول</a>
						</nav>
					</header>
					{children}
					<footer style={{ opacity: 0.7, marginTop: 48, fontSize: 12 }}>تم البناء باستخدام Next.js وSupabase وOpenAI</footer>
				</div>
			</body>
		</html>
	);
}

