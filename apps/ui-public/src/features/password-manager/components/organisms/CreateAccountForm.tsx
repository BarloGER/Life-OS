// src/features/password-manager/organisms/CreateAccountForm.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import { MdOutlineClose } from 'react-icons/md';
import {
  SubmitButton,
  PasswordInputField,
  InputField,
} from '@shared/components/molecules';
import './assets/create-account-form.css';

interface CreateAccountFormProps {
  handleCreateAccountClick: () => void;
  accountFormData: {
    accountName: string;
    username: string;
    email: string;
    password: string;
    notes: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  processCreateAccount: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
  accountNameError: string;
  usernameError: string;
  emailError: string;
  passwordError: string;
  notesError: string;
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  handleCreateAccountClick,
  accountFormData,
  handleChange,
  processCreateAccount,
  isLoading,
  successMessage,
  errorMessage,
  accountNameError,
  usernameError,
  emailError,
  passwordError,
  notesError,
}) => {
  const { t } = useTranslation();

  return (
    <form className="create-account__form" onSubmit={processCreateAccount}>
      <div className="create-account__exit">
        <button
          type="button"
          className="exit__button"
          onClick={() => handleCreateAccountClick()}
        >
          <MdOutlineClose />
        </button>
      </div>

      <h1>{t('passwordManager.createAccount.title')}</h1>

      <InputField
        name="accountName"
        label={t('passwordManager.createAccount.labels.accountName')}
        placeholder={t(
          'passwordManager.createAccount.placeholders.accountName'
        )}
        value={accountFormData.accountName}
        onChange={handleChange}
        error={accountNameError}
        type="text"
      />

      <InputField
        name="username"
        label={t('passwordManager.createAccount.labels.username')}
        placeholder={t('passwordManager.createAccount.placeholders.username')}
        value={accountFormData.username}
        onChange={handleChange}
        error={usernameError}
        type="text"
      />

      <InputField
        name="email"
        label={t('passwordManager.createAccount.labels.email')}
        placeholder={t('passwordManager.createAccount.placeholders.email')}
        value={accountFormData.email}
        onChange={handleChange}
        error={emailError}
        type="text"
      />

      <PasswordInputField
        name="password"
        label={t('passwordManager.createAccount.labels.password')}
        placeholder={t('passwordManager.createAccount.placeholders.password')}
        value={accountFormData.password}
        onChange={handleChange}
        error={passwordError}
      />

      <InputField
        name="notes"
        label={t('passwordManager.createAccount.labels.notes')}
        placeholder={t('passwordManager.createAccount.placeholders.notes')}
        value={accountFormData.notes}
        onChange={handleChange}
        error={notesError}
        type="text"
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <SubmitButton
        children={t('passwordManager.createAccount.submit')}
        isLoading={isLoading}
      />
    </form>
  );
};
