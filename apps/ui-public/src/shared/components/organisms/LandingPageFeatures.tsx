import { useTranslation } from 'react-i18next';
import './assets/landing-page-features.css';

export const LandingPageFeatures = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page-features">
      <h2 className="landing-page-features__title">
        {t('landingPage.features.title')}
      </h2>
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
      </ul>
    </div>
  );
};
