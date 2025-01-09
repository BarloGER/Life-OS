import { useState, FormEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Email, Password } from '@shared/entities/index';

import { AuthenticationTemplate } from '../templates';
import { ResendEmailVerificationForm } from '../organisms';

interface ResendEmailVerificationFormData {
  email: string;
  password: string;
}

interface ResendEmailVerificationResponse {
  success: boolean;
  errorCode?: string;
  message?: string;
}

export const ResendEmailVerificationPage = () => {
  const { t } = useTranslation();

  const [resendEmailVerificationFormData, setResendEmailVerificationFormData] =
    useState<ResendEmailVerificationFormData>({
      email: '',
      password: '',
    });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function resendEmailVerificationUserRequest(data: {
    email: string;
    password: string;
  }): Promise<ResendEmailVerificationResponse> {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/authentication/public/resend-email-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      return (await response.json()) as ResendEmailVerificationResponse;
    } catch (error) {
      console.error('ResendEmailVerification request failed:', error);
      return {
        success: false,
        message: 'Failed to fetch',
      };
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResendEmailVerificationFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const processResendEmailVerification = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    setSuccessMessage('');
    setErrorMessage('');
    setEmailError('');
    setPasswordError('');

    let validEmail: Email;
    let validPassword: Password;

    try {
      validEmail = new Email(resendEmailVerificationFormData.email);
    } catch (err) {
      if (err instanceof Error) {
        setIsLoading(false);
        setEmailError(t(`${err.message}`));
      }
      return;
    }

    try {
      validPassword = Password.createForLogin(
        resendEmailVerificationFormData.password
      );
    } catch (err) {
      if (err instanceof Error) {
        setIsLoading(false);
        setPasswordError(t(`${err.message}`));
      }
      return;
    }

    const resendEmailVerificationResponse =
      await resendEmailVerificationUserRequest({
        email: validEmail.getValue(),
        password: validPassword.getValue(),
      });
    console.log(
      'ResendEmailVerification response:',
      resendEmailVerificationResponse
    );

    if (
      !resendEmailVerificationResponse.success &&
      resendEmailVerificationResponse.message === 'Failed to fetch'
    ) {
      setIsLoading(false);
      setErrorMessage('externalService.serverError');
      return;
    }

    if (!resendEmailVerificationResponse.success) {
      setIsLoading(false);
      setErrorMessage(
        resendEmailVerificationResponse.errorCode ||
          'authentication.resendEmailVerification.failed'
      );
      return;
    }

    setIsLoading(false);
    setSuccessMessage('authentication.resendEmailVerification.success');
  };

  return (
    <AuthenticationTemplate>
      <section
        id="resend-email-verification-form"
        className="authentication-template__section"
      >
        <ResendEmailVerificationForm
          resendEmailVerificationFormData={resendEmailVerificationFormData}
          handleChange={handleChange}
          processResendEmailVerification={processResendEmailVerification}
          isLoading={isLoading}
          successMessage={successMessage}
          errorMessage={errorMessage}
          emailError={emailError}
          passwordError={passwordError}
        />
      </section>
    </AuthenticationTemplate>
  );
};
