import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import {
  SubmitButton,
  InputField,
  PasswordInputField,
  CheckboxField,
} from '@shared/components/molecules';
import './assets/register-form.css';

interface RegisterFormProps {
  registerFormData: {
    username: string;
    email: string;
    password: string;
    isNewsletterAccepted: boolean;
    isTermsAccepted: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processRegister: (e: React.FormEvent<HTMLFormElement>) => void;
  isRegisterLoading: boolean;
  successMessage: string;
  errorMessage: string;
  usernameError: string;
  emailError: string;
  passwordError: string;
  newsletterError: string;
  termsError: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  registerFormData,
  handleChange,
  processRegister,
  isRegisterLoading,
  successMessage,
  errorMessage,
  usernameError,
  emailError,
  passwordError,
  newsletterError,
  termsError,
}) => {
  const { t } = useTranslation();

  return (
    <form className="register__form" onSubmit={processRegister}>
      <h1>{t('authentication.register.title')}</h1>

      <InputField
        name="username"
        label={t('authentication.register.labels.username')}
        placeholder={t('authentication.register.placeholders.username')}
        value={registerFormData.username}
        onChange={handleChange}
        error={usernameError}
        type="text"
      />

      <InputField
        name="email"
        label={t('authentication.register.labels.email')}
        placeholder={t('authentication.register.placeholders.email')}
        value={registerFormData.email}
        onChange={handleChange}
        error={emailError}
        type="text"
      />

      <PasswordInputField
        name="password"
        label={t('authentication.register.labels.password')}
        placeholder={t('authentication.register.placeholders.password')}
        value={registerFormData.password}
        onChange={handleChange}
        error={passwordError}
      />

      <CheckboxField
        name="isNewsletterAccepted"
        label={t('authentication.register.labels.newsletter')}
        checked={registerFormData.isNewsletterAccepted}
        onChange={handleChange}
        error={newsletterError}
      />

      <CheckboxField
        name="isTermsAccepted"
        label={t('authentication.register.labels.terms')}
        checked={registerFormData.isTermsAccepted}
        onChange={handleChange}
        error={termsError}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <Link className="register__link" to="/login">
        {t('authentication.register.labels.loginLink')}
      </Link>

      <SubmitButton
        children={t('authentication.register.labels.submit')}
        isLoading={isRegisterLoading}
      />
    </form>
  );
};
