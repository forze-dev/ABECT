'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Blocks, Code } from 'lucide-react';
import './Services.scss';

export default function Services() {
	const t = useTranslations('HomePage.Services');
	const cardsRef = useRef([]);
	const [serviceTypes, setServiceTypes] = useState({
		landing: 'weblium',
		corporate: 'weblium',
		ecommerce: 'weblium',
		advertising: 'custom'
	});

	useEffect(() => {
		if (window.innerWidth < 1024) return;

		cardsRef.current.forEach(card => {
			if (!card) return;

			const handleMouseEnter = () => {
				card.style.transition = 'box-shadow 0.3s ease, background 0.3s ease';
				card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
			};

			const handleMouseMove = (e) => {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const gradientX = (x / rect.width) * 100;
				const gradientY = (y / rect.height) * 100;

				// лише світлий, майже непомітний "глімс"
				card.style.background = `
				radial-gradient(
					circle at ${gradientX}% ${gradientY}%,
					rgba(255, 255, 255, 0.03),
					rgba(255, 255, 255, 0)
				)
			`;
			};

			const handleMouseLeave = () => {
				card.style.transition = 'box-shadow 0.5s ease, background 0.6s ease';
				card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.06)';
				card.style.background = ''; // повертаємо оригінальний фон
			};

			card.addEventListener('mouseenter', handleMouseEnter);
			card.addEventListener('mousemove', handleMouseMove);
			card.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				card.removeEventListener('mouseenter', handleMouseEnter);
				card.removeEventListener('mousemove', handleMouseMove);
				card.removeEventListener('mouseleave', handleMouseLeave);
			};
		});
	}, []);


	const toggleServiceType = (service) => {
		setServiceTypes(prev => ({
			...prev,
			[service]: prev[service] === 'weblium' ? 'custom' : 'weblium'
		}));
	};

	const services = ['landing', 'corporate', 'ecommerce', 'advertising'];

	return (
		<section className="services" id="services" itemScope itemType="https://schema.org/Organization">
			<div className="container">
				<header className="services__header">
					<h2 className="services__title" itemProp="name">{t('title')}</h2>
					<p className="services__subtitle" itemProp="description">
						{t('subtitle')}
					</p>
				</header>

				<div className="services__grid" role="list" aria-label={t('gridAriaLabel')}>
					{services.map((service, index) => {
						const type = serviceTypes[service];
						const hasToggle = service !== 'advertising';

						return (
							<article
								key={service}
								ref={el => cardsRef.current[index] = el}
								className="service-card"
								data-service={service}
								role="listitem"
								itemScope
								itemType="https://schema.org/Service"
								aria-labelledby={`service-${service}`}
							>
								<div className="service-card__content">
									<div className="service-card__header">
										<h3 className="service-card__title" id={`service-${service}`} itemProp="name">
											{t(`${service}.title`)}
										</h3>

										{hasToggle && (
											<div className="service-card__toggle">
												<button
													type="button"
													className={`toggle-btn ${type === 'weblium' ? 'active' : ''}`}
													onClick={() => toggleServiceType(service)}
													aria-label={t('toggleWeblium')}
													title={t('weblium')}
												>
													<Blocks size={16} />
												</button>
												<button
													type="button"
													className={`toggle-btn ${type === 'custom' ? 'active' : ''}`}
													onClick={() => toggleServiceType(service)}
													aria-label={t('toggleCustom')}
													title={t('custom')}
												>
													<Code size={16} />
												</button>
											</div>
										)}
									</div>

									<div className="service-card__subtitle">
										{hasToggle ? t(`type.${type}`) : t('type.custom')}
									</div>

									<div className="service-card__pricing">
										<div className="service-card__price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
											<span className="price-amount">
												{hasToggle
													? (type === 'weblium' ? t(`${service}.webliumPrice`) : t(`${service}.customPrice`))
													: t(`${service}.customPrice`)
												}
											</span>
											{hasToggle && type === 'weblium' && (
												<span className="price-old">{t(`${service}.customPrice`)}</span>
											)}
											<meta itemProp="price" content={hasToggle ? (type === 'weblium' ? t(`${service}.webliumPriceValue`) : t(`${service}.customPriceValue`)) : t(`${service}.customPriceValue`)} />
											<meta itemProp="priceCurrency" content="UAH" />
										</div>
									</div>

									<p className="service-card__description" itemProp="description">
										{hasToggle
											? (type === 'weblium' ? t(`${service}.webliumDescription`) : t(`${service}.customDescription`))
											: t(`${service}.customDescription`)
										}. {" "}
										<span className="service-card__timeline">
											{t('timeline')}: {hasToggle
												? (type === 'weblium' ? t(`${service}.webliumTimeline`) : t(`${service}.customTimeline`))
												: t(`${service}.customTimeline`)
											}
										</span>
									</p>

									<ul className="service-card__features" role="list" aria-label={t(`${service}.listAriaLabel`)}>
										{[0, 1, 2, 3, 4].map(i => (
											<li key={i}>
												{hasToggle
													? (type === 'weblium'
														? t(`${service}.webliumFeatures.${i}`)
														: t(`${service}.customFeatures.${i}`))
													: t(`${service}.customFeatures.${i}`)
												}
											</li>
										))}
									</ul>

									<button
										type="button"
										className="service-card__btn"
										aria-label={t(`${service}.buttonAriaLabel`)}
									>
										{t('orderButton')}
									</button>
								</div>
							</article>
						);
					})}
				</div>

				<footer className="services__footer">
					<p className="services__footer-text">{t('footerText')}</p>
					<button type="button" className="cta cta-secondary" aria-label={t('calculateAriaLabel')}>
						{t('calculateButton')}
					</button>
				</footer>
			</div>
		</section>
	);
}