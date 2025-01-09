// src/features/landing/organisms/LandingPageInstructions.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './assets/landing-page-instructions.css';

export const LandingPageInstructions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page-instructions">
      <h2 className="landing-page-instructions__title">
        {t('landingPage.instructions.title')}
      </h2>
      <ol className="landing-page-instructions__list">
        <li className="landing-page-instructions__item">
          <h3 className="landing-page-instructions__item-title">
            {t('landingPage.instructions.itemTitle1')}
          </h3>
          <p className="landing-page-instructions__item-description">
            {t('landingPage.instructions.itemDescription1')}
          </p>
        </li>
        <li className="landing-page-instructions__item">
          <h3 className="landing-page-instructions__item-title">
            {t('landingPage.instructions.itemTitle2')}
          </h3>
          <p className="landing-page-instructions__item-description">
            {t('landingPage.instructions.itemDescription2')}
          </p>
        </li>
        <li className="landing-page-instructions__item">
          <h3 className="landing-page-instructions__item-title">
            {t('landingPage.instructions.itemTitle3')}
          </h3>
          <p className="landing-page-instructions__item-description">
            {t('landingPage.instructions.itemDescription3')}
          </p>
        </li>
      </ol>
    </div>
  );
};
