'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './PortfolioFilter.scss';

export type FilterType = 'all' | 'design' | 'website' | 'promotion';

interface FilterCounts {
	all: number;
	design: number;
	website: number;
	promotion: number;
}

interface PortfolioFilterProps {
	activeFilter: FilterType;
	onFilterChange: (filter: FilterType) => void;
	counts: FilterCounts;
}

export default function PortfolioFilter({
	activeFilter,
	onFilterChange,
	counts
}: PortfolioFilterProps): JSX.Element {
	const t = useTranslations('PortfolioPage.filter');

	const filters: Array<{ value: FilterType; label: string }> = [
		{ value: 'all', label: t('all') },
		{ value: 'design', label: t('design') },
		{ value: 'website', label: t('website') },
		{ value: 'promotion', label: t('promotion') }
	];

	return (
		<aside className="portfolio-filter" aria-label={t('ariaLabel')}>
			<h2 className="portfolio-filter__title">{t('title')}</h2>

			{/* Desktop & Tablet - Список */}
			<ul className="portfolio-filter__list" role="list">
				{filters.map((filter) => (
					<li key={filter.value} role="listitem">
						<button
							type="button"
							className={`portfolio-filter__item ${
								activeFilter === filter.value ? 'portfolio-filter__item--active' : ''
							}`}
							onClick={() => onFilterChange(filter.value)}
							aria-pressed={activeFilter === filter.value}
							aria-label={`${filter.label} (${counts[filter.value]})`}
						>
							<span className="portfolio-filter__label">{filter.label}</span>
							<span className="portfolio-filter__count">{counts[filter.value]}</span>
						</button>
					</li>
				))}
			</ul>

			{/* Mobile - Select */}
			<div className="portfolio-filter__select-wrapper">
				<select
					className="portfolio-filter__select"
					value={activeFilter}
					onChange={(e) => onFilterChange(e.target.value as FilterType)}
					aria-label={t('selectAriaLabel')}
				>
					{filters.map((filter) => (
						<option key={filter.value} value={filter.value}>
							{filter.label} ({counts[filter.value]})
						</option>
					))}
				</select>
			</div>
		</aside>
	);
}
