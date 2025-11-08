'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Send, Facebook, Instagram, Smartphone, Mail } from 'lucide-react';
import './Footer.scss';

export default function Footer() {
	const t = useTranslations('Footer');
	const [currentYear, setCurrentYear] = useState(2025);

	useEffect(() => {
		setCurrentYear(new Date().getFullYear());
	}, []);

	const navItems = [
		{ href: '/#services', section: 'services' },
		{ href: '/#about', section: 'about' },
		{ href: '/#portfolio', section: 'portfolio' },
		{ href: '/#price', section: 'price' },
		{ href: '/#contacts', section: 'contacts' }
	];

	const contactLinks = [
		{ href: 'https://t.me/+380980275819', icon: <Send size={20} /> },
		{ href: 'https://www.facebook.com', icon: <Facebook size={20} /> },
		{ href: 'https://www.instagram.com', icon: <Instagram size={20} /> }
	];

	const contactInfo = [
		{
			icon: <Mail />,
			href: 'mailto:support@abect.com',
			text: 'support@abect.com',
			type: 'email'
		},
		{
			icon: <Smartphone />,
			href: 'tel:+380934638024',
			text: '+38 (093) 463-80-24',
			type: 'telephone'
		},
		{
			icon: <Smartphone />,
			href: 'tel:+380980275819',
			text: '+38 (098) 027-58-19',
			type: 'telephone'
		}
	];

	return (
		<footer className="footer" itemScope itemType="https://schema.org/Organization">
			<div className="container">
				<div className="footer__wrapper">
					<div className="footer__top">
						<div className="footer__section footer__company">
							<Link href="/" className="footer__logo">
								<Image
									src="/icons/logo.svg"
									alt="Company name logo"
									width={40}
									height={40}
									itemProp="logo"
								/>
								<span itemProp="name">{t('logo')}</span>
							</Link>

							<p className="footer__description" itemProp="description">
								{t('description')}
							</p>
						</div>

						<div className="footer__section footer__menu">
							<div className="footer__section-title">{t('navigation')}</div>
							<nav aria-label={t('navigationAriaLabel')}>
								<ul className="footer__links" itemScope itemType="https://schema.org/ItemList">
									{navItems.map((item) => (
										<li
											key={item.section}
											itemProp="itemListElement"
											itemScope
											itemType="https://schema.org/ListItem"
										>
											<a
												href={item.href}
												title={t(`navTitles.${item.section}`)}
												itemProp="url"
											>
												<span itemProp="name">{t(`nav.${item.section}`)}</span>
											</a>
										</li>
									))}
								</ul>
							</nav>
						</div>

						<div className="footer__section footer__hours-social">
							<div
								className="footer__hours"
								itemProp="openingHoursSpecification"
								itemScope
								itemType="https://schema.org/OpeningHoursSpecification"
							>
								<div className="footer__section-title">{t('workingHours')}</div>
								<ul className="footer__hours-list">
									<li className="footer__hours-item">
										<span>{t('weekdays')}</span>
										<span>{t('workingTime')}</span>
										<meta itemProp="dayOfWeek" content="Monday,Tuesday,Wednesday,Thursday,Friday" />
										<meta itemProp="opens" content="09:00" />
										<meta itemProp="closes" content="18:00" />
									</li>
								</ul>
							</div>

							<div className="footer__social">
								{contactLinks.map((contact, index) => (
									<a
										key={index}
										href={contact.href}
										target="_blank"
										rel="noopener noreferrer"
										className="footer__social-link"
									>
										{contact.icon}
									</a>
								))}
							</div>
						</div>

						<div className="footer__section footer__contact">
							<div className="footer__section-title">{t('contacts')}</div>
							<div
								className="footer__contact-info"
								itemProp="contactPoint"
								itemScope
								itemType="https://schema.org/ContactPoint"
							>
								{contactInfo.map((contact, index) => (
									<div key={index} className="footer__contact-item">
										<span className="footer__contact-label">
											{contact.icon}
										</span>
										<div className="footer__contact-value">
											<a href={contact.href} itemProp={contact.type}>
												{contact.text}
											</a>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="footer__bottom">
						<div className="footer__copyright">
							© <span id="current-year">{currentYear}</span> {t('logo')}. {t('rights')}
						</div>

						<ul className="footer__legal">
							<li>
								<Link href="/privacy-policy">{t('privacyPolicy')}</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}