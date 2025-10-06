import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Home from '@/modules/home/Home';

// Генерація статичних параметрів для локалей
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
	const locale = params.locale;
	const isUa = locale === 'ua';

	const title = isUa
		? 'Розробка сайтів. Запуск реклами | ABECT'
		: 'Website Development. Marketing Launch | ABECT';

	const description = isUa
		? 'ABECT професійна розробка сайтів для бізнесу. Ми створюємо адаптивні, швидкі та SEO-оптимізовані сайти для вашого успіху в інтернеті. З нами Ваш бізнес вийде на новий рівень!'
		: 'ABECT provides professional website development for businesses. We build fast, responsive, and SEO-optimized websites to help your brand grow online. Take your business to the next level with us!';

	const keywords = isUa
		? 'сайт, Next.js, розробка сайтів, створення сайтів, веб-дизайн, SEO оптимізація, бізнес сайт, корпоративний сайт, інтернет-магазин, landing page, WordPress, React'
		: 'website, Next.js, web development, website creation, web design, SEO optimization, business website, corporate website, online store, landing page, WordPress, React';

	const fullUrl = `https://abect.com/${locale}`;

	return {
		title,
		description,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
		},
		authors: [{ name: 'Abect', url: 'https://abect.com' }],
		robots: {
			index: true,
			follow: true,
		},
		keywords,
		openGraph: {
			title,
			description,
			url: fullUrl,
			siteName: 'Abect',
			images: [
				{
					url: 'https://abect.com/og.jpg',
					width: 1200,
					height: 630,
				},
			],
			locale,
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['https://abect.com/og.jpg'],
		},
		icons: {
			icon: [
				{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
				{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			],
			apple: '/apple-touch-icon.png',
		},
		manifest: '/site.webmanifest',
	};
}

export default async function HomePage({ params }) {
	// Отримання локалі асинхронно
	const paramsData = await params;
	const locale = paramsData.locale;

	// Увімкнення статичного рендерингу
	setRequestLocale(locale);

	return <Home />
}