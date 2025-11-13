'use client';

import { JSX, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { Portfolio } from '@/payload-types';
import PortfolioFilter, { FilterType } from '../PortfolioFilter/PortfolioFilter';
import PortfolioList from '@/client/components/Portfolio/PortfolioList/PortfolioList';
import './PortfolioPage.scss';

interface PortfolioPageProps {
	locale: string;
	initialProjects: Portfolio[];
}

export default function PortfolioPage({
	locale,
	initialProjects
}: PortfolioPageProps): JSX.Element {
	const t = useTranslations('PortfolioPage');
	const [activeFilter, setActiveFilter] = useState<FilterType>('all');

	// Фильтрация проектов на клиенте
	const filteredProjects = useMemo(() => {
		if (activeFilter === 'all') return initialProjects;
		return initialProjects.filter((project) => project.service === activeFilter);
	}, [activeFilter, initialProjects]);

	// Подсчет проектов для каждого фильтра
	const filterCounts = useMemo(
		() => ({
			all: initialProjects.length,
			design: initialProjects.filter((p) => p.service === 'design').length,
			website: initialProjects.filter((p) => p.service === 'website').length,
			promotion: initialProjects.filter((p) => p.service === 'promotion').length
		}),
		[initialProjects]
	);

	return (
		<section
			className="portfolio-page"
			itemScope
			itemType="https://schema.org/CollectionPage"
		>
			<div className="container">
				{/* Заголовок страницы */}
				<header className="portfolio-page__header">
					<h1 className="portfolio-page__title" itemProp="name">
						{t('title')}
					</h1>
					<p className="portfolio-page__subtitle" itemProp="description">
						{t('subtitle')}
					</p>
				</header>

				{/* Breadcrumbs */}
				<nav
					className="portfolio-page__breadcrumbs"
					itemScope
					itemType="https://schema.org/BreadcrumbList"
				>
					<ol>
						<li
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<a itemProp="item" href={`/${locale === 'ua' ? '' : locale}`}>
								<span itemProp="name">{t('breadcrumbHome')}</span>
							</a>
							<meta itemProp="position" content="1" />
						</li>
						<li
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<span itemProp="name">{t('breadcrumbPortfolio')}</span>
							<meta itemProp="position" content="2" />
						</li>
					</ol>
				</nav>

				{/* Main Layout: Фильтр (1fr) + Контент (3fr) */}
				<div className="portfolio-page__layout">
					{/* Sidebar с фильтром */}
					<PortfolioFilter
						activeFilter={activeFilter}
						onFilterChange={setActiveFilter}
						counts={filterCounts}
					/>

					{/* Контент */}
					<div className="portfolio-page__content">
						{/* Если есть проекты */}
						{filteredProjects.length > 0 ? (
							<>
								<PortfolioList projects={filteredProjects} locale={locale} />

								{/* Stats Footer */}
								<footer className="portfolio-page__stats">
									<p>
										{t('showingResults', { count: filteredProjects.length })}
									</p>
									{activeFilter !== 'all' && (
										<button
											type="button"
											className="portfolio-page__reset-btn"
											onClick={() => setActiveFilter('all')}
										>
											{t('viewAllButton')}
										</button>
									)}
								</footer>
							</>
						) : (
							/* Empty State */
							<div className="portfolio-page__empty">
								<h3>{t('noResults')}</h3>
								<p>{t('noResultsDescription')}</p>
								<button
									type="button"
									className="cta"
									onClick={() => setActiveFilter('all')}
								>
									{t('viewAllButton')}
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Schema.org мета-данные */}
				<meta itemProp="numberOfItems" content={String(filteredProjects.length)} />
			</div>
		</section>
	);
}
