import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	// Список підтримуваних локалей
	locales: ['ua', 'en'],

	// Локаль за замовчуванням
	defaultLocale: 'ua'
});