// src/features/password-manager/organisms/EditAccountForm.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineClose } from 'react-icons/md';
import {
  InputField,
  PasswordInputField,
  SubmitButton,
} from '@shared/components/molecules';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import './assets/edit-account-form.css';

interface EditAccountFormProps {
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
  processEditAccount: (e: React.FormEvent<HTMLFormElement>) => void;

  isLoading: boolean;
  successMessage: string;
  errorMessage: string;

  accountNameError: string;
  usernameError: string;
  emailError: string;
  passwordError: string;
  notesError: string;

  // Overlay controlling
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditAccountForm: React.FC<EditAccountFormProps> = ({
  accountFormData,
  handleChange,
  processEditAccount,
  isLoading,
  successMessage,
  errorMessage,
  accountNameError,
  usernameError,
  emailError,
  passwordError,
  notesError,
  showEditForm,
  setShowEditForm,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={processEditAccount} className="create-account__form">
      <div className="edit-account__exit">
        <button onClick={() => setShowEditForm(false)} className="exit__button">
          <MdOutlineClose />
        </button>
      </div>

      <h1>{t('passwordManager.editAccount.title')}</h1>

      <InputField
        name="accountName"
        label={t('passwordManager.editAccount.labels.accountName')}
        placeholder={t('passwordManager.editAccount.placeholders.accountName')}
        value={accountFormData.accountName}
        onChange={handleChange}
        error={accountNameError}
        type="text"
      />

      <InputField
        name="username"
        label={t('passwordManager.editAccount.labels.username')}
        placeholder={t('passwordManager.editAccount.placeholders.username')}
        value={accountFormData.username}
        onChange={handleChange}
        error={usernameError}
        type="text"
      />

      <InputField
        name="email"
        label={t('passwordManager.editAccount.labels.email')}
        placeholder={t('passwordManager.editAccount.placeholders.email')}
        value={accountFormData.email}
        onChange={handleChange}
        error={emailError}
        type="text"
      />

      <PasswordInputField
        name="password"
        label={t('passwordManager.editAccount.labels.password')}
        placeholder={t('passwordManager.editAccount.placeholders.password')}
        value={accountFormData.password}
        onChange={handleChange}
        error={passwordError}
      />

      <InputField
        name="notes"
        label={t('passwordManager.editAccount.labels.notes')}
        placeholder={t('passwordManager.editAccount.placeholders.notes')}
        value={accountFormData.notes}
        onChange={handleChange}
        error={notesError}
        type="text"
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <SubmitButton
        children={t('passwordManager.editAccount.submit')}
        isLoading={isLoading}
      />
    </form>
  );
};
