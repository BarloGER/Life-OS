import { useTranslation } from 'react-i18next';
import { SuccessMessage, ErrorMessage } from '@shared/components/atoms';
import { SubmitButton, InputField } from '@shared/components/molecules';
import './assets/request-password-reset-form.css';

interface RequestPasswordResetFormProps {
  requestPasswordResetFormData: {
    email: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processRequestPasswordReset: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
  emailError: string;
}

export const RequestPasswordResetForm: React.FC<
  RequestPasswordResetFormProps
> = ({
  requestPasswordResetFormData,
  handleChange,
  processRequestPasswordReset,
  isLoading,
  successMessage,
  errorMessage,
  emailError,
}) => {
  const { t } = useTranslation();

  return (
    <form
      className="request-password-reset__form"
      onSubmit={processRequestPasswordReset}
    >
      <h1>{t('authentication.requestPasswordReset.title')}</h1>

      <InputField
        name="email"
        label={t('authentication.requestPasswordReset.labels.email')}
        placeholder={t(
          'authentication.requestPasswordReset.placeholders.email',
        )}
        value={requestPasswordResetFormData.email}
        onChange={handleChange}
        error={emailError}
        type="text"
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <SubmitButton
        children={t('authentication.requestPasswordReset.labels.submit')}
        isLoading={isLoading}
      />
    </form>
  );
};
