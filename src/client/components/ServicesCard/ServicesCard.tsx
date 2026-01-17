'use client';

import { JSX, useEffect, useRef, useState, MouseEvent } from 'react';
import { Blocks, Code } from 'lucide-react';
import type { Service } from '@/payload-types';
import { Link } from '@/client/i18n/navigation';
import './ServicesCard.scss';

type ServiceType = 'weblium' | 'custom';

interface ServicesCardProps {
	service: Service;
	locale: string;
}

export default function ServicesCard({ service, locale }: ServicesCardProps): JSX.Element {
	const cardRef = useRef<HTMLElement | null>(null);
	const [serviceType, setServiceType] = useState<ServiceType>(
		service.hasWebliumOption ? 'weblium' : 'custom'
	);

	useEffect(() => {
		if (window.innerWidth < 1024 || !cardRef.current) return;

		const card = cardRef.current;

		const handleMouseEnter = () => {
			card.style.transition = 'box-shadow 0.3s ease, background 0.3s ease';
			card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
		};

		const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const gradientX = (x / rect.width) * 100;
			const gradientY = (y / rect.height) * 100;

			card.style.background = `
				radial-gradient(
					circle at ${gradientX}% ${gradientY}%,
					rgba(255, 255, 255, 0.06),
					rgba(255, 255, 255, 0.03)
				)
			`;
		};

		const handleMouseLeave = () => {
			card.style.transition = 'box-shadow 0.5s ease, background 0.6s ease';
			card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.06)';
			card.style.background = '';
		};

		card.addEventListener('mouseenter', handleMouseEnter);
		card.addEventListener('mousemove', handleMouseMove as EventListener);
		card.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			card.removeEventListener('mouseenter', handleMouseEnter);
			card.removeEventListener('mousemove', handleMouseMove as EventListener);
			card.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	const toggleServiceType = () => {
		setServiceType(prev => prev === 'weblium' ? 'custom' : 'weblium');
	};

	const hasToggle = service.hasWebliumOption;
	const currentPrice = serviceType === 'weblium' ? service.webliumPrice : service.customPrice;
	const currentCurrency = serviceType === 'weblium' ? service.webliumPriceCurrency : service.customPriceCurrency;
	const currentTimeline = serviceType === 'weblium' ? service.webliumTimeline : service.customTimeline;
	const currentDescription = serviceType === 'weblium' ? service.webliumDescription : service.customDescription;
	const currentFeatures = serviceType === 'weblium' ? service.webliumFeatures : service.customFeatures;

	return (
		<article
			ref={cardRef}
			className="service-card"
			data-service={service.slug}
			role="listitem"
			itemScope
			itemType="https://schema.org/Service"
			aria-labelledby={`service-${service.slug}`}
		>
			<div className="service-card__content">
				<Link className='service-card__link' href={"/services/" + service.slug}>
					<div className="service-card__header">
						<h3 className="service-card__title" id={`service-${service.slug}`} itemProp="name">
							{service.title}
						</h3>
					</div>

					<div className="service-card__subtitle">
						{hasToggle ? (serviceType === 'weblium' ? 'Weblium' : 'Custom') : 'Custom'}
					</div>

					<div className="service-card__pricing">
						<div className="service-card__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
							<span className="price-amount">
								{currentPrice} {currentCurrency}
							</span>
							{hasToggle && serviceType === 'weblium' && (
								<span className="price-old">{service.customPrice} {service.customPriceCurrency}</span>
							)}
							<meta itemProp="price" content={String(currentPrice)} />
							<meta itemProp="priceCurrency" content={currentCurrency || 'UAH'} />
						</div>
					</div>

					<p className="service-card__description" itemProp="description">
						{currentDescription}.{" "}
						<span className="service-card__timeline">
							{locale === 'uk' ? 'Терміни' : 'Timeline'}: {currentTimeline}
						</span>
					</p>

					<ul className="service-card__features" role="list" aria-label={`${service.title} features`}>
						{currentFeatures?.slice(0, 5).map((item, i) => (
							<li key={item.id || i}>
								{item.feature}
							</li>
						))}
					</ul>
				</Link>

				<div className="service-card__btns">
					{hasToggle && (
						<div className="service-card__toggle">
							<button
								type="button"
								className={`toggle-btn ${serviceType === 'weblium' ? 'active' : ''}`}
								onClick={toggleServiceType}
								aria-label="Toggle Weblium"
								title="Weblium"
							>
								<Blocks size={16} />
							</button>
							<button
								type="button"
								className={`toggle-btn ${serviceType === 'custom' ? 'active' : ''}`}
								onClick={toggleServiceType}
								aria-label="Toggle Custom"
								title="Custom"
							>
								<Code size={16} />
							</button>
						</div>
					)}

					<button
						type="button"
						className="service-card__btn"
						aria-label={`Order ${service.title}`}
					>
						{locale === 'uk' ? 'Замовити' : 'Order'}
					</button>
				</div>
			</div>
		</article>
	);
}
