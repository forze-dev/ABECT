import React, { JSX } from 'react';
import type { Service } from '@/payload-types';

import ServiceHero from './ServiceHero/ServiceHero';
import PricingComparison from './PricingComparison/PricingComparison';
import ServiceContent from './ServiceContent/ServiceContent';
import PortfolioShowcase from './PortfolioShowcase/PortfolioShowcase';
import FAQSection from './FAQSection/FAQSection';
import RelatedServices from './RelatedServices/RelatedServices';

interface ServiceDetailProps {
	service: Service;
	relatedServices: Service[];
	locale: string;
}

function ServiceDetail({ service, relatedServices, locale }: ServiceDetailProps): JSX.Element {
	return (
		<main>
			<ServiceHero service={service} locale={locale} />


			{service.hasWebliumOption && (
				<PricingComparison service={service} locale={locale} />
			)}

			<ServiceContent service={service} />

			{service.relatedPortfolioProjects && service.relatedPortfolioProjects.length > 0 && (
				<PortfolioShowcase projects={service.relatedPortfolioProjects} locale={locale} />
			)}

			{service.faq && service.faq.length > 0 && (
				<FAQSection faq={service.faq} />
			)}

			<RelatedServices services={relatedServices} locale={locale} />
		</main>
	);
}

export default ServiceDetail;
