'use client';

import { JSX, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { Service } from '@/payload-types';
import ServicesFilter, { FilterType } from '../ServicesFilter/ServicesFilter';
import ServicesList from '@/client/components/ServicesList/ServicesList';
import Breadcrumbs from '@/client/components/Breadcrumbs/Breadcrumbs';
import './ServicesPage.scss';

interface ServicesPageProps {
	locale: string;
	initialServices: Service[];
}

export default function ServicesPage({
	locale,
	initialServices
}: ServicesPageProps): JSX.Element {
	const t = useTranslations('ServicesPage');
	const [activeFilter, setActiveFilter] = useState<FilterType>('all');

	// Фильтрация сервисов на клиенте
	const filteredServices = useMemo(() => {
		if (activeFilter === 'all') return initialServices;
		return initialServices.filter((service) => service.category === activeFilter);
	}, [activeFilter, initialServices]);

	// Подсчет сервисов для каждого фильтра
	const filterCounts = useMemo(
		() => ({
			all: initialServices.length,
			'web-development': initialServices.filter((s) => s.category === 'web-development').length,
			marketing: initialServices.filter((s) => s.category === 'marketing').length,
			design: initialServices.filter((s) => s.category === 'design').length
		}),
		[initialServices]
	);

	return (
		<section
			className="services-page"
			itemScope
			itemType="https://schema.org/CollectionPage"
		>
			<div className="container">
				{/* Заголовок страницы */}
				<header className="services-page__header">
					<h1 className="services-page__title" itemProp="name">
						{t('title')}
					</h1>
					<p className="services-page__subtitle" itemProp="description">
						{t('subtitle')}
					</p>
				</header>

				<Breadcrumbs chapter='services' />

				{/* Main Layout: Фильтр (1fr) + Контент (3fr) */}
				<div className="services-page__layout">
					{/* Sidebar с фильтром */}
					<ServicesFilter
						activeFilter={activeFilter}
						onFilterChange={setActiveFilter}
						counts={filterCounts}
					/>

					{/* Контент */}
					<div className="services-page__content">
						{/* Если есть сервисы */}
						{filteredServices.length > 0 ? (
							<>
								<ServicesList services={filteredServices} locale={locale} startRows={3} />

								{/* Stats Footer */}
								<footer className="services-page__stats">
									<p>
										{t('showingResults', { count: filteredServices.length })}
									</p>
									{activeFilter !== 'all' && (
										<button
											type="button"
											className="services-page__reset-btn"
											onClick={() => setActiveFilter('all')}
										>
											{t('viewAllButton')}
										</button>
									)}
								</footer>
							</>
						) : (
							/* Empty State */
							<div className="services-page__empty">
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
				<meta itemProp="numberOfItems" content={String(filteredServices.length)} />
			</div>
		</section>
	);
}
