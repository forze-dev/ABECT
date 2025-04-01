'use client';

import { Link, usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher({ locale }) {
	const pathname = usePathname();

	return (
		<Link href={pathname} locale={locale === 'ua' ? 'en' : 'ua'}>
			{locale === 'ua' ? 'EN' : 'UA'}
		</Link>
	);
}