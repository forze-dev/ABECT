import type { Portfolio } from '@/payload-types';

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
 * Утиліта для сортування проєктів за order → createdAt
 * Логіка: менше order = вище; якщо order однаковий або null → новіші першими
 */
function sortByOrderAndDate(a: Portfolio, b: Portfolio): number {
  if (a.order != null && b.order != null && a.order !== b.order) return a.order - b.order;
  if (a.order != null) return -1;
  if (b.order != null) return 1;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export async function getFeaturedPortfolio(locale: string = 'uk'): Promise<Portfolio[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/portfolio?where[status][equals]=published&locale=${locale}&limit=100`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300, tags: ['portfolio'] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch portfolio:', response.statusText);
      return [];
    }

    const data: PayloadResponse<Portfolio> = await response.json();
    const projects = data.docs ?? [];

    if (projects.length === 0) return [];

    // Фільтруємо featured проєкти
    const featuredProjects = projects.filter(p => p.featured === true).sort(sortByOrderAndDate);

    if (featuredProjects.length >= 4) return featuredProjects.slice(0, 4);

    // Якщо featured менше 4, беремо решту з не-featured
    const nonFeaturedProjects = projects
      .filter(p => !p.featured)
      .sort(sortByOrderAndDate);

    const combined = [...featuredProjects, ...nonFeaturedProjects];
    return combined.slice(0, 4); // завжди 4 проєкти
  } catch (error) {
    console.error('Error fetching featured portfolio:', error);
    return [];
  }
}


/**
 * Отримує всі опубліковані проєкти для сторінки /portfolio
 */
export async function getAllPortfolio(locale: string = 'uk'): Promise<Portfolio[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/portfolio?where[status][equals]=published&locale=${locale}&limit=100`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300, tags: ['portfolio'] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch all portfolio:', response.statusText);
      return [];
    }

    const data: PayloadResponse<Portfolio> = await response.json();
    const projects = data.docs ?? [];

    return projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return sortByOrderAndDate(a, b);
    });
  } catch (error) {
    console.error('Error fetching all portfolio:', error);
    return [];
  }
}

/**
 * Отримує один проєкт по slug для сторінки /portfolio/[slug]
 */
export async function getPortfolioBySlug(slug: string, locale: string = 'uk'): Promise<Portfolio | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/portfolio?where[slug][equals]=${slug}&where[status][equals]=published&locale=${locale}&limit=1`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300, tags: [`portfolio-${slug}`] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch portfolio by slug:', response.statusText);
      return null;
    }

    const data: PayloadResponse<Portfolio> = await response.json();
    const projects = data.docs ?? [];

    return projects[0] ?? null;
  } catch (error) {
    console.error('Error fetching portfolio by slug:', error);
    return null;
  }
}

/**
 * Отримує схожі проєкти для сторінки /portfolio/[slug]
 * Логіка: той самий service → featured → order → createdAt
 */
export async function getRelatedProjects(
  currentProjectId: number,
  service: Portfolio['service'],
  locale: string = 'uk',
  limit: number = 3
): Promise<Portfolio[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/portfolio?where[status][equals]=published&where[service][equals]=${service}&locale=${locale}&limit=100`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 300, tags: ['portfolio'] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch related projects:', response.statusText);
      return [];
    }

    const data: PayloadResponse<Portfolio> = await response.json();
    let projects = data.docs ?? [];

    // Виключити поточний проєкт
    projects = projects.filter(p => p.id !== currentProjectId);

    // Якщо менше ніж потрібно, додати проєкти з інших категорій
    if (projects.length < limit) {
      const otherApiUrl = `${baseUrl}/api/portfolio?where[status][equals]=published&where[service][not_equals]=${service}&locale=${locale}&limit=100`;

      const otherResponse = await fetch(otherApiUrl, {
        next: { revalidate: 300, tags: ['portfolio'] },
        cache: 'force-cache',
      });

      if (otherResponse.ok) {
        const otherData: PayloadResponse<Portfolio> = await otherResponse.json();
        const otherProjects = otherData.docs ?? [];

        // Виключити поточний проєкт з інших категорій теж
        const filteredOtherProjects = otherProjects.filter(p => p.id !== currentProjectId);

        projects = [...projects, ...filteredOtherProjects];
      }
    }

    // Сортування: featured → order → createdAt
    const sorted = projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return sortByOrderAndDate(a, b);
    });

    return sorted.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related projects:', error);
    return [];
  }
}
