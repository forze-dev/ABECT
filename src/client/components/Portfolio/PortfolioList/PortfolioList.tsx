'use client';

import { JSX } from 'react';
import type { Portfolio } from '@/payload-types';
import PortfolioCard from '../PortfolioCard/PortfolioCard';
import './PortfolioList.scss';

interface PortfolioListProps {
	projects: Portfolio[];
	locale: string;
}

export default function PortfolioList({ projects, locale }: PortfolioListProps):JSX.Element | null {
    if (!projects?.length) return null;

	return (
		<div className="portfolio-list" role="list" aria-label="Список проєктів портфоліо">
			{projects.map((project) => (
				<div key={project.id} role="listitem">
					<PortfolioCard project={project} locale={locale} />
				</div>
			))}
		</div>
	);
}