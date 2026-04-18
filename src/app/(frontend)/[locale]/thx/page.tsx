import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ThxPage from '@/client/modules/thx/ThxPage';
import type { Metadata } from 'next';

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ form?: string; timestamp?: string }>;
};

const VALID_FORMS = ['simple', 'calculator'] as const;
const MAX_AGE_MS = 5 * 60 * 1000;

function isValidTimestamp(ts: string): boolean {
  const num = parseInt(ts, 10);
  if (isNaN(num)) return false;
  const now = Date.now();
  if (num > now) return false;
  if (now - num > MAX_AGE_MS) return false;
  return true;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ThxPage.seo' });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function ThxServerPage({ params, searchParams }: Params) {
  const { locale } = await params;
  const { form, timestamp } = await searchParams;

  setRequestLocale(locale);

  const homeUrl = locale === 'en' ? '/en' : '/';

  if (
    !form ||
    !VALID_FORMS.includes(form as (typeof VALID_FORMS)[number]) ||
    !timestamp ||
    !isValidTimestamp(timestamp)
  ) {
    redirect(homeUrl);
  }

  return <ThxPage form={form as 'simple' | 'calculator'} />;
}
