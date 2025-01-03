import { useTranslation } from 'react-i18next';
import { Heading1 } from '@shared/components/atoms';
import './assets/landing-page-hero.css';

export const LandingPageHero = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page-hero">
      <Heading1 text="landingPage.hero.title" />
      <p className="landing-page-hero__description">
        {t('landingPage.hero.description')}
      </p>
      <a href="#features" className="landing-page-hero__button">
        {t('landingPage.hero.button')}
      </a>
    </div>
  );
};
