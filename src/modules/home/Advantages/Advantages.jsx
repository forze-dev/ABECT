'use client';

import { useTranslations } from 'next-intl';
import './Advantages.scss';

export default function Advantages() {
	const t = useTranslations('HomePage.Advantages');

	const advantages = [
		{ number: '01', key: 'advantage1' },
		{ number: '02', key: 'advantage2' },
		{ number: '03', key: 'advantage3' },
		{ number: '04', key: 'advantage4' },
		{ number: '05', key: 'advantage5' },
		{ number: '06', key: 'advantage6' }
	];

	return (
		<section id="advantages" aria-labelledby="advantages-title">
			<div className="container">
				<header className="advantages__header">
					<h2 id="advantages-title" className="advantages__title" itemProp="name">
						{t('title')}
					</h2>
					<p className="advantages__subtitle" itemProp="description">
						{t('subtitle')}
					</p>
				</header>

				<div className="advantages__timeline" role="list" aria-label={t('listAriaLabel')}>
					<div className="timeline-line" aria-hidden="true"></div>

					{advantages.map((advantage, index) => (
						<article
							key={advantage.key}
							className="advantage-card"
							role="listitem"
							itemScope
							itemType="https://schema.org/Service"
							aria-labelledby={`advantage-${index + 1}`}
						>
							<span className="advantage-card__number" aria-label={t('numberAriaLabel', { number: advantage.number })}>
								{advantage.number}
							</span>
							<h3 id={`advantage-${index + 1}`} className="advantage-card__title" itemProp="name">
								{t(`${advantage.key}.title`)}
							</h3>
							<p className="advantage-card__description" itemProp="description">
								{t(`${advantage.key}.description`)}
							</p>
							<meta itemProp="serviceType" content={t(`${advantage.key}.serviceType`)} />
						</article>
					))}
				</div>

				<footer className="advantages__footer">
					<button type="button" className="cta" aria-label={t('ctaAriaLabel')}>
						{t('cta')}
					</button>
				</footer>
			</div>
		</section>
	);
}