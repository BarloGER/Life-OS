import { useTranslation } from 'react-i18next';
import './assets/success-message.css';

type SuccessMessageProps = {
  message: string;
};

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  return <div className="success-message">{t(message)}</div>;
};
