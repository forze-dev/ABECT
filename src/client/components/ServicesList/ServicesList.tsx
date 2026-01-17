'use client';

import { JSX } from 'react';
import type { Service } from '@/payload-types';
import ServicesCard from '../ServicesCard/ServicesCard';
import './ServicesList.scss';

interface ServicesListProps {
	services: Service[];
	locale: string;
	startRows?: number;
}

export default function ServicesList({ services, locale, startRows = 4 }: ServicesListProps): JSX.Element | null {
	if (!services?.length) return null;

	return (
		<div className={`services-list services-list__rows--${startRows}`} role="list" aria-label="Список послуг">
			{services.map((service) => (
				<div key={service.id} role="listitem">
					<ServicesCard service={service} locale={locale} />
				</div>
			))}
		</div>
	);
}
