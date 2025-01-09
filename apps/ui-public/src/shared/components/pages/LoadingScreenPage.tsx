import { useTranslation } from 'react-i18next';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const LoadingScreenPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        fontFamily: 'Space Mono, monospace',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--font-xl)',
          marginBottom: '3rem',
        }}
      >
        {t('shared.components.pages.loadingScreenPage.title')}
      </h1>
      <AiOutlineLoading3Quarters
        style={{
          fontSize: '6rem',
          animation: 'spin 1s linear infinite',
          color: 'var(--color-button)',
        }}
      />
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};
