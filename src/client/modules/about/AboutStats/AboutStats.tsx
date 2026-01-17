'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './AboutStats.scss';

export default function AboutStats(): JSX.Element {
	const t = useTranslations('AboutPage');

	const stats = [
		{ value: t('stats.years'), label: t('stats.yearsLabel') },
		{ value: t('stats.projects'), label: t('stats.projectsLabel') },
		{ value: t('stats.geography'), label: t('stats.geographyLabel') }
	];

	return (
		<section className="about-stats">
			{stats.map((stat, index) => (
				<div key={index} className="about-stats__card">
					<div className="about-stats__value">{stat.value}</div>
					<div className="about-stats__label">{stat.label}</div>
				</div>
			))}
		</section>
	);
}
