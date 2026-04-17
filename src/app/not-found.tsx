import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="uk">
      <body style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', background: '#0d0d1b', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <span style={{ padding: '8px 16px', background: 'rgba(55,93,251,0.1)', color: '#375dfb', fontSize: '13px', fontWeight: 600, borderRadius: '24px', border: '1px solid rgba(55,93,251,0.15)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Помилка 404
          </span>
          <div style={{ fontSize: 'clamp(80px,18vw,160px)', fontWeight: 700, lineHeight: 1, background: 'linear-gradient(135deg,#375dfb,#234fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 50px rgba(55,93,251,0.4))' }}>
            404
          </div>
          <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 700, margin: 0 }}>
            Сторінку не знайдено
          </h1>
          <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', maxWidth: '400px', margin: 0 }}>
            Перевірте адресу або поверніться на головну сторінку.
          </p>
          <Link
            href="/"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 28px', height: '48px', fontSize: '16px', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg,#375dfb,#234fff)', borderRadius: '12px', textDecoration: 'none', marginTop: '8px' }}
          >
            На головну
          </Link>
        </div>
      </body>
    </html>
  )
}
