import { useState, FormEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Email } from '@shared/entities/index';

import { AuthenticationTemplate } from '../templates';
import { RequestPasswordResetForm } from '../organisms';

interface RequestPasswordResetFormData {
  email: string;
}

interface RequestPasswordResetResponse {
  success: boolean;
  errorCode?: string;
  message?: string;
}

export const RequestPasswordResetPage = () => {
  const { t } = useTranslation();

  const [requestPasswordResetFormData, setRequestPasswordResetFormData] =
    useState<RequestPasswordResetFormData>({
      email: '',
    });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  async function requestPasswordResetUserRequest(data: {
    email: string;
  }): Promise<RequestPasswordResetResponse> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/public/request-password-reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      return (await response.json()) as RequestPasswordResetResponse;
    } catch (error) {
      console.error('RequestPasswordReset request failed:', error);
      return {
        success: false,
        message: 'Failed to fetch',
      };
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestPasswordResetFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const processRequestPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setErrorMessage('');
    setEmailError('');

    let validEmail: Email;

    try {
      validEmail = new Email(requestPasswordResetFormData.email);
    } catch (err) {
      if (err instanceof Error) {
        setIsLoading(false);
        setEmailError(t(`${err.message}`));
      }
      return;
    }

    const requestPasswordResetResponse = await requestPasswordResetUserRequest({
      email: validEmail.getValue(),
    });
    console.log('RequestPasswordReset response:', requestPasswordResetResponse);

    if (
      !requestPasswordResetResponse.success &&
      requestPasswordResetResponse.message === 'Failed to fetch'
    ) {
      setIsLoading(false);
      setErrorMessage('externalService.serverError');
      return;
    }

    if (!requestPasswordResetResponse.success) {
      setIsLoading(false);
      setErrorMessage(
        requestPasswordResetResponse.errorCode ||
          'authentication.requestPasswordReset.failed',
      );
      return;
    }

    setIsLoading(false);
    setSuccessMessage('authentication.requestPasswordReset.success');
  };

  return (
    <AuthenticationTemplate>
      <section
        id="request-password-reset-form"
        className="authentication-template__section"
      >
        <RequestPasswordResetForm
          requestPasswordResetFormData={requestPasswordResetFormData}
          handleChange={handleChange}
          processRequestPasswordReset={processRequestPasswordReset}
          isLoading={isLoading}
          successMessage={successMessage}
          errorMessage={errorMessage}
          emailError={emailError}
        />
      </section>
    </AuthenticationTemplate>
  );
};
