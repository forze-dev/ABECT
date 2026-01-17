'use client';

import { JSX, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import RichText from '@/client/components/RichText/RichText';
import './FAQSection.scss';

interface FAQItem {
	question?: string | null;
	answer?: any;
}

interface FAQSectionProps {
	faq: FAQItem[];
}

export default function FAQSection({ faq }: FAQSectionProps): JSX.Element {
	const t = useTranslations('ServiceDetail.faq');
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="faq-section">
			<div className="container">
				<header className="faq-section__header">
					<h2 className="faq-section__title">{t('title')}</h2>
					<p className="faq-section__subtitle">{t('subtitle')}</p>
				</header>

				<div className="faq-section__list">
					{faq.map((item, index) => (
						<div
							key={index}
							className={`faq-section__item ${openIndex === index ? 'faq-section__item--open' : ''}`}
						>
							<button
								type="button"
								className="faq-section__question"
								onClick={() => toggleFAQ(index)}
								aria-expanded={openIndex === index}
							>
								<span>{item.question}</span>
								<ChevronDown size={20} className="faq-section__icon" />
							</button>

							{openIndex === index && (
								<div className="faq-section__answer">
									{item.answer && <RichText data={item.answer} />}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
