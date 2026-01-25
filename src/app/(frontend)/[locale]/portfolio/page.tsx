import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/client/i18n/routing';
import { getAllPortfolio } from '@/client/lib/portfolio';
import PortfolioPage from '@/client/modules/portfolio/PortfolioPage/PortfolioPage';
import type { Metadata } from 'next';

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

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'PortfolioPage.seo' });

	const title = t('title');
	const description = t('description');
	const keywords = t('keywords');

	const fullUrl =
		locale === 'ua'
			? 'https://abect.com/portfolio'
			: `https://abect.com/${locale}/portfolio`;

	return {
		title,
		description,
		keywords,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': 'https://abect.com/portfolio',
				'en-US': 'https://abect.com/en/portfolio'
			}
		},
		authors: [{ name: 'ABECT', url: 'https://abect.com' }],
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1
		},
		openGraph: {
			title,
			description,
			url: fullUrl,
			siteName: 'ABECT',
			images: [
				{
					url: 'https://abect.com/og-portfolio.jpg',
					width: 1200,
					height: 630,
					alt: title
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['https://abect.com/og-portfolio.jpg']
		},
		icons: {
			icon: [
				{ url: '/seo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
				{ url: '/seo/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
			],
			apple: '/seo/apple-touch-icon.png'
		},
		manifest: '/seo/site.webmanifest'
	};
}

// Server Component
export default async function PortfolioServerPage({ params }: Params) {
	const { locale } = await params;

	setRequestLocale(locale);

	// Получаем все проекты через ISR
	const projects = await getAllPortfolio(locale);

	return <PortfolioPage locale={locale} initialProjects={projects} />;
}
