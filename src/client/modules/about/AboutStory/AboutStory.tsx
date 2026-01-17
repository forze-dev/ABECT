'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './AboutStory.scss';

export default function AboutStory(): JSX.Element {
	const t = useTranslations('AboutPage');

	return (
		<section className="about-story">
			<h2 className="about-story__title">{t('story.title')}</h2>
			<div className="about-story__content">
				<p>{t('story.paragraph1')}</p>
				<p>{t('story.paragraph2')}</p>
				<p>{t('story.paragraph3')}</p>
			</div>
		</section>
	);
}
