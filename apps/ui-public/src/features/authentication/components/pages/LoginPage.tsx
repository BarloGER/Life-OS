import { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Email, Password, User } from '@shared/entities/index';

import { AuthContext } from '@shared/context/AuthContext';

import { AuthenticationTemplate } from '../templates';
import { LoginForm } from '../organisms/index';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  errorCode?: string;
  message?: string;
  user?: User;
}

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);

  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  async function loginUserRequest(data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/public/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include',
        }
      );
      return (await response.json()) as LoginResponse;
    } catch (error) {
      console.error('Login request failed:', error);
      return {
        success: false,
        message: 'Failed to fetch',
      };
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const processLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoginLoading(true);

    setErrorMessage('');
    setEmailError('');
    setPasswordError('');

    let validEmail: Email;
    let validPassword: Password;

    try {
      validEmail = new Email(loginFormData.email);
    } catch (err) {
      if (err instanceof Error) {
        setIsLoginLoading(false);
        setEmailError(t(`${err.message}`));
      }
      return;
    }

    try {
      validPassword = Password.createForLogin(loginFormData.password);
    } catch (err) {
      if (err instanceof Error) {
        setIsLoginLoading(false);
        setPasswordError(t(`${err.message}`));
      }
      return;
    }

    const loginResponse = await loginUserRequest({
      email: validEmail.getValue(),
      password: validPassword.getValue(),
    });
    console.log('Login response:', loginResponse);

    if (!loginResponse.success && loginResponse.message === 'Failed to fetch') {
      setIsLoginLoading(false);
      setErrorMessage('externalService.serverError');
      return;
    }

    if (!loginResponse.success) {
      setIsLoginLoading(false);
      setErrorMessage(loginResponse.errorCode || 'authentication.login.failed');
      return;
    }

    const userEntity = User.createFromResponse(loginResponse.user);

    setUser(userEntity);
    setIsAuthenticated(true);
    setIsLoginLoading(false);
    setSuccessMessage('authentication.login.success');
    navigate('/');
  };

  return (
    <AuthenticationTemplate>
      <section
        id="authentication-form"
        className="authentication-template__section"
      >
        <LoginForm
          loginFormData={loginFormData}
          handleChange={handleChange}
          processLogin={processLogin}
          isLoginLoading={isLoginLoading}
          successMessage={successMessage}
          errorMessage={errorMessage}
          emailError={emailError}
          passwordError={passwordError}
        />
      </section>
    </AuthenticationTemplate>
  );
};
