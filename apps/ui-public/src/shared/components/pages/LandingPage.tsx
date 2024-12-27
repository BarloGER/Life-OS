import { useTranslation } from 'react-i18next';

export const LandingPage = () => {
  const { t } = useTranslation();
  return <h1>{t('landingPage.title')}</h1>;
};
