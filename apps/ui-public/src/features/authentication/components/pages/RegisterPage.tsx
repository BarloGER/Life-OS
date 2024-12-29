import { useState, useEffect, useContext, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Username,
  Email,
  Password,
  Newsletter,
  Terms,
} from '@shared/entities/index';

import { AuthContext } from '@shared/context/AuthContext';

import { AuthenticationTemplate } from '../templates';
import { RegisterForm } from '../organisms/index';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  isNewsletterAccepted: boolean;
  isTermsAccepted: boolean;
}

interface RegisterResponse {
  success: boolean;
  errorCode?: string;
  message?: string;
}

export const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    isNewsletterAccepted: false,
    isTermsAccepted: false,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [termsError, setTermsError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  async function registerUserRequest(data: {
    username: string;
    email: string;
    password: string;
    isNewsletterAccepted: boolean;
    isTermsAccepted: boolean;
  }): Promise<RegisterResponse> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/public/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include',
        },
      );
      return (await response.json()) as RegisterResponse;
    } catch (error) {
      console.error('Register request failed:', error);
      return {
        success: false,
        message: 'Failed to fetch',
      };
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setRegisterFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setRegisterFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const processRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegisterLoading(true);

    setErrorMessage('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setNewsletterError('');
    setTermsError('');

    let validUsername: Username;
    let validEmail: Email;
    let validPassword: Password;
    let validNewsletter: Newsletter;
    let validTerms: Terms;

    try {
      validUsername = new Username(registerFormData.username);
    } catch (err) {
      if (err instanceof Error) {
        setIsRegisterLoading(false);
        setUsernameError(t(`${err.message}`));
      }
      return;
    }

    try {
      validEmail = new Email(registerFormData.email);
    } catch (err) {
      if (err instanceof Error) {
        setIsRegisterLoading(false);
        setEmailError(t(`${err.message}`));
      }
      return;
    }

    try {
      validPassword = Password.createForRegistration(registerFormData.password);
    } catch (err) {
      if (err instanceof Error) {
        setIsRegisterLoading(false);
        setPasswordError(t(`${err.message}`));
      }
      return;
    }

    try {
      validNewsletter = new Newsletter(registerFormData.isNewsletterAccepted);
    } catch (err) {
      if (err instanceof Error) {
        setIsRegisterLoading(false);
        setNewsletterError(t(`${err.message}`));
      }
      return;
    }

    try {
      validTerms = new Terms(registerFormData.isTermsAccepted);
    } catch (err) {
      if (err instanceof Error) {
        setIsRegisterLoading(false);
        setTermsError(t(`${err.message}`));
      }
      return;
    }

    const registerResponse = await registerUserRequest({
      username: validUsername.getValue(),
      email: validEmail.getValue(),
      password: validPassword.getValue(),
      isNewsletterAccepted: validNewsletter.getValue(),
      isTermsAccepted: validTerms.getValue(),
    });
    console.log('Register response:', registerResponse);

    if (
      !registerResponse.success &&
      registerResponse.message === 'Failed to fetch'
    ) {
      setIsRegisterLoading(false);
      setErrorMessage('externalService.serverError');
      return;
    }

    if (!registerResponse.success) {
      setIsRegisterLoading(false);
      setErrorMessage(
        registerResponse.errorCode || 'authentication.register.failed',
      );
      return;
    }

    setIsRegisterLoading(false);
    setSuccessMessage('authentication.register.success');
  };

  return (
    <AuthenticationTemplate>
      <section
        id="authentication-form"
        className="authentication-template__section"
      >
        <RegisterForm
          registerFormData={registerFormData}
          handleChange={handleChange}
          processRegister={processRegister}
          isRegisterLoading={isRegisterLoading}
          successMessage={successMessage}
          errorMessage={errorMessage}
          usernameError={usernameError}
          emailError={emailError}
          passwordError={passwordError}
          newsletterError={newsletterError}
          termsError={termsError}
        />
      </section>
    </AuthenticationTemplate>
  );
};
