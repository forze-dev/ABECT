'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './AboutHero.scss';

export default function AboutHero(): JSX.Element {
	const t = useTranslations('AboutPage');

	return (
		<header className="about-hero">
			<h1 className="about-hero__title" itemProp="name">
				{t('hero.title')}
			</h1>
			<p className="about-hero__subtitle" itemProp="description">
				{t('hero.subtitle')}
			</p>
			<button type="button" className="cta cta-primary">
				{t('hero.button')}
			</button>
		</header>
	);
}
