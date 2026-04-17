import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import './not-found.scss'

const messages = {
  ua: {
    badge: 'Помилка 404',
    title: 'Сторінку не знайдено',
    description: 'Можливо, вона була переміщена або видалена. Перевірте адресу або поверніться на головну.',
    home: 'На головну',
    services: 'Наші послуги',
  },
  en: {
    badge: 'Error 404',
    title: 'Page not found',
    description: 'It may have been moved or deleted. Check the URL or go back to the homepage.',
    home: 'Go home',
    services: 'Our services',
  },
}

export default async function NotFound() {
  let locale: 'ua' | 'en' = 'ua'
  try {
    const detected = await getLocale()
    if (detected === 'en') locale = 'en'
  } catch {
    // fallback to default locale
  }

  const t = messages[locale]
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <section className="not-found">
      <div className="container">
        <div className="not-found__wrapper">
          <span className="not-found__badge">{t.badge}</span>
          <div className="not-found__code" aria-hidden="true">404</div>
          <h1 className="not-found__title">{t.title}</h1>
          <p className="not-found__description">{t.description}</p>
          <div className="not-found__actions">
            <Link href={`${prefix}/`} className="cta">
              {t.home}
            </Link>
            <Link href={`${prefix}/services`} className="cta cta-secondary">
              {t.services}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
