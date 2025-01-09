import { useTranslation } from 'react-i18next';

export const UserProfile = () => {
  const { t } = useTranslation();
  return (
    <h1
      style={{
        paddingTop: '50px',
        height: '100svh',
        width: '100%',
        textAlign: 'center',
        alignContent: 'center',
      }}
    >
      {t('shared.components.pages.userProfile.title')}
    </h1>
  );
};
