'use client';
import { JSX } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/client/i18n/navigation';
import './Hero.scss';

export default function Hero(): JSX.Element {
	const t = useTranslations('HomePage.Hero');

	return (
		<section className="entry" itemScope itemType="https://schema.org/Organization">
			<div className="container">
				<div className="entry__wrapper">
					<div className="entry__left">
						<div className="entry__uppertitle">
							{t('uppertitle')}
						</div>
						<h1 itemProp="name">{t('title')}</h1>
						<p>{t('description')}</p>
						<div className="entry__btns">
							<button
								type="button"
								data-open-modal
								className="cta"
								aria-label={t('orderButtonAriaLabel')}
							>
								{t('orderButton')}
							</button>
							<Link
								href="/portfolio"
								className="cta cta-secondary"
								aria-label={t('portfolioButtonAriaLabel')}
							>
								{t('portfolioButton')}
							</Link>
						</div>
					</div>
					<div className="entry__right">
						<Image
							src="/images/entry.png"
							alt={t('imageAlt')}
							width={600}
							height={600}
							priority
							sizes="(max-width: 1024px) 90vw, 35vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}