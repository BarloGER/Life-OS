import { useTranslation } from 'react-i18next';
import './assets/error-message.css';

type ErrorMessageProps = {
  message: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  return <div className="error-message">{t(message)}</div>;
};
