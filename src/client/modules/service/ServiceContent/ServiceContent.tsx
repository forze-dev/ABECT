'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import RichText from '@/client/components/RichText/RichText';
import ProcessSteps from '../ProcessSteps/ProcessSteps';
import type { Service } from '@/payload-types';
import './ServiceContent.scss';

interface ServiceContentProps {
	service: Service;
}

export default function ServiceContent({ service }: ServiceContentProps): JSX.Element {
	const t = useTranslations('ServiceDetail.content');

	return (
		<section className="service-content">
			<div className="container">
				<div className="service-content__description">
					<h2 className="service-content__title">{t('aboutTitle')}</h2>
					<RichText data={service.detailedDescription} />
				</div>

				{service.whatIncluded && (
					<div className="service-content__included">
						<h2 className="service-content__title">{t('includedTitle')}</h2>
						<RichText data={service.whatIncluded} />
					</div>
				)}

				{service.process && service.process.length > 0 && (
					<ProcessSteps steps={service.process} />
				)}

				{service.comparisonTable && (
					<div className="service-content__comparison">
						<h2 className="service-content__title">{t('comparisonTitle')}</h2>
						<RichText data={service.comparisonTable} />
					</div>
				)}

				{service.technologies && service.technologies.length > 0 && (
					<div className="service-content__technologies">
						<h2 className="service-content__title">{t('technologiesTitle')}</h2>
						<ul className="service-content__tech-list">
							{service.technologies.map((item, index) => (
								<li key={index} className="service-content__tech-item">
									{item.tech}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Benefits (если есть) */}
				{service.benefits && service.benefits.length > 0 && (
					<div className="service-content__benefits">
						<h2 className="service-content__title">{t('benefitsTitle')}</h2>
						<div className="service-content__benefits-grid">
							{service.benefits.map((benefit, index) => (
								<div key={index} className="service-content__benefit-card">
									{benefit.icon && (
										<div className="service-content__benefit-icon">
											{benefit.icon}
										</div>
									)}
									<h3 className="service-content__benefit-title">{benefit.title}</h3>
									<p className="service-content__benefit-description">{benefit.description}</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
