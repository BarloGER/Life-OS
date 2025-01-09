import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import { SubmitButton, PasswordInputField } from '@shared/components/molecules';
import './assets/create-vault-form.css';

interface CreateVaultFormProps {
  createVaultFormData: {
    masterPassword: string;
    securityQuestion: string;
    securityAnswer: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  processCreateVault: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
  masterPasswordError: string;
  securityQuestionError: string;
  securityAnswerError: string;
}

export const CreateVaultForm: React.FC<CreateVaultFormProps> = ({
  createVaultFormData,
  handleChange,
  processCreateVault,
  isLoading,
  successMessage,
  errorMessage,
  masterPasswordError,
  securityQuestionError,
  securityAnswerError,
}) => {
  const { t } = useTranslation();

  return (
    <form className="create-vault__form" onSubmit={processCreateVault}>
      <h1>{t('passwordManager.createVault.title')}</h1>

      <PasswordInputField
        name="masterPassword"
        label={t('passwordManager.createVault.labels.masterPassword')}
        placeholder={t(
          'passwordManager.createVault.placeholders.masterPassword'
        )}
        value={createVaultFormData.masterPassword}
        onChange={handleChange}
        error={masterPasswordError}
      />

      <label htmlFor="securityQuestion">
        {t('passwordManager.createVault.labels.securityQuestion')}
      </label>
      <select
        name="securityQuestion"
        id="securityQuestion"
        value={createVaultFormData.securityQuestion}
        onChange={handleChange}
        className="create-vault__select"
      >
        <option value="">
          {t('passwordManager.createVault.selectQuestion')}
        </option>
        <option value="petName">Name of your first pet?</option>
        <option value="favoriteTeacher">Your favorite teacher's name?</option>
      </select>
      {securityQuestionError && (
        <ErrorMessage message={securityQuestionError} />
      )}

      <label htmlFor="securityAnswer">
        {t('passwordManager.createVault.labels.securityAnswer')}
      </label>
      <input
        type="text"
        name="securityAnswer"
        id="securityAnswer"
        value={createVaultFormData.securityAnswer}
        onChange={handleChange}
        className="create-vault__input"
      />
      {securityAnswerError && <ErrorMessage message={securityAnswerError} />}

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <SubmitButton
        children={t('passwordManager.createVault.labels.submit')}
        isLoading={isLoading}
      />

      <Link className="create-vault__link" to="/features">
        {t('passwordManager.createVault.links.featuresLink')}
      </Link>
    </form>
  );
};
