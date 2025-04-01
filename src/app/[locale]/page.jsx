import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Hero from '@/sections/home/hero/Hero';

// Генерація статичних параметрів для локалей
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

// Метадані для SEO
export async function generateMetadata({ params }) {
	const paramsData = await params;
	const locale = paramsData.locale;

	return {
		title: locale === 'ua' ? 'Головна сторінка' : 'Home Page',
		description: locale === 'ua'
			? 'Ласкаво просимо на наш багатомовний сайт'
			: 'Welcome to our multilingual website'
	};
}

export default async function HomePage({ params }) {
	// Отримання локалі асинхронно
	const paramsData = await params;
	const locale = paramsData.locale;

	// Увімкнення статичного рендерингу
	setRequestLocale(locale);

	return (
		<main>
			<Hero />
		</main>
	);
}