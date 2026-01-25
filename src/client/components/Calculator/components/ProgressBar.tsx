'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { useCalculator } from '../CalculatorContext';
import './ProgressBar.scss';

export default function ProgressBar(): JSX.Element {
  const t = useTranslations('Calculator');
  const { state } = useCalculator();

  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  return (
    <div className="calculator-progress">
      <div className="calculator-progress__info">
        <span className="calculator-progress__step">
          {t('step')} {state.currentStep + 1} {t('of')} {state.totalSteps}
        </span>
        <span className="calculator-progress__percent">{Math.round(progress)}%</span>
      </div>
      <div className="calculator-progress__bar">
        <div
          className="calculator-progress__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
