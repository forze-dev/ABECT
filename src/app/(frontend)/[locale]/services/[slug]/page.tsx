import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServiceBySlug, getRelatedServices, getAllServices } from '@/client/lib/services';
import ServiceDetail from '@/client/modules/service/ServiceDetail';
import type { Media } from '@/payload-types';

type Params = {
	params: Promise<{
		locale: string;
		slug: string;
	}>;
};

// Generate static params для всіх сервісів
export async function generateStaticParams() {
	const services = await getAllServices('uk');
	const servicesEn = await getAllServices('en');

	const params = [
		...services.map((service) => ({
			locale: 'ua',
			slug: service.slug
		})),
		...servicesEn.map((service) => ({
			locale: 'en',
			slug: service.slug
		}))
	];

	return params;
}

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale, slug } = await params;
	const service = await getServiceBySlug(slug, locale);

	if (!service) {
		return {
			title: 'Service Not Found',
			description: 'The requested service could not be found'
		};
	}

	const ogImage = service.seo.ogImage as Media | null;
	const imageUrl = ogImage?.url || 'https://abect.com/og-services.jpg';

	const fullUrl =
		locale === 'ua'
			? `https://abect.com/services/${slug}`
			: `https://abect.com/${locale}/services/${slug}`;

	return {
		title: service.seo.metaTitle,
		description: service.seo.metaDescription,
		keywords: service.seo.metaKeywords,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': `https://abect.com/services/${slug}`,
				'en-US': `https://abect.com/en/services/${slug}`
			}
		},
		authors: [{ name: 'ABECT', url: 'https://abect.com' }],
		robots: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1
		},
		openGraph: {
			title: service.seo.metaTitle,
			description: service.seo.metaDescription,
			url: fullUrl,
			siteName: 'ABECT',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: service.title
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'article',
			publishedTime: service.publishedDate || service.createdAt,
			authors: ['ABECT']
		},
		twitter: {
			card: 'summary_large_image',
			title: service.seo.metaTitle,
			description: service.seo.metaDescription,
			images: [imageUrl]
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
export default async function ServicePage({ params }: Params) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	// Отримуємо сервіс
	const service = await getServiceBySlug(slug, locale);

	if (!service) {
		notFound();
	}

	// Отримуємо схожі сервіси
	const relatedServices = await getRelatedServices(service.id, service.category, locale, 3);

	return (
		<>
			{/* JSON-LD Schema.org - Service */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Service',
						name: service.title,
						description: service.shortDescription,
						image: (service.seo.ogImage as Media | null)?.url || 'https://abect.com/og-services.jpg',
						provider: {
							'@type': 'Organization',
							name: 'ABECT',
							url: 'https://abect.com'
						},
						offers: [
							service.hasWebliumOption && service.webliumPrice ? {
								'@type': 'Offer',
								name: 'Weblium Option',
								price: service.webliumPrice,
								priceCurrency: service.webliumPriceCurrency || 'UAH'
							} : null,
							{
								'@type': 'Offer',
								name: 'Custom Development',
								price: service.customPrice,
								priceCurrency: service.customPriceCurrency
							}
						].filter(Boolean),
						category: service.category,
						url: locale === 'ua'
							? `https://abect.com/services/${slug}`
							: `https://abect.com/${locale}/services/${slug}`
					})
				}}
			/>

			{/* Breadcrumbs JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BreadcrumbList',
						itemListElement: [
							{
								'@type': 'ListItem',
								position: 1,
								name: locale === 'ua' ? 'Головна' : 'Home',
								item: 'https://abect.com'
							},
							{
								'@type': 'ListItem',
								position: 2,
								name: locale === 'ua' ? 'Послуги' : 'Services',
								item: locale === 'ua'
									? 'https://abect.com/services'
									: `https://abect.com/${locale}/services`
							},
							{
								'@type': 'ListItem',
								position: 3,
								name: service.title,
								item: locale === 'ua'
									? `https://abect.com/services/${slug}`
									: `https://abect.com/${locale}/services/${slug}`
							}
						]
					})
				}}
			/>

			<ServiceDetail service={service} relatedServices={relatedServices} locale={locale} />
		</>
	);
}
