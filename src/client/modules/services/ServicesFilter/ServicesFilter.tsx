'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import './ServicesFilter.scss';

export type FilterType = 'all' | 'web-development' | 'marketing' | 'design';

interface FilterCounts {
	all: number;
	'web-development': number;
	marketing: number;
	design: number;
}

interface ServicesFilterProps {
	activeFilter: FilterType;
	onFilterChange: (filter: FilterType) => void;
	counts: FilterCounts;
}

export default function ServicesFilter({
	activeFilter,
	onFilterChange,
	counts
}: ServicesFilterProps): JSX.Element {
	const t = useTranslations('ServicesPage.filter');

	const filters: Array<{ value: FilterType; label: string }> = [
		{ value: 'all', label: t('all') },
		{ value: 'web-development', label: t('webDevelopment') },
		{ value: 'marketing', label: t('marketing') },
		{ value: 'design', label: t('design') }
	];

	return (
		<aside className="services-filter" aria-label={t('ariaLabel')}>
			<h2 className="services-filter__title">{t('title')}</h2>

			{/* Desktop & Tablet - Список */}
			<ul className="services-filter__list" role="list">
				{filters.map((filter) => (
					<li key={filter.value} role="listitem">
						<button
							type="button"
							className={`services-filter__item ${
								activeFilter === filter.value ? 'services-filter__item--active' : ''
							}`}
							onClick={() => onFilterChange(filter.value)}
							aria-pressed={activeFilter === filter.value}
							aria-label={`${filter.label} (${counts[filter.value]})`}
						>
							<span className="services-filter__label">{filter.label}</span>
							<span className="services-filter__count">{counts[filter.value]}</span>
						</button>
					</li>
				))}
			</ul>

			{/* Mobile - Select */}
			<div className="services-filter__select-wrapper">
				<select
					className="services-filter__select"
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
