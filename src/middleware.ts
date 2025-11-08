import createMiddleware from 'next-intl/middleware';
import { routing } from './client/i18n/routing';

export default createMiddleware({
  ...routing,
  // Это ключевая опция:
  // автоматически подставляет defaultLocale (ua) для корня `/`
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)']
};
