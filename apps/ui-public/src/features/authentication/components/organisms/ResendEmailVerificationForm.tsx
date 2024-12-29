import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import {
  SubmitButton,
  InputField,
  PasswordInputField,
} from '@shared/components/molecules';
import './assets/resend-email-verification-form.css';

interface ResendEmailVerificationFormProps {
  resendEmailVerificationFormData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processResendEmailVerification: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
  emailError: string;
  passwordError: string;
}

export const ResendEmailVerificationForm: React.FC<
  ResendEmailVerificationFormProps
> = ({
  resendEmailVerificationFormData,
  handleChange,
  processResendEmailVerification,
  isLoading,
  successMessage,
  errorMessage,
  emailError,
  passwordError,
}) => {
  const { t } = useTranslation();

  return (
    <form
      className="resend-email-verification__form"
      onSubmit={processResendEmailVerification}
    >
      <h1>{t('authentication.resendEmailVerification.title')}</h1>

      <InputField
        name="email"
        label={t('authentication.resendEmailVerification.labels.email')}
        placeholder={t(
          'authentication.resendEmailVerification.placeholders.email',
        )}
        value={resendEmailVerificationFormData.email}
        onChange={handleChange}
        error={emailError}
        type="text"
      />

      <PasswordInputField
        name="password"
        label={t('authentication.resendEmailVerification.labels.password')}
        placeholder={t(
          'authentication.resendEmailVerification.placeholders.password',
        )}
        value={resendEmailVerificationFormData.password}
        onChange={handleChange}
        error={passwordError}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <SubmitButton
        children={t('authentication.resendEmailVerification.labels.submit')}
        isLoading={isLoading}
      />
    </form>
  );
};
