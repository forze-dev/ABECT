'use client';

import { JSX } from 'react';
import Image from 'next/image';
import { Link } from '@/client/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { Portfolio } from '@/payload-types';
import './PortfolioCard.scss';

interface PortfolioCardProps {
	project: Portfolio;
	locale: string;
}

export default function PortfolioCard({ project, locale }: PortfolioCardProps): JSX.Element {
	const t = useTranslations('Common.PortfolioCard');

	// Отримуємо URL зображення (OG image або fallback)
	const imageUrl = typeof project.seo.ogImage === 'object' && project.seo.ogImage !== null
		? project.seo.ogImage.url || '/images/placeholder-project.jpg'
		: '/images/placeholder-project.jpg';

	// Форматуємо дату
	const formattedDate = new Date(project.projectDate).toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long'
	});

	return (
		<article
			className="portfolio-card"
			itemScope
			itemType="https://schema.org/CreativeWork"
		>
			<Link
				href={`/portfolio/${project.slug}`}
				className="portfolio-card__link"
				aria-label={`${t('viewCase')}: ${project.title}`}
			>
				{/* Зображення проєкту */}
				<div className="portfolio-card__image">
					<Image
						src={imageUrl}
						alt={project.title}
						width={600}
						height={400}
						sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="portfolio-card__img"
						itemProp="image"
					/>
					<div className="portfolio-card__overlay">
						<span className="portfolio-card__cta">
							{t('viewCase')} →
						</span>
					</div>
				</div>

				{/* Контент картки */}
				<div className="portfolio-card__content">
					{/* Badge з типом послуги */}
					<div className="portfolio-card__meta">
						<span
							className={`portfolio-card__badge portfolio-card__badge--${project.service}`}
							itemProp="keywords"
						>
							{t(`badges.${project.service}`)}
						</span>
						{project.featured && (
							<span className="portfolio-card__featured" title={t('featured')}>
								★
							</span>
						)}
					</div>

					{/* Заголовок */}
					<h3 className="portfolio-card__title" itemProp="name">
						{project.title}
					</h3>

					{/* Короткий опис */}
					<p className="portfolio-card__description" itemProp="description">
						{project.shortDescription}
					</p>

					{/* Додаткова інформація */}
					<div className="portfolio-card__info">
						<span className="portfolio-card__client">
							{project.client}
						</span>
						<span className="portfolio-card__date">
							<time dateTime={project.projectDate} itemProp="datePublished">
								{formattedDate}
							</time>
						</span>
					</div>
				</div>

				{/* Schema.org мета-дані */}
				<meta itemProp="author" content="ABECT" />
				<link itemProp="url" href={`/${locale}/portfolio/${project.slug}`} />
			</Link>
		</article>
	);
}