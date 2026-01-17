'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './AboutClients.scss';

export default function AboutClients(): JSX.Element {
	const t = useTranslations('AboutPage');

	return (
		<section className="about-clients">
			<h2 className="about-clients__title">{t('clients.title')}</h2>
			<div className="about-clients__content">
				<p>{t('clients.description')}</p>
			</div>
		</section>
	);
}
