'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import './error.scss'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Error boundary]', error)
  }, [error])

  return (
    <section className="error-page">
      <div className="container">
        <div className="error-page__wrapper">
          <span className="error-page__badge">Помилка сервера</span>
          <div className="error-page__code" aria-hidden="true">500</div>
          <h1 className="error-page__title">Щось пішло не так</h1>
          <p className="error-page__description">
            Сталася неочікувана помилка. Спробуйте оновити сторінку або поверніться на головну.
          </p>
          <div className="error-page__actions">
            <button className="error-page__retry" onClick={reset}>
              Спробувати знову
            </button>
            <Link href="/" className="cta cta-secondary">
              На головну
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
