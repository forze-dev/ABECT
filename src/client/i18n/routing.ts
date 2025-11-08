import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	// Список підтримуваних локалей
	locales: ['ua', 'en'],
	defaultLocale: 'ua',
	// Локаль за замовчуванням
	localePrefix: 'as-needed'
});