'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './ProcessSteps.scss';

interface Step {
	stepNumber?: string | null;
	stepTitle?: string | null;
	stepDescription?: string | null;
}

interface ProcessStepsProps {
	steps: Step[];
}

export default function ProcessSteps({ steps }: ProcessStepsProps): JSX.Element {
	const t = useTranslations('ServiceDetail.process');

	return (
		<div className="process-steps">
			<h2 className="process-steps__title">{t('title')}</h2>
			<p className="process-steps__subtitle">{t('subtitle')}</p>

			<div className="process-steps__list">
				{steps.map((step, index) => (
					<div key={index} className="process-steps__item">
						<div className="process-steps__number">
							{step.stepNumber || `0${index + 1}`}
						</div>
						<div className="process-steps__content">
							<h3 className="process-steps__step-title">{step.stepTitle}</h3>
							<p className="process-steps__step-description">{step.stepDescription}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
