import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
	// Підходить для всіх шляхів, крім:
	// - якщо вони починаються з `/api`, `/trpc`, `/_next` або `/_vercel`
	// - якщо вони містять крапку (наприклад, `favicon.ico`)
	matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};