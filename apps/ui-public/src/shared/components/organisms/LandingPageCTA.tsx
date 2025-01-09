import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './assets/landing-page-cta.css';

export const LandingPageCTA: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page-cta">
      <h2 className="landing-page-cta__title">{t('landingPage.cta.title')}</h2>
      <p className="landing-page-cta__description">
        {t('landingPage.cta.description')}
      </p>
      <div
        style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: 'var(--color-warning)',
        }}
      >
        <h4>Test user for Recruiter and Devs to login</h4>
        <p>E-mail: test@test.com</p>
        <p>Password: 12345678!Ss</p>
      </div>

      <Link to="authentication/register" className="landing-page-cta__button">
        {t('landingPage.cta.button')}
      </Link>
    </div>
  );
};
