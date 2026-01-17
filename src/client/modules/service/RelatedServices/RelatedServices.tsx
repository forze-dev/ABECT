import { JSX } from 'react';
import { Link } from '@/client/i18n/navigation';
import { useTranslations } from 'next-intl';
import ServicesList from '@/client/components/ServicesList/ServicesList';
import type { Service } from '@/payload-types';
import './RelatedServices.scss';

interface RelatedServicesProps {
	services: Service[];
	locale: string;
}

export default function RelatedServices({ services, locale }: RelatedServicesProps): JSX.Element | null {
	const t = useTranslations('ServiceDetail.related');

	if (services.length === 0) return null;

	return (
		<section className="related-services">
			<div className="container">
				<header className="related-services__header">
					<h2 className="related-services__title">{t('title')}</h2>
					<p className="related-services__subtitle">{t('subtitle')}</p>
				</header>

				<ServicesList services={services} locale={locale} startRows={3} />

				<footer className="related-services__footer">
					<Link href="/services" className="cta cta-secondary">
						{t('viewAll')}
					</Link>
				</footer>
			</div>
		</section>
	);
}
