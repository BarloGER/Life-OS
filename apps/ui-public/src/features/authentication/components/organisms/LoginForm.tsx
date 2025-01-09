import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import {
  SubmitButton,
  InputField,
  PasswordInputField,
} from '@shared/components/molecules';
import './assets/login-form.css';

interface LoginFormProps {
  loginFormData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoginLoading: boolean;
  successMessage: string;
  errorMessage: string;
  emailError: string;
  passwordError: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  loginFormData,
  handleChange,
  processLogin,
  isLoginLoading,
  successMessage,
  errorMessage,
  emailError,
  passwordError,
}) => {
  const { t } = useTranslation();

  return (
    <form className="login__form" onSubmit={processLogin}>
      <h1>{t('authentication.login.title')}</h1>

      <div style={{ marginBottom: '1rem', color: 'var(--color-warning)' }}>
        <h4>Test user for Recruiter and Devs</h4>
        <p>E-mail: test@test.com</p>
        <p>Password: 12345678!Ss</p>
      </div>

      <InputField
        name="email"
        label={t('authentication.login.labels.email')}
        placeholder={t('authentication.login.placeholders.email')}
        value={loginFormData.email}
        onChange={handleChange}
        error={emailError}
        type="text"
      />

      <PasswordInputField
        name="password"
        label={t('authentication.login.labels.password')}
        placeholder={t('authentication.login.placeholders.password')}
        value={loginFormData.password}
        onChange={handleChange}
        error={passwordError}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <Link className="login__link" to="/authentication/register">
        {t('authentication.login.labels.registerLink')}
      </Link>

      <Link className="login__link" to="/authentication/request-password-reset">
        {t('authentication.login.labels.requestPasswordResetLink')}
      </Link>

      <Link
        className="login__link"
        to="/authentication/resend-email-verification"
      >
        {t('authentication.login.labels.resendVerificationEmail')}
      </Link>

      <SubmitButton
        children={t('authentication.login.labels.submit')}
        isLoading={isLoginLoading}
      />
    </form>
  );
};
