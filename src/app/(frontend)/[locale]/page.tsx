import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/client/i18n/routing';
import Home from '@/client/modules/home/Home';
import { Metadata } from 'next';

type Params = {
	params: Promise<{
		locale: string;
	}>;
};
// ISR - оновлення кожні 5 хвилин
export const revalidate = 300;

// Генерація статичних параметрів для локалей
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale } = await params;
	const isUa = locale === 'ua';

	const title = isUa
		? 'Розробка сайтів. Запуск реклами | ABECT'
		: 'Website Development. Marketing Launch - ABECT';

	const description = isUa
		? 'ABECT професійна розробка сайтів для бізнесу. Ми створюємо адаптивні, швидкі та SEO-оптимізовані сайти для вашого успіху в інтернеті. З нами Ваш бізнес вийде на новий рівень!'
		: 'ABECT provides professional website development for businesses. We build fast, responsive, and SEO-optimized websites to help your brand grow online. Take your business to the next level with us!';

	const keywords = isUa
		? 'сайт, Next.js, розробка сайтів, створення сайтів, веб-дизайн, SEO оптимізація, бізнес сайт, корпоративний сайт, інтернет-магазин, landing page, WordPress, React'
		: 'website, Next.js, web development, website creation, web design, SEO optimization, business website, corporate website, online store, landing page, WordPress, React';

	const fullUrl = locale === "ua" ? `https://abect.com` : `https://abect.com/${locale}`;

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
			images: ['https://abect.com/seo/og.jpg'],
		},
		icons: {
			icon: [
				{ url: '/seo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
				{ url: '/seo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			],
			apple: '/seo/apple-touch-icon.png',
		},
		manifest: '/seo/site.webmanifest',
	};
}

export default async function HomePage({ params }: Params) {
	const { locale } = await params;

	setRequestLocale(locale);

	return <Home locale={locale} />;
}