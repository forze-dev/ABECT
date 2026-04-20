import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/client/i18n/routing';
import AboutPage from '@/client/modules/about/AboutPage/AboutPage';
import { Fragment } from 'react';
import type { Metadata } from 'next';

type Params = {
	params: Promise<{
		locale: string;
	}>;
};

// Генерация статичних параметров для локалей
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'AboutPage.seo' });

	const title = t('title');
	const description = t('description');
	const keywords = t('keywords');

	const fullUrl =
		locale === 'ua'
			? 'https://abect.com/about'
			: `https://abect.com/${locale}/about`;

	return {
		title,
		description,
		keywords,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': 'https://abect.com/about',
				'en-US': 'https://abect.com/en/about',
				'x-default': 'https://abect.com/en/about'
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
					url: locale === 'ua' ? 'https://abect.com/seo/about-og.jpg' : 'https://abect.com/seo/en-about-og.jpg',
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
			images: [locale === 'ua' ? 'https://abect.com/seo/about-og.jpg' : 'https://abect.com/seo/en-about-og.jpg']
		},
		icons: {
			icon: [
				{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
				{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
			],
			apple: '/apple-touch-icon.png'
		},
		manifest: '/site.webmanifest'
	};
}

// Server Component
export default async function AboutServerPage({ params }: Params) {
	const { locale } = await params;

	setRequestLocale(locale);

	const pageUrl = locale === 'ua' ? 'https://abect.com/about' : 'https://abect.com/en/about';
	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: locale === 'ua' ? 'Головна' : 'Home', item: 'https://abect.com' },
			{ '@type': 'ListItem', position: 2, name: locale === 'ua' ? 'Про нас' : 'About', item: pageUrl },
		],
	};

	return (
		<Fragment>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
			<AboutPage locale={locale} />
		</Fragment>
	);
}
