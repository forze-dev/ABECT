'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/client/i18n/navigation';
import './LanguageSwitcher.scss';

export default function LanguageSwitcher() {
	const [isOpen, setIsOpen] = useState(false);
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const languages = [
		{ code: 'ua', label: 'UA' },
		{ code: 'en', label: 'EN' }
	];

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleLanguageChange = (newLocale: string) => {
		setIsOpen(false);
		router.push(pathname, { locale: newLocale });
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div ref={dropdownRef} className="language-switcher">
			<button
				type="button"
				className={`language-switcher__button ${isOpen ? 'active' : ''}`}
				onClick={toggleDropdown}
				aria-label="Change language"
			>
				<span className="language-switcher__current">{locale.toUpperCase()}</span>
				<div className="language-switcher__icon">
					<div className="language-switcher__icon-element"></div>
					<div className="language-switcher__icon-element"></div>
				</div>
			</button>

			<div className={`language-switcher__dropdown ${isOpen ? 'active' : ''}`}>
				<ul className="language-switcher__list">
					{languages.map((lang) => (
						<li key={lang.code}>
							<button
								type="button"
								className={`language-switcher__option ${locale === lang.code ? 'active' : ''}`}
								onClick={() => handleLanguageChange(lang.code)}
							>
								{lang.label}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}