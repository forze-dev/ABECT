import createMiddleware from 'next-intl/middleware';
import { routing } from './client/i18n/routing';

export default createMiddleware({
  ...routing,
  // Key option: auto-inserts defaultLocale (uk) for root `/` without a prefix
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)']
};
