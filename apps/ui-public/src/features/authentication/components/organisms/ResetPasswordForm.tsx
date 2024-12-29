import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import { SubmitButton, PasswordInputField } from '@shared/components/molecules';
import './assets/reset-password-form.css';

interface ResetPasswordFormProps {
  resetPasswordFormData: {
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processResetPassword: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
  passwordError: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  resetPasswordFormData,
  handleChange,
  processResetPassword,
  isLoading,
  successMessage,
  errorMessage,
  passwordError,
}) => {
  const { t } = useTranslation();

  return (
    <form className="reset-password__form" onSubmit={processResetPassword}>
      <h1>{t('authentication.resetPassword.title')}</h1>

      <PasswordInputField
        name="password"
        label={t('authentication.resetPassword.labels.password')}
        placeholder={t('authentication.resetPassword.placeholders.password')}
        value={resetPasswordFormData.password}
        onChange={handleChange}
        error={passwordError}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <Link className="login__link" to="/request-password-reset">
        {t('authentication.resetPassword.labels.requestPasswordResetLink')}
      </Link>

      <SubmitButton
        children={t('authentication.resetPassword.labels.submit')}
        isLoading={isLoading}
      />
    </form>
  );
};
