import type { Service } from '@/payload-types';

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
 * Утиліта для сортування сервісів за order → createdAt
 * Логіка: менше order = вище; якщо order однаковий або null → новіші першими
 */
function sortByOrderAndDate(a: Service, b: Service): number {
  if (a.order != null && b.order != null && a.order !== b.order) return a.order - b.order;
  if (a.order != null) return -1;
  if (b.order != null) return 1;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

/**
 * Отримує featured сервіси для головної сторінки
 * Повертає до 4 сервісів (featured + найкращі не-featured якщо потрібно)
 */
export async function getFeaturedServices(locale: string = 'uk'): Promise<Service[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/services?where[status][equals]=published&locale=${locale}&limit=100`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600, tags: ['services'] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch services:', response.statusText);
      return [];
    }

    const data: PayloadResponse<Service> = await response.json();
    const services = data.docs ?? [];

    if (services.length === 0) return [];

    // Фільтруємо featured сервіси
    const featuredServices = services.filter(s => s.featured === true).sort(sortByOrderAndDate);

    if (featuredServices.length >= 4) return featuredServices.slice(0, 4);

    // Якщо featured менше 4, беремо решту з не-featured
    const nonFeaturedServices = services
      .filter(s => !s.featured)
      .sort(sortByOrderAndDate);

    const combined = [...featuredServices, ...nonFeaturedServices];
    return combined.slice(0, 4); // завжди 4 сервіси
  } catch (error) {
    console.error('Error fetching featured services:', error);
    return [];
  }
}

/**
 * Отримує всі опубліковані сервіси для сторінки /services
 */
export async function getAllServices(locale: string = 'uk'): Promise<Service[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/services?where[status][equals]=published&locale=${locale}&limit=100`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600, tags: ['services'] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch all services:', response.statusText);
      return [];
    }

    const data: PayloadResponse<Service> = await response.json();
    const services = data.docs ?? [];

    return services.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return sortByOrderAndDate(a, b);
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    return [];
  }
}

/**
 * Отримує один сервіс по slug для сторінки /services/[slug]
 */
export async function getServiceBySlug(slug: string, locale: string = 'uk'): Promise<Service | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/services?where[slug][equals]=${slug}&where[status][equals]=published&locale=${locale}&limit=1`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600, tags: [`service-${slug}`] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch service by slug:', response.statusText);
      return null;
    }

    const data: PayloadResponse<Service> = await response.json();
    const services = data.docs ?? [];

    return services[0] ?? null;
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return null;
  }
}

/**
 * Отримує схожі сервіси для сторінки /services/[slug]
 * Логіка: та сама category → featured → order → createdAt
 */
export async function getRelatedServices(
  currentServiceId: number,
  category: Service['category'],
  locale: string = 'uk',
  limit: number = 3
): Promise<Service[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/services?where[status][equals]=published&where[category][equals]=${category}&locale=${locale}&limit=100`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600, tags: ['services'] },
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error('Failed to fetch related services:', response.statusText);
      return [];
    }

    const data: PayloadResponse<Service> = await response.json();
    let services = data.docs ?? [];

    // Виключити поточний сервіс
    services = services.filter(s => s.id !== currentServiceId);

    // Якщо менше ніж потрібно, додати сервіси з інших категорій
    if (services.length < limit) {
      const otherApiUrl = `${baseUrl}/api/services?where[status][equals]=published&where[category][not_equals]=${category}&locale=${locale}&limit=100`;

      const otherResponse = await fetch(otherApiUrl, {
        next: { revalidate: 3600, tags: ['services'] },
        cache: 'force-cache',
      });

      if (otherResponse.ok) {
        const otherData: PayloadResponse<Service> = await otherResponse.json();
        const otherServices = otherData.docs ?? [];

        // Виключити поточний сервіс з інших категорій теж
        const filteredOtherServices = otherServices.filter(s => s.id !== currentServiceId);

        services = [...services, ...filteredOtherServices];
      }
    }

    // Сортування: featured → order → createdAt
    const sorted = services.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return sortByOrderAndDate(a, b);
    });

    return sorted.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related services:', error);
    return [];
  }
}
