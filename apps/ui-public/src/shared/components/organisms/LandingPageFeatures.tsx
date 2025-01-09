import React from 'react';
import { useTranslation } from 'react-i18next';
import './assets/landing-page-features.css';

export const LandingPageFeatures: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page-features">
      <h2 className="landing-page-features__title">
        {t('landingPage.features.title')}
      </h2>
      <p className="landing-page-features__subtitle">
        {t('landingPage.features.subtitle')}
      </p>
      <ul className="landing-page-features__list">
        <li className="landing-page-features__item">
          <h3 className="landing-page-features__item-title">
            {t('landingPage.features.itemTitle1')}
          </h3>
          <p className="landing-page-features__item-description">
            {t('landingPage.features.itemDescription1')}
          </p>
        </li>
        <li className="landing-page-features__item">
          <h3 className="landing-page-features__item-title">
            {t('landingPage.features.itemTitle2')}
          </h3>
          <p className="landing-page-features__item-description">
            {t('landingPage.features.itemDescription2')}
          </p>
        </li>
        <li className="landing-page-features__item">
          <h3 className="landing-page-features__item-title">
            {t('landingPage.features.itemTitle3')}
          </h3>
          <p className="landing-page-features__item-description">
            {t('landingPage.features.itemDescription3')}
          </p>
        </li>
        <li className="landing-page-features__item">
          <h3 className="landing-page-features__item-title">
            {t('landingPage.features.itemTitle4')}
          </h3>
          <p className="landing-page-features__item-description">
            {t('landingPage.features.itemDescription4')}
          </p>
        </li>
        <li className="landing-page-features__item">
          <h3 className="landing-page-features__item-title">
            {t('landingPage.features.itemTitle5')}
          </h3>
          <p className="landing-page-features__item-description">
            {t('landingPage.features.itemDescription5')}
          </p>
        </li>
      </ul>
    </div>
  );
};
