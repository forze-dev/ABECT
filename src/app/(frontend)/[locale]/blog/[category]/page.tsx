import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getAllPosts, getAllCategories, getCategoryBySlug, getPostsByCategory } from '@/client/lib/blog';
import BlogPage from '@/client/modules/blog/BlogPage/BlogPage';
import type { Metadata } from 'next';
import type { Media } from '@/payload-types';

// ISR - сторінки генеруються динамічно і кешуються
export const dynamicParams = true;
export const revalidate = 300; // Оновлення кешу кожні 5 хвилин

type Params = {
	params: Promise<{
		locale: string;
		category: string;
	}>;
};

// SEO Metadata
export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { locale, category: categorySlug } = await params;
	const category = await getCategoryBySlug(categorySlug, locale);

	if (!category) {
		return {
			title: 'Category Not Found',
			description: 'The requested category could not be found'
		};
	}

	const title = category.seo?.metaTitle || category.name;
	const description = category.seo?.metaDescription || category.description;
	const keywords = category.seo?.metaKeywords || category.name;

	const coverImage = category.cover as Media | null;
	const imageUrl = coverImage?.url || 'https://abect.com/og-blog.jpg';

	const fullUrl =
		locale === 'ua'
			? `https://abect.com/blog/${categorySlug}`
			: `https://abect.com/${locale}/blog/${categorySlug}`;

	return {
		title,
		description,
		keywords,
		metadataBase: new URL('https://abect.com'),
		alternates: {
			canonical: fullUrl,
			languages: {
				'uk-UA': `https://abect.com/blog/${categorySlug}`,
				'en-US': `https://abect.com/en/blog/${categorySlug}`
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
					alt: category.name
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
export default async function CategoryPage({ params }: Params) {
	const { locale, category: categorySlug } = await params;

	setRequestLocale(locale);

	// Отримуємо категорію
	const category = await getCategoryBySlug(categorySlug, locale);

	if (!category) {
		notFound();
	}

	// Отримуємо статті категорії, всі статті (для підрахунку) та всі категорії для фільтра
	const [posts, allPosts, categories] = await Promise.all([
		getPostsByCategory(categorySlug, locale),
		getAllPosts(locale),
		getAllCategories(locale)
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
						name: category.name,
						description: category.description,
						url: locale === 'ua'
							? `https://abect.com/blog/${categorySlug}`
							: `https://abect.com/${locale}/blog/${categorySlug}`,
						isPartOf: {
							'@type': 'Blog',
							name: 'ABECT Blog',
							url: locale === 'ua'
								? 'https://abect.com/blog'
								: `https://abect.com/${locale}/blog`
						},
						numberOfItems: posts.length
					})
				}}
			/>

			<BlogPage
				locale={locale}
				posts={posts}
				allPosts={allPosts}
				categories={categories}
				currentCategory={category}
			/>
		</>
	);
}
