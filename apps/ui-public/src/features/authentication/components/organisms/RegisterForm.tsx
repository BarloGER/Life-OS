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
    confirmPassword: string;
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
  confirmPasswordError: string;
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
  confirmPasswordError,
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
        infoModalContent={
          <div>
            <p>{t('authentication.register.modals.username.title')}</p>
            <br />
            <ol>
              <li>{t('authentication.register.modals.username.length')}</li>
              <li>
                {t('authentication.register.modals.username.illegalChars')}
              </li>
            </ol>
          </div>
        }
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
        label="Password"
        placeholder="Enter your password"
        value={registerFormData.password}
        onChange={handleChange}
        error={passwordError}
        showStrength
        infoModalContent={
          <div>
            <p>{t('authentication.register.modals.password.title')}</p>
            <br />
            <ol>
              <li>{t('authentication.register.modals.password.length')}</li>
              <li>{t('authentication.register.modals.password.letters')}</li>
              <li>{t('authentication.register.modals.password.number')}</li>
              <li>
                {t('authentication.register.modals.password.specialChar')}
              </li>
            </ol>
          </div>
        }
      />

      <PasswordInputField
        name="confirmPassword"
        label={t('authentication.register.labels.confirmPassword')}
        placeholder={t('authentication.register.placeholders.password')}
        value={registerFormData.confirmPassword}
        onChange={handleChange}
        error={confirmPasswordError}
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

      <Link className="register__link" to="/authentication/login">
        {t('authentication.register.labels.loginLink')}
      </Link>

      <SubmitButton
        children={t('authentication.register.labels.submit')}
        isLoading={isRegisterLoading}
      />
    </form>
  );
};
