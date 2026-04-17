import { getLocale } from 'next-intl/server'
import { Link } from '@/client/i18n/navigation'
import './not-found.scss'

const messages = {
  ua: {
    badge: 'Помилка 404',
    title: 'Сторінку не знайдено',
    description: 'Можливо, вона була переміщена або видалена. Перевірте адресу або поверніться на головну.',
    home: 'На головну',
    back: 'Назад',
  },
  en: {
    badge: 'Error 404',
    title: 'Page not found',
    description: 'It may have been moved or deleted. Check the URL or go back to the homepage.',
    home: 'Go home',
    back: 'Go back',
  },
}

export default async function NotFound() {
  let locale: 'ua' | 'en' = 'ua'
  try {
    const detected = await getLocale()
    if (detected === 'en') locale = 'en'
  } catch {
    // layout not yet set locale, use default
  }

  const t = messages[locale]

  return (
    <section className="not-found">
      <div className="container">
        <div className="not-found__wrapper">
          <span className="not-found__badge">{t.badge}</span>
          <div className="not-found__code" aria-hidden="true">404</div>
          <h1 className="not-found__title">{t.title}</h1>
          <p className="not-found__description">{t.description}</p>
          <div className="not-found__actions">
            <Link href="/" className="cta">
              {t.home}
            </Link>
            <Link href="/services" className="cta cta-secondary">
              {locale === 'ua' ? 'Наші послуги' : 'Our services'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
