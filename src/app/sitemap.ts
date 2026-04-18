import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = 'https://abect.com'

function url(path: string, locale: 'ua' | 'en'): string {
  const prefix = locale === 'en' ? '/en' : ''
  return `${BASE_URL}${prefix}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['ua', 'en'] as const

  // Static routes — no lastModified (Google ignores unreliable always-changing timestamps)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/en`, changeFrequency: 'weekly', priority: 1.0 },
    ...['services', 'about', 'portfolio', 'blog', 'contacts'].flatMap(route =>
      locales.map(locale => ({
        url: url(`/${route}`, locale),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    ),
    // Calculator is a tool page — lower priority, no lastModified
    ...locales.map(locale => ({
      url: url('/calculator', locale),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    })),
  ]

  // Dynamic routes from Payload CMS
  try {
    const payload = await getPayload({ config })

    const [postsUa, postsEn, portfolioUa, portfolioEn, servicesUa, servicesEn] = await Promise.all([
      payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 500, locale: 'uk' as never }),
      payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 500, locale: 'en' as never }),
      payload.find({ collection: 'portfolio', where: { status: { equals: 'published' } }, limit: 500, locale: 'uk' as never }),
      payload.find({ collection: 'portfolio', where: { status: { equals: 'published' } }, limit: 500, locale: 'en' as never }),
      payload.find({ collection: 'services', limit: 500, locale: 'uk' as never }),
      payload.find({ collection: 'services', limit: 500, locale: 'en' as never }),
    ])

    const postUrls: MetadataRoute.Sitemap = [
      ...postsUa.docs.filter(p => p.slug && p.category).map(p => ({
        url: url(`/blog/${typeof p.category === 'object' ? p.category?.slug : p.category}/${p.slug}`, 'ua'),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...postsEn.docs.filter(p => p.slug && p.category).map(p => ({
        url: url(`/blog/${typeof p.category === 'object' ? p.category?.slug : p.category}/${p.slug}`, 'en'),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]

    const portfolioUrls: MetadataRoute.Sitemap = [
      ...portfolioUa.docs.filter(p => p.slug).map(p => ({
        url: url(`/portfolio/${p.slug}`, 'ua'),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...portfolioEn.docs.filter(p => p.slug).map(p => ({
        url: url(`/portfolio/${p.slug}`, 'en'),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]

    const serviceUrls: MetadataRoute.Sitemap = [
      ...servicesUa.docs.filter(s => s.slug && s.serviceType).map(s => ({
        url: url(`/services/${typeof s.serviceType === 'object' ? s.serviceType?.slug : s.serviceType}/${s.slug}`, 'ua'),
        lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...servicesEn.docs.filter(s => s.slug && s.serviceType).map(s => ({
        url: url(`/services/${typeof s.serviceType === 'object' ? s.serviceType?.slug : s.serviceType}/${s.slug}`, 'en'),
        lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]

    return [...staticRoutes, ...postUrls, ...portfolioUrls, ...serviceUrls]
  } catch (err) {
    console.error('[sitemap] Payload CMS unavailable — returning static routes only:', err)
    return staticRoutes
  }
}
