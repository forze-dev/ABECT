'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './Header.scss';
import { Send, Facebook, Instagram } from 'lucide-react';

export default function Header() {
	const t = useTranslations('Header');
	const tCC = useTranslations('Common');

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState('services');
	const [indicatorStyle, setIndicatorStyle] = useState({});

	const headerRef = useRef(null);
	const navRef = useRef(null);
	const menuRef = useRef(null);

	// Touch handling for swipe to close
	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	const touchEndX = useRef(0);
	const touchEndY = useRef(0);
	const isSwiping = useRef(false);

	// Toggle menu
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Close menu
	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	// Handle body scroll lock
	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add('fixed-body');
		} else {
			document.body.classList.remove('fixed-body');
		}

		return () => {
			document.body.classList.remove('fixed-body');
		};
	}, [isMenuOpen]);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			setIsScrolled(scrollTop > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Handle intersection observer for active sections
	useEffect(() => {
		const sections = document.querySelectorAll('section[id]');

		const options = {
			root: null,
			rootMargin: '-20% 0px -70% 0px',
			threshold: 0
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					setActiveSection(entry.target.id);
				}
			});
		}, options);

		sections.forEach(section => observer.observe(section));

		return () => {
			sections.forEach(section => observer.unobserve(section));
		};
	}, []);

	// Update indicator position
	useEffect(() => {
		if (!navRef.current) return;

		const activeLink = navRef.current.querySelector(`[data-section="${activeSection}"]`);
		if (!activeLink) return;

		const linkRect = activeLink.getBoundingClientRect();
		const navRect = navRef.current.getBoundingClientRect();

		const leftPosition = linkRect.left - navRect.left;
		const width = linkRect.width;

		setIndicatorStyle({
			left: `${leftPosition}px`,
			width: `${width}px`
		});
	}, [activeSection]);

	// Handle smooth scroll
	const handleNavClick = (e, targetId) => {
		e.preventDefault();
		const targetSection = document.getElementById(targetId);

		if (targetSection && headerRef.current) {
			const headerHeight = headerRef.current.offsetHeight;
			const targetPosition = targetSection.offsetTop - headerHeight - 50;

			window.scrollTo({
				top: targetPosition,
				behavior: 'smooth'
			});
		}

		closeMenu();
	};

	// Handle touch events for swipe
	const handleTouchStart = (e) => {
		touchStartX.current = e.changedTouches[0].screenX;
		touchStartY.current = e.changedTouches[0].screenY;
		isSwiping.current = false;
	};

	const handleTouchMove = (e) => {
		isSwiping.current = true;
		touchEndX.current = e.changedTouches[0].screenX;
		touchEndY.current = e.changedTouches[0].screenY;
	};

	const handleTouchEnd = () => {
		if (isSwiping.current) {
			const horizontalDistance = touchStartX.current - touchEndX.current;
			const verticalDistance = Math.abs(touchStartY.current - touchEndY.current);

			if (horizontalDistance > 70 && horizontalDistance > verticalDistance) {
				closeMenu();
			}
		}
		isSwiping.current = false;
	};

	const navItems = [
		{ href: '#services', section: 'services' },
		{ href: '#about', section: 'about' },
		{ href: '#portfolio', section: 'portfolio' },
		{ href: '#price', section: 'price' },
		{ href: '#contacts', section: 'contacts' }
	];

	const contactLinks = [
		{ href: 'https://t.me/+380980275819', icon: <Send /> },
		{ href: 'https://wa.me/380934638024', icon: <Facebook /> },
		{ href: 'viber://chat/?number=%2B380980275819', icon: <Instagram /> }
	];

	return (
		<header ref={headerRef} className={`header ${isScrolled ? 'scrolled' : ''}`}>
			<div className="container">
				<div className="header__wrapper">
					<Link href="/" className="header__logo logo">
						<Image src="/icons/logo.svg" alt="Company name logo" width={36} height={36} />
						<span>{t('logo')}</span>
					</Link>

					<div
						ref={menuRef}
						className={`header__menu ${isMenuOpen ? 'active' : ''}`}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<nav
							ref={navRef}
							className="header__menu-nav"
							role="navigation"
							aria-label={t('menuAriaLabel')}
						>
							<ul itemScope itemType="https://schema.org/ItemList">
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
											data-section={item.section}
											className={activeSection === item.section ? 'active' : ''}
											onClick={(e) => handleNavClick(e, item.section)}
										>
											<span itemProp="name">{t(`nav.${item.section}`)}</span>
										</a>
									</li>
								))}
							</ul>
							<div
								className={`nav-indicator ${activeSection ? 'active' : ''}`}
								style={indicatorStyle}
							></div>
						</nav>

						<div className="header__menu-contacts" aria-label={t('contactsAriaLabel')}>
							<ul className="contacts-list">
								{contactLinks.map((contact, index) => (
									<li key={index}>
										<a href={contact.href} target="_blank" rel="noopener noreferrer">
											{contact.icon}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="header__language">
						<LanguageSwitcher />
					</div>

					<button
						type="button"
						id="open-modal"
						className="header__cta cta cta-secondary"
					>
						{tCC('cta')}
					</button>

					<button
						type="button"
						className={`header__burger ${isMenuOpen ? 'active' : ''}`}
						aria-label={t('burgerAriaLabel')}
						onClick={toggleMenu}
					>
						<div className="header__burger-element"></div>
						<div className="header__burger-element"></div>
						<div className="header__burger-element"></div>
					</button>
				</div>
			</div>
		</header>
	);
}