'use client';

import { JSX, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/client/i18n/navigation';
import type { Service, ServiceType } from '@/payload-types';
import ServicesFilter from '../ServicesFilter/ServicesFilter';
import ServicesList from '@/client/components/ServicesList/ServicesList';
import Breadcrumbs from '@/client/components/Breadcrumbs/Breadcrumbs';
import './ServicesPage.scss';

interface ServicesPageProps {
	locale: string;
	services: Service[];           // Services to display (all or filtered by type)
	allServices?: Service[];       // All services for counting (optional)
	serviceTypes: ServiceType[];
	currentType?: ServiceType;     // Current type (undefined = all)
}

export default function ServicesPage({
	locale,
	services,
	allServices,
	serviceTypes,
	currentType
}: ServicesPageProps): JSX.Element {
	const t = useTranslations('ServicesPage');

	// Use allServices for counting if provided
	const servicesForCounting = allServices || services;

	// Count for each service type
	const filterCounts = useMemo(() => {
		const counts: Record<string, number> = { all: 0 };

		// Initialize counters for all types
		serviceTypes.forEach(type => {
			counts[type.slug] = 0;
		});

		// Count services by type
		servicesForCounting.forEach(service => {
			counts.all++;
			const typeSlug = typeof service.serviceType === 'object' ? service.serviceType.slug : null;
			if (typeSlug && counts[typeSlug] !== undefined) {
				counts[typeSlug]++;
			}
		});

		return counts;
	}, [servicesForCounting, serviceTypes]);

	// Page title and description
	const pageTitle = currentType ? currentType.name : t('title');
	const pageSubtitle = currentType ? currentType.description : t('subtitle');

	return (
		<section
			className="services-page"
			itemScope
			itemType="https://schema.org/CollectionPage"
		>
			<div className="container">
				{/* Header */}
				<header className="services-page__header">
					<h1 className="services-page__title" itemProp="name">
						{pageTitle}
					</h1>
					<p className="services-page__subtitle" itemProp="description">
						{pageSubtitle}
					</p>
				</header>

				<Breadcrumbs
					chapter="services"
					slug={currentType ? currentType.name : undefined}
				/>

				{/* Main Layout: Filter (1fr) + Content (3fr) */}
				<div className="services-page__layout">
					{/* Sidebar with filter */}
					<ServicesFilter
						activeType={currentType?.slug}
						serviceTypes={serviceTypes}
						counts={filterCounts}
					/>

					{/* Content */}
					<div className="services-page__content">
						{/* If there are services */}
						{services.length > 0 ? (
							<>
								<ServicesList services={services} locale={locale} startRows={3} />

								{/* Stats Footer */}
								<footer className="services-page__stats">
									<p>
										{t('showingResults', { count: services.length })}
									</p>
									{currentType && (
										<Link
											href="/services"
											className="services-page__reset-btn"
										>
											{t('viewAllButton')}
										</Link>
									)}
								</footer>
							</>
						) : (
							/* Empty State */
							<div className="services-page__empty">
								<h3>{t('noResults')}</h3>
								<p>{t('noResultsDescription')}</p>
								<Link href="/services" className="cta">
									{t('viewAllButton')}
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* Schema.org meta */}
				<meta itemProp="numberOfItems" content={String(services.length)} />
			</div>
		</section>
	);
}
