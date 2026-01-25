'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw, CheckCircle } from 'lucide-react';
import { useCalculator, CalculatorConfig } from './CalculatorContext';
import { submitLead } from '@/client/lib/leads';
import ProgressBar from './components/ProgressBar';
import PriceDisplay from './components/PriceDisplay';
import StepNavigation from './components/StepNavigation';
import ProjectTypeStep from './steps/ProjectTypeStep';
import PlatformStep from './steps/PlatformStep';
import PagesStep from './steps/PagesStep';
import AddonsStep from './steps/AddonsStep';
import UrgencyStep from './steps/UrgencyStep';
import ContactStep from './steps/ContactStep';
import './Calculator.scss';

interface CalculatorContentProps {
  config: CalculatorConfig;
}

function CalculatorContent({ config }: CalculatorContentProps): JSX.Element {
  const t = useTranslations('Calculator');
  const tForm = useTranslations('ContactForm');
  const { state, dispatch, reset } = useCalculator();

  // Submit handler
  const handleSubmit = async () => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    dispatch({ type: 'SET_SUBMIT_ERROR', payload: null });

    try {
      const result = await submitLead({
        type: 'calculator',
        name: state.name.trim(),
        contact: state.contact.trim(),
        message: state.message.trim() || undefined,
        calculatorData: {
          projectType: state.projectType || '',
          projectTypeName: config.projectTypes.find((p) => p.slug === state.projectType)?.name,
          platform: state.platform || 'custom',
          pagesCount: state.pagesCount,
          additionalServices: state.additionalServices,
          additionalServicesNames: state.additionalServices.map(
            (slug) => config.additionalServices.find((s) => s.slug === slug)?.name || slug
          ),
          urgency: state.urgency || '',
          urgencyName: config.urgencyOptions.find((u) => u.slug === state.urgency)?.name,
          estimatedPrice: state.estimatedPrice,
          estimatedTimeline: state.estimatedTimeline,
        },
      });

      if (result.success) {
        dispatch({ type: 'SET_SUBMIT_SUCCESS', payload: true });
      } else {
        dispatch({ type: 'SET_SUBMIT_ERROR', payload: result.error || tForm('errorMessage') });
      }
    } catch (error) {
      dispatch({ type: 'SET_SUBMIT_ERROR', payload: tForm('errorMessage') });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  // Render current step
  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <ProjectTypeStep />;
      case 1:
        return <PlatformStep />;
      case 2:
        return <PagesStep />;
      case 3:
        return <AddonsStep />;
      case 4:
        return <UrgencyStep />;
      case 5:
        return <ContactStep />;
      default:
        return null;
    }
  };

  // Success state
  if (state.submitSuccess) {
    return (
      <div className="calculator">
        <div className="calculator__container">
          <div className="calculator__success">
            <CheckCircle size={80} className="calculator__success-icon" />
            <h2>{tForm('successTitle')}</h2>
            <p>{tForm('successMessage')}</p>
            <div className="calculator__success-summary">
              <div className="calculator__success-price">
                <span>Орієнтовна вартість:</span>
                <strong>від {state.estimatedPrice.toLocaleString('uk-UA')} грн</strong>
              </div>
              {state.estimatedTimeline && (
                <div className="calculator__success-timeline">
                  <span>Орієнтовний термін:</span>
                  <strong>{state.estimatedTimeline}</strong>
                </div>
              )}
            </div>
            <button type="button" className="cta" onClick={reset}>
              <RotateCcw size={20} />
              {t('resetButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calculator">
      <div className="calculator__container">
        {/* Header */}
        <header className="calculator__header">
          <h1 className="calculator__title">{t('title')}</h1>
          <p className="calculator__subtitle">{t('subtitle')}</p>

          {/* Reset button */}
          {(state.projectType || state.currentStep > 0) && (
            <button
              type="button"
              className="calculator__reset"
              onClick={reset}
              aria-label={t('resetButton')}
            >
              <RotateCcw size={18} />
              <span>{t('resetButton')}</span>
            </button>
          )}
        </header>

        {/* Progress */}
        <ProgressBar />

        {/* Error message */}
        {state.submitError && (
          <div className="calculator__error">
            {state.submitError}
          </div>
        )}

        {/* Step content */}
        <div className="calculator__content">
          {renderStep()}
        </div>

        {/* Navigation */}
        <StepNavigation onSubmit={handleSubmit} />
      </div>

      {/* Price display */}
      <PriceDisplay />
    </div>
  );
}

export default function Calculator({ config }: { config: CalculatorConfig }): JSX.Element {
  return <CalculatorContent config={config} />;
}
