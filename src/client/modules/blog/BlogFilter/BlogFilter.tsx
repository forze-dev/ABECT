'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/client/i18n/navigation';
import { Link } from '@/client/i18n/navigation';
import type { Category } from '@/payload-types';
import './BlogFilter.scss';

interface BlogFilterProps {
	activeCategory?: string; // slug категорії або undefined для "all"
	categories: Category[];
	counts: Record<string, number>;
}

export default function BlogFilter({
	activeCategory,
	categories,
	counts
}: BlogFilterProps): JSX.Element {
	const t = useTranslations('BlogPage.filter');
	const router = useRouter();

	// Динамічні фільтри з категорій
	const filters = [
		{ slug: 'all', label: t('all'), href: '/blog' },
		...categories.map(cat => ({
			slug: cat.slug,
			label: cat.name,
			href: `/blog/${cat.slug}`
		}))
	];

	const isActive = (slug: string) => {
		if (slug === 'all') return !activeCategory;
		return activeCategory === slug;
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		if (value === 'all') {
			router.push('/blog');
		} else {
			router.push(`/blog/${value}`);
		}
	};

	return (
		<aside className="blog-filter" aria-label={t('ariaLabel')}>
			<h2 className="blog-filter__title">{t('title')}</h2>

			{/* Desktop & Tablet - List */}
			<ul className="blog-filter__list" role="list">
				{filters.map((filter) => (
					<li key={filter.slug} role="listitem">
						<Link
							href={filter.href}
							className={`blog-filter__item ${
								isActive(filter.slug) ? 'blog-filter__item--active' : ''
							}`}
							aria-current={isActive(filter.slug) ? 'page' : undefined}
						>
							<span className="blog-filter__label">{filter.label}</span>
							<span className="blog-filter__count">{counts[filter.slug] || 0}</span>
						</Link>
					</li>
				))}
			</ul>

			{/* Mobile - Select */}
			<div className="blog-filter__select-wrapper">
				<select
					className="blog-filter__select"
					value={activeCategory || 'all'}
					onChange={handleSelectChange}
					aria-label={t('selectAriaLabel')}
				>
					{filters.map((filter) => (
						<option key={filter.slug} value={filter.slug}>
							{filter.label} ({counts[filter.slug] || 0})
						</option>
					))}
				</select>
			</div>
		</aside>
	);
}
