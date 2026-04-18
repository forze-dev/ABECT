'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/client/i18n/navigation';
import './CookieBanner.scss';

const STORAGE_KEY = 'abect_cookie_consent';

interface CookieBannerProps {
  locale: string;
}

const content = {
  ua: {
    text: 'Ми використовуємо cookies для аналітики (Microsoft Clarity, Google Analytics) та покращення сайту.',
    policy: 'Детальніше',
    accept: 'Прийняти',
    decline: 'Відхилити',
  },
  en: {
    text: 'We use cookies for analytics (Microsoft Clarity, Google Analytics) and site improvements.',
    policy: 'Learn more',
    accept: 'Accept',
    decline: 'Decline',
  },
};

export default function CookieBanner({ locale }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);
  const t = content[locale as keyof typeof content] ?? content.ua;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const handle = (decision: 'accepted' | 'declined') => {
    localStorage.setItem(STORAGE_KEY, decision);
    setVisible(false);
    if (decision === 'accepted') {
      window.dispatchEvent(new Event('cookieConsentAccepted'));
    }
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie consent">
      <p className="cookie-banner__text">
        {t.text}{' '}
        <Link href="/privacy-policy" className="cookie-banner__link">
          {t.policy}
        </Link>
      </p>
      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--decline"
          onClick={() => handle('declined')}
        >
          {t.decline}
        </button>
        <button
          type="button"
          className="cookie-banner__btn cookie-banner__btn--accept"
          onClick={() => handle('accepted')}
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
}
