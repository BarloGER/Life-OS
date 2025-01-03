import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ErrorMessage, SuccessMessage } from '@shared/components/atoms';
import './assets/verify-email-info.css';

type VerifyEmailInfoProps = {
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
};

export const VerifyEmailInfo: React.FC<VerifyEmailInfoProps> = (props) => {
  const { errorMessage, successMessage, isLoading } = props;

  const { t } = useTranslation();

  return (
    <div className="verify-email-info">
      <h1>{t('authentication.verifyEmail.title')}</h1>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      {isLoading ? <h1>Bitte Warten</h1> : null}

      <p>{t('authentication.verifyEmail.text.resendVerificationInfoText')}</p>
      <Link className="verify-email-info__link" to="/resend-email-verification">
        {t('authentication.verifyEmail.labels.resendVerificationLink')}
      </Link>
    </div>
  );
};
