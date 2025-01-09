import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './assets/error-message.css';

type ErrorMessageProps = {
  message: string;
  durationInSeconds?: number;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  durationInSeconds,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (durationInSeconds) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, durationInSeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [durationInSeconds]);

  if (!visible) return null;

  return <div className="error-message">{t(message)}</div>;
};
