'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './AboutApproach.scss';

export default function AboutApproach(): JSX.Element {
	const t = useTranslations('AboutPage');

	const principles = [
		{
			title: t('approach.principle1.title'),
			description: t('approach.principle1.description')
		},
		{
			title: t('approach.principle2.title'),
			description: t('approach.principle2.description')
		},
		{
			title: t('approach.principle3.title'),
			description: t('approach.principle3.description')
		},
		{
			title: t('approach.principle4.title'),
			description: t('approach.principle4.description')
		}
	];

	return (
		<section className="about-approach">
			<h2 className="about-approach__title">{t('approach.title')}</h2>

			<div className="about-approach__grid">
				{principles.map((principle, index) => (
					<div key={index} className="about-approach__card">
						<div className="about-approach__number">{index + 1}</div>
						<div className="about-approach__content">
							<h3 className="about-approach__principle-title">{principle.title}</h3>
							<p className="about-approach__description">{principle.description}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
