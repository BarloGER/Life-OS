import React from 'react';
import { useTranslation } from 'react-i18next';
import './assets/landing-page-hero.css';

export const LandingPageHero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page-hero">
      <h1 className="landing-page-hero__title">
        {t('landingPage.hero.title')}
      </h1>
      <p className="landing-page-hero__description">
        {t('landingPage.hero.description')}
      </p>

      <div
        style={{
          textAlign: 'left',
          marginTop: '2rem',
          color: 'var(--color-warning)',
        }}
      >
        <h3>Early Test Version</h3>
        <h4>Test user for Recruiter and Devs to login</h4>
        <p>E-mail: test@test.com</p>
        <p>Password: 12345678!Ss</p>
      </div>

      <a href="#features" className="landing-page-hero__button">
        {t('landingPage.hero.button')}
      </a>
    </div>
  );
};
