import type { Post, Category } from '@/payload-types';

/**
 * Типізація відповіді Payload CMS API
 */
interface PayloadResponse<T> {
	docs: T[];
	totalDocs?: number;
	totalPages?: number;
	page?: number;
	limit?: number;
}

/**
 * Сортування: featured → date (новіші першими)
 */
function sortByFeaturedAndDate(a: Post, b: Post): number {
	if (a.featured && !b.featured) return -1;
	if (!a.featured && b.featured) return 1;
	return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/**
 * Отримує всі опубліковані статті для сторінки /blog
 */
export async function getAllPosts(locale: string = 'uk'): Promise<Post[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
		const apiUrl = `${baseUrl}/api/posts?where[status][equals]=published&locale=${locale}&limit=100&depth=2`;

		const response = await fetch(apiUrl, {
			next: { revalidate: 3600, tags: ['posts'] },
			cache: 'force-cache',
		});

		if (!response.ok) {
			console.error('Failed to fetch all posts:', response.statusText);
			return [];
		}

		const data: PayloadResponse<Post> = await response.json();
		const posts = data.docs ?? [];

		return posts.sort(sortByFeaturedAndDate);
	} catch (error) {
		console.error('Error fetching all posts:', error);
		return [];
	}
}

/**
 * Отримує featured статті для головної сторінки (4 шт)
 */
export async function getFeaturedPosts(locale: string = 'uk'): Promise<Post[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
		const apiUrl = `${baseUrl}/api/posts?where[status][equals]=published&locale=${locale}&limit=100&depth=2`;

		const response = await fetch(apiUrl, {
			next: { revalidate: 3600, tags: ['posts'] },
			cache: 'force-cache',
		});

		if (!response.ok) {
			console.error('Failed to fetch posts:', response.statusText);
			return [];
		}

		const data: PayloadResponse<Post> = await response.json();
		const posts = data.docs ?? [];

		if (posts.length === 0) return [];

		// Фільтруємо featured статті
		const featuredPosts = posts.filter(p => p.featured === true).sort(sortByFeaturedAndDate);

		if (featuredPosts.length >= 4) return featuredPosts.slice(0, 4);

		// Якщо featured менше 4, беремо решту з не-featured
		const nonFeaturedPosts = posts
			.filter(p => !p.featured)
			.sort(sortByFeaturedAndDate);

		const combined = [...featuredPosts, ...nonFeaturedPosts];
		return combined.slice(0, 4);
	} catch (error) {
		console.error('Error fetching featured posts:', error);
		return [];
	}
}

/**
 * Отримує одну статтю по slug для сторінки /blog/[slug]
 */
export async function getPostBySlug(slug: string, locale: string = 'uk'): Promise<Post | null> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
		const apiUrl = `${baseUrl}/api/posts?where[slug][equals]=${slug}&where[status][equals]=published&locale=${locale}&limit=1&depth=2`;

		const response = await fetch(apiUrl, {
			next: { revalidate: 3600, tags: [`post-${slug}`] },
			cache: 'force-cache',
		});

		if (!response.ok) {
			console.error('Failed to fetch post by slug:', response.statusText);
			return null;
		}

		const data: PayloadResponse<Post> = await response.json();
		const posts = data.docs ?? [];

		return posts[0] ?? null;
	} catch (error) {
		console.error('Error fetching post by slug:', error);
		return null;
	}
}

/**
 * Отримує схожі статті для сторінки /blog/[slug]
 * Логіка: та сама категорія → featured → date
 */
export async function getRelatedPosts(
	currentPostId: number,
	categoryId: number,
	locale: string = 'uk',
	limit: number = 3
): Promise<Post[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
		const apiUrl = `${baseUrl}/api/posts?where[status][equals]=published&where[category][equals]=${categoryId}&locale=${locale}&limit=100&depth=2`;

		const response = await fetch(apiUrl, {
			next: { revalidate: 3600, tags: ['posts'] },
			cache: 'force-cache',
		});

		if (!response.ok) {
			console.error('Failed to fetch related posts:', response.statusText);
			return [];
		}

		const data: PayloadResponse<Post> = await response.json();
		let posts = data.docs ?? [];

		// Виключити поточну статтю
		posts = posts.filter(p => p.id !== currentPostId);

		// Якщо менше ніж потрібно, додати статті з інших категорій
		if (posts.length < limit) {
			const otherApiUrl = `${baseUrl}/api/posts?where[status][equals]=published&where[category][not_equals]=${categoryId}&locale=${locale}&limit=100&depth=2`;

			const otherResponse = await fetch(otherApiUrl, {
				next: { revalidate: 3600, tags: ['posts'] },
				cache: 'force-cache',
			});

			if (otherResponse.ok) {
				const otherData: PayloadResponse<Post> = await otherResponse.json();
				const otherPosts = otherData.docs ?? [];

				// Виключити поточну статтю
				const filteredOtherPosts = otherPosts.filter(p => p.id !== currentPostId);

				posts = [...posts, ...filteredOtherPosts];
			}
		}

		// Сортування: featured → date
		const sorted = posts.sort(sortByFeaturedAndDate);

		return sorted.slice(0, limit);
	} catch (error) {
		console.error('Error fetching related posts:', error);
		return [];
	}
}

/**
 * Отримує всі категорії для фільтра
 */
export async function getAllCategories(locale: string = 'uk'): Promise<Category[]> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
		const apiUrl = `${baseUrl}/api/categories?locale=${locale}&limit=100`;

		const response = await fetch(apiUrl, {
			next: { revalidate: 3600, tags: ['categories'] },
			cache: 'force-cache',
		});

		if (!response.ok) {
			console.error('Failed to fetch categories:', response.statusText);
			return [];
		}

		const data: PayloadResponse<Category> = await response.json();
		return data.docs ?? [];
	} catch (error) {
		console.error('Error fetching categories:', error);
		return [];
	}
}

/**
 * Отримує категорію по slug
 */
export async function getCategoryBySlug(slug: string, locale: string = 'uk'): Promise<Category | null> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
		const apiUrl = `${baseUrl}/api/categories?where[slug][equals]=${slug}&locale=${locale}&limit=1`;

		const response = await fetch(apiUrl, {
			next: { revalidate: 3600, tags: [`category-${slug}`] },
			cache: 'force-cache',
		});

		if (!response.ok) {
			console.error('Failed to fetch category by slug:', response.statusText);
			return null;
		}

		const data: PayloadResponse<Category> = await response.json();
		return data.docs?.[0] ?? null;
	} catch (error) {
		console.error('Error fetching category by slug:', error);
		return null;
	}
}

/**
 * Отримує статті по категорії (slug)
 */
export async function getPostsByCategory(categorySlug: string, locale: string = 'uk'): Promise<Post[]> {
	try {
		// Спочатку отримуємо категорію по slug
		const category = await getCategoryBySlug(categorySlug, locale);
		if (!category) return [];

		const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
		const apiUrl = `${baseUrl}/api/posts?where[status][equals]=published&where[category][equals]=${category.id}&locale=${locale}&limit=100&depth=2`;

		const response = await fetch(apiUrl, {
			next: { revalidate: 3600, tags: ['posts', `category-${categorySlug}`] },
			cache: 'force-cache',
		});

		if (!response.ok) {
			console.error('Failed to fetch posts by category:', response.statusText);
			return [];
		}

		const data: PayloadResponse<Post> = await response.json();
		const posts = data.docs ?? [];

		return posts.sort(sortByFeaturedAndDate);
	} catch (error) {
		console.error('Error fetching posts by category:', error);
		return [];
	}
}
