import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthenticationTemplate } from '../templates';
import { VerifyEmailInfo } from '../organisms';
import { Token } from '@shared/entities/index';

export const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  type VerifyEmailResponse = {
    success: boolean;
    errorCode?: string;
    message?: string;
  };

  const verifyEmailRequest = useCallback(
    async (data: { token: string }): Promise<VerifyEmailResponse> => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/public/verify-email?token=${data.token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        return (await response.json()) as VerifyEmailResponse;
      } catch (error) {
        console.error('Verify email request failed:', error);
        return {
          success: false,
          message: 'Failed to fetch',
        };
      }
    },
    [],
  );

  const processVerifyEmail = useCallback(
    async (token: string) => {
      setIsLoading(true);

      setSuccessMessage('');
      setErrorMessage('');

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

      const verifyEmailResponse = await verifyEmailRequest({
        token: validToken.getValue(),
      });
      if (
        !verifyEmailResponse.success &&
        verifyEmailResponse.message === 'Failed to fetch'
      ) {
        setIsLoading(false);
        setErrorMessage('externalService.serverError');
        return;
      }

      if (!verifyEmailResponse.success) {
        setIsLoading(false);
        setErrorMessage(
          verifyEmailResponse.errorCode || 'authentication.verifyEmail.failed',
        );
        return;
      }

      setIsLoading(false);
      setSuccessMessage('authentication.verifyEmail.success');
    },
    [verifyEmailRequest],
  );

  useEffect(() => {
    if (!token) return;
    processVerifyEmail(token);
  }, [token, processVerifyEmail]);

  return (
    <AuthenticationTemplate>
      <section
        id="authentication-form"
        className="authentication-template__section"
      >
        <VerifyEmailInfo
          isLoading={isLoading}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </section>
    </AuthenticationTemplate>
  );
};
