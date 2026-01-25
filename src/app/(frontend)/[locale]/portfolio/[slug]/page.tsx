import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolioBySlug, getRelatedProjects, getAllPortfolio } from '@/client/lib/portfolio';
import Project from '@/client/modules/project/Project';
import type { Media } from '@/payload-types';

// ISR - оновлення кожні 5 хвилин
export const revalidate = 300;

type Params = {
	params: Promise<{
		locale: string;
		slug: string;
	}>;
};

// Generate static params для всіх проектів
export async function generateStaticParams() {
	const projects = await getAllPortfolio('uk');
	const projectsEn = await getAllPortfolio('en');

	const params = [
		...projects.map((project) => ({
			locale: 'ua',
			slug: project.slug
		})),
		...projectsEn.map((project) => ({
			locale: 'en',
			slug: project.slug
		}))
	];

	return params;
}

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale, slug } = await params;
	const project = await getPortfolioBySlug(slug, locale);

	if (!project) {
		return {
			title: 'Project Not Found',
			description: 'The requested project could not be found'
		};
	}

	const ogImage = project.seo.ogImage as Media | null;
	const imageUrl = ogImage?.url || 'https://abect.com/og-portfolio.jpg';

	const fullUrl =
		locale === 'ua'
			? `https://abect.com/portfolio/${slug}`
			: `https://abect.com/${locale}/portfolio/${slug}`;

	return {
		title: project.seo.metaTitle,
		description: project.seo.metaDescription,
		keywords: project.seo.metaKeywords,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': `https://abect.com/portfolio/${slug}`,
				'en-US': `https://abect.com/en/portfolio/${slug}`
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
			title: project.seo.metaTitle,
			description: project.seo.metaDescription,
			url: fullUrl,
			siteName: 'ABECT',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: project.title
				}
			],
			locale: locale === 'ua' ? 'uk_UA' : 'en_US',
			type: 'article',
			publishedTime: project.projectDate,
			authors: ['ABECT']
		},
		twitter: {
			card: 'summary_large_image',
			title: project.seo.metaTitle,
			description: project.seo.metaDescription,
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
export default async function ProjectPage({ params }: Params) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	// Отримуємо проект
	const project = await getPortfolioBySlug(slug, locale);

	if (!project) {
		notFound();
	}

	// Отримуємо схожі проекти
	const relatedProjects = await getRelatedProjects(project.id, project.service, locale, 3);

	return (
		<>
			{/* JSON-LD Schema.org */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'CreativeWork',
						headline: project.title,
						description: project.shortDescription,
						image: (project.seo.ogImage as Media | null)?.url || 'https://abect.com/og-portfolio.jpg',
						author: {
							'@type': 'Organization',
							name: 'ABECT',
							url: 'https://abect.com'
						},
						publisher: {
							'@type': 'Organization',
							name: 'ABECT',
							logo: {
								'@type': 'ImageObject',
								url: 'https://abect.com/logo.png'
							}
						},
						datePublished: project.projectDate,
						dateModified: project.updatedAt,
						url: locale === 'ua'
							? `https://abect.com/portfolio/${slug}`
							: `https://abect.com/${locale}/portfolio/${slug}`
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
								name: locale === 'ua' ? 'Портфоліо' : 'Portfolio',
								item: locale === 'ua'
									? 'https://abect.com/portfolio'
									: `https://abect.com/${locale}/portfolio`
							},
							{
								'@type': 'ListItem',
								position: 3,
								name: project.title,
								item: locale === 'ua'
									? `https://abect.com/portfolio/${slug}`
									: `https://abect.com/${locale}/portfolio/${slug}`
							}
						]
					})
				}}
			/>

			<Project project={project} relatedProjects={relatedProjects} locale={locale} />
		</>
	);
}
