import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import { SubmitButton, PasswordInputField } from '@shared/components/molecules';
import './assets/unlock-vault-form.css';

interface UnlockVaultFormProps {
  unlockVaultFormData: {
    masterPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processUnlockVault: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
  masterPasswordError: string;
}

export const UnlockVaultForm: React.FC<UnlockVaultFormProps> = ({
  unlockVaultFormData,
  handleChange,
  processUnlockVault,
  isLoading,
  successMessage,
  errorMessage,
  masterPasswordError,
}) => {
  const { t } = useTranslation();

  return (
    <form className="unlock-vault__form" onSubmit={processUnlockVault}>
      <h1>{t('passwordManager.unlockVault.title')}</h1>

      <div
        style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: 'var(--color-warning)',
        }}
      >
        <h4>Test user for Recruiter and Devs to unlock</h4>
        <p>Master-Password: 12345678qweQWE!!!</p>
      </div>

      <PasswordInputField
        name="masterPassword"
        label={t('passwordManager.unlockVault.labels.masterPassword')}
        placeholder={t(
          'passwordManager.unlockVault.placeholders.masterPassword'
        )}
        value={unlockVaultFormData.masterPassword}
        onChange={handleChange}
        error={masterPasswordError}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <SubmitButton
        children={t('passwordManager.unlockVault.labels.submit')}
        isLoading={isLoading}
      />

      <Link className="unlock-vault__link" to="/features">
        {t('passwordManager.unlockVault.links.featuresLink')}
      </Link>
    </form>
  );
};
