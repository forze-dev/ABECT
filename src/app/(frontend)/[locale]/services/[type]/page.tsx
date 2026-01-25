import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getAllServices, getAllServiceTypes, getServiceTypeBySlug, getServicesByType } from '@/client/lib/services';
import ServicesPage from '@/client/modules/services/ServicesPage/ServicesPage';
import type { Metadata } from 'next';
import type { Media } from '@/payload-types';

// ISR - сторінки генеруються динамічно і кешуються
export const dynamicParams = true;
export const revalidate = 300; // Оновлення кешу кожні 5 хвилин

type Params = {
	params: Promise<{
		locale: string;
		type: string;
	}>;
};

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale, type: typeSlug } = await params;
	const serviceType = await getServiceTypeBySlug(typeSlug, locale);

	if (!serviceType) {
		return {
			title: 'Type Not Found',
			description: 'The requested service type could not be found'
		};
	}

	const title = serviceType.seo?.metaTitle || serviceType.name;
	const description = serviceType.seo?.metaDescription || serviceType.description;
	const keywords = serviceType.seo?.metaKeywords || serviceType.name;

	const coverImage = serviceType.cover as Media | null;
	const imageUrl = coverImage?.url || 'https://abect.com/og-services.jpg';

	const fullUrl =
		locale === 'ua'
			? `https://abect.com/services/${typeSlug}`
			: `https://abect.com/${locale}/services/${typeSlug}`;

	return {
		title,
		description,
		keywords,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': `https://abect.com/services/${typeSlug}`,
				'en-US': `https://abect.com/en/services/${typeSlug}`
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
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: serviceType.name
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
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
export default async function ServiceTypePage({ params }: Params) {
	const { locale, type: typeSlug } = await params;

	setRequestLocale(locale);

	// Get the service type
	const serviceType = await getServiceTypeBySlug(typeSlug, locale);

	if (!serviceType) {
		notFound();
	}

	// Get services of this type, all services (for counting), and all types for filter
	const [services, allServices, serviceTypes] = await Promise.all([
		getServicesByType(typeSlug, locale),
		getAllServices(locale),
		getAllServiceTypes(locale)
	]);

	return (
		<>
			{/* JSON-LD Schema.org CollectionPage */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CollectionPage',
						name: serviceType.name,
						description: serviceType.description,
						url: locale === 'ua'
							? `https://abect.com/services/${typeSlug}`
							: `https://abect.com/${locale}/services/${typeSlug}`,
						isPartOf: {
							'@type': 'WebSite',
							name: 'ABECT',
							url: locale === 'ua'
								? 'https://abect.com/services'
								: `https://abect.com/${locale}/services`
						},
						numberOfItems: services.length
					})
				}}
			/>

			<ServicesPage
				locale={locale}
				services={services}
				allServices={allServices}
				serviceTypes={serviceTypes}
				currentType={serviceType}
			/>
		</>
	);
}
