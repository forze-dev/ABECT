import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { Victor_Mono } from 'next/font/google';
import Header from '@/components/Header/Header';

import './globals.scss';

const victorMono = Victor_Mono({
	variable: "--font-victor-mono",
	subsets: ["cyrillic", "latin"]
});


// Генерація статичних параметрів для локалей
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params
}) {
	// Отримання локалі асинхронно
	const paramsData = await params;
	const locale = paramsData.locale;

	// Перевірка чи підтримується локаль
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Увімкнення статичного рендерингу
	setRequestLocale(locale);

	// Завантаження повідомлень для поточної локалі
	const messages = (await import(`../../../messages/${locale}.json`)).default;

	return (
		<html lang={locale}>
			<body className={`${victorMono.variable}`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Header />
					{children}
				</NextIntlClientProvider>

				<div className="background">
					<div className="background--light"></div>
					<div className="background--orange background__left"></div>
					<div className="background--orange background__right"></div>
					<div className="background--image"></div>
				</div>
			</body>
		</html>
	);
}