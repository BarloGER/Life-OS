import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { AuthenticationTemplate } from '../templates';
import { ResetPasswordForm } from '../organisms';
import { Password, Token } from '@shared/entities/index';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

type ResetPasswordResponse = {
  success: boolean;
  errorCode?: string;
  message?: string;
};

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [resetPasswordFormData, setResetPasswordFormData] =
    useState<ResetPasswordFormData>({
      password: '',
      confirmPassword: '',
    });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) return;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetPasswordRequest = async (data: {
    token: string;
    newPassword: string;
  }): Promise<ResetPasswordResponse> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/authentication/public/reset-password?token=${data.token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      return (await response.json()) as ResetPasswordResponse;
    } catch (error) {
      console.error('Verify email request failed:', error);
      return {
        success: false,
        message: 'Failed to fetch',
      };
    }
  };

  const processResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setSuccessMessage('');
    setErrorMessage('');
    setPasswordError('');
    setConfirmPasswordError('');

    let validToken: Token;
    try {
      validToken = new Token(token);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
      setIsLoading(false);
      return;
    }

    let validPassword;
    try {
      validPassword = Password.createForRegistration(
        resetPasswordFormData.password
      );
    } catch (err) {
      if (err instanceof Error) {
        setIsLoading(false);
        setPasswordError(t(`${err.message}`));
      }
      return;
    }

    if (resetPasswordFormData.confirmPassword !== validPassword.getValue()) {
      setIsLoading(false);
      setPasswordError(t('authentication.resetPassword.errors.passwordMatch'));
      setConfirmPasswordError(
        t('authentication.resetPassword.errors.passwordMatch')
      );
      return;
    }

    const resetPasswordResponse = await resetPasswordRequest({
      token: validToken.getValue(),
      newPassword: validPassword.getValue(),
    });
    if (
      !resetPasswordResponse.success &&
      resetPasswordResponse.message === 'Failed to fetch'
    ) {
      setIsLoading(false);
      setErrorMessage('externalService.serverError');
      return;
    }

    if (!resetPasswordResponse.success) {
      setIsLoading(false);
      setErrorMessage(
        resetPasswordResponse.errorCode || 'authentication.resetPassword.failed'
      );
      return;
    }

    setIsLoading(false);
    setSuccessMessage('authentication.resetPassword.success');
  };

  return (
    <AuthenticationTemplate>
      <section
        id="reset-password-form"
        className="authentication-template__section"
      >
        <ResetPasswordForm
          resetPasswordFormData={resetPasswordFormData}
          handleChange={handleChange}
          processResetPassword={processResetPassword}
          isLoading={isLoading}
          errorMessage={errorMessage}
          passwordError={passwordError}
          confirmPasswordError={confirmPasswordError}
          successMessage={successMessage}
        />
      </section>
    </AuthenticationTemplate>
  );
};
