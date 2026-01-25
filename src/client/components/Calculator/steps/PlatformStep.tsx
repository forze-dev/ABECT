'use client';

import { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { Blocks, Code } from 'lucide-react';
import { useCalculator } from '../CalculatorContext';
import OptionCard from '../components/OptionCard';
import './Steps.scss';

export default function PlatformStep(): JSX.Element {
  const t = useTranslations('Calculator.steps.platform');
  const { state, setPlatform, nextStep, getSelectedProjectType } = useCalculator();

  const selectedProject = getSelectedProjectType();
  const hasWebliumOption = selectedProject?.hasWebliumOption ?? false;

  const handleSelect = (platform: 'weblium' | 'custom') => {
    setPlatform(platform);
    setTimeout(() => nextStep(), 300);
  };

  // If no Weblium option, auto-select custom and skip
  if (!hasWebliumOption) {
    if (state.platform !== 'custom') {
      setPlatform('custom');
    }
    return (
      <div className="calculator-step">
        <div className="calculator-step__header">
          <h2 className="calculator-step__title">{t('title')}</h2>
          <p className="calculator-step__subtitle">
            Для цього типу проекту доступна тільки Custom розробка
          </p>
        </div>

        <div className="calculator-step__options calculator-step__options--two">
          <OptionCard
            title={t('custom.title')}
            description={t('custom.description')}
            icon={<Code />}
            selected={true}
            variant="large"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-step">
      <div className="calculator-step__header">
        <h2 className="calculator-step__title">{t('title')}</h2>
        <p className="calculator-step__subtitle">{t('subtitle')}</p>
      </div>

      <div className="calculator-step__options calculator-step__options--two">
        <OptionCard
          title={t('weblium.title')}
          description={t('weblium.description')}
          icon={<Blocks />}
          selected={state.platform === 'weblium'}
          onClick={() => handleSelect('weblium')}
          variant="large"
          price={selectedProject?.webliumBasePrice
            ? `від ${selectedProject.webliumBasePrice.toLocaleString('uk-UA')} грн`
            : undefined
          }
        />
        <OptionCard
          title={t('custom.title')}
          description={t('custom.description')}
          icon={<Code />}
          selected={state.platform === 'custom'}
          onClick={() => handleSelect('custom')}
          variant="large"
          price={selectedProject?.customBasePrice
            ? `від ${selectedProject.customBasePrice.toLocaleString('uk-UA')} грн`
            : undefined
          }
        />
      </div>
    </div>
  );
}
