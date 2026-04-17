import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
	// Зазвичай відповідає сегменту `[locale]`
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale;

	let messages = {};
	try {
		messages = (await import(`../../../messages/${locale}.json`)).default;
	} catch {
		console.error(`[i18n/request] Missing messages for locale: ${locale}`);
	}

	return { locale, messages };
});