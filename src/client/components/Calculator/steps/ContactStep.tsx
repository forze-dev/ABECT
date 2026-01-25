'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { useCalculator } from '../CalculatorContext';
import { isValidContact } from '@/client/lib/leads';
import './Steps.scss';

export default function ContactStep(): JSX.Element {
  const t = useTranslations('Calculator.steps.contact');
  const tForm = useTranslations('ContactForm');
  const { state, setName, setContact, setMessage } = useCalculator();

  const nameError = state.name.length > 0 && state.name.length < 2;
  const contactError = state.contact.length > 0 && !isValidContact(state.contact);

  return (
    <div className="calculator-step">
      <div className="calculator-step__header">
        <h2 className="calculator-step__title">{t('title')}</h2>
        <p className="calculator-step__subtitle">{t('subtitle')}</p>
      </div>

      {/* Summary */}
      <div className="calculator-step__summary">
        <div className="calculator-step__summary-row">
          <span>Тип проекту:</span>
          <strong>
            {state.config?.projectTypes.find((p) => p.slug === state.projectType)?.name || '-'}
          </strong>
        </div>
        <div className="calculator-step__summary-row">
          <span>Платформа:</span>
          <strong>{state.platform === 'weblium' ? 'Weblium' : 'Custom'}</strong>
        </div>
        <div className="calculator-step__summary-row">
          <span>Сторінок:</span>
          <strong>{state.pagesCount}</strong>
        </div>
        {state.additionalServices.length > 0 && (
          <div className="calculator-step__summary-row">
            <span>Додатково:</span>
            <strong>
              {state.additionalServices
                .map(
                  (slug) =>
                    state.config?.additionalServices.find((s) => s.slug === slug)?.name || slug
                )
                .join(', ')}
            </strong>
          </div>
        )}
        <div className="calculator-step__summary-row">
          <span>Терміни:</span>
          <strong>
            {state.config?.urgencyOptions.find((u) => u.slug === state.urgency)?.name || '-'}
          </strong>
        </div>
        <div className="calculator-step__summary-row calculator-step__summary-row--total">
          <span>Орієнтовна вартість:</span>
          <strong>від {state.estimatedPrice.toLocaleString('uk-UA')} грн</strong>
        </div>
      </div>

      {/* Contact form */}
      <div className="calculator-step__form">
        <div className={`calculator-step__field ${nameError ? 'calculator-step__field--error' : ''}`}>
          <label htmlFor="calc-name">{tForm('nameLabel')}</label>
          <input
            type="text"
            id="calc-name"
            value={state.name}
            onChange={(e) => setName(e.target.value)}
            placeholder={tForm('namePlaceholder')}
            autoComplete="name"
          />
          {nameError && (
            <span className="calculator-step__field-error">{tForm('validation.nameRequired')}</span>
          )}
        </div>

        <div className={`calculator-step__field ${contactError ? 'calculator-step__field--error' : ''}`}>
          <label htmlFor="calc-contact">{tForm('contactLabel')}</label>
          <input
            type="text"
            id="calc-contact"
            value={state.contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={tForm('contactPlaceholder')}
            autoComplete="tel email"
          />
          {contactError && (
            <span className="calculator-step__field-error">{tForm('validation.contactInvalid')}</span>
          )}
        </div>

        <div className="calculator-step__field">
          <label htmlFor="calc-message">{tForm('messageLabel')}</label>
          <textarea
            id="calc-message"
            value={state.message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={tForm('messagePlaceholder')}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
