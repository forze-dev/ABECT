import { JSX } from 'react';
import { Link } from '@/client/i18n/navigation';
import { useTranslations } from 'next-intl';
import PortfolioList from '@/client/components/PortfolioList/PortfolioList';
import type { Portfolio } from '@/payload-types';
import './PortfolioShowcase.scss';

interface PortfolioShowcaseProps {
	projects: (number | Portfolio)[];
	locale: string;
}

export default function PortfolioShowcase({ projects, locale }: PortfolioShowcaseProps): JSX.Element {
	const t = useTranslations('ServiceDetail.portfolio');

	// Фільтруємо тільки повноцінні об'єкти Portfolio (не ID)
	const validProjects = projects.filter(
		(project): project is Portfolio => typeof project === 'object'
	);

	if (validProjects.length === 0) return <></>;

	return (
		<section className="portfolio-showcase">
			<div className="container">
				<header className="portfolio-showcase__header">
					<h2 className="portfolio-showcase__title">{t('title')}</h2>
					<p className="portfolio-showcase__subtitle">{t('subtitle')}</p>
				</header>

				<PortfolioList projects={validProjects} locale={locale} startRows={3} />

				<footer className="portfolio-showcase__footer">
					<Link href="/portfolio" className="cta cta-secondary">
						{t('viewAll')}
					</Link>
				</footer>
			</div>
		</section>
	);
}
