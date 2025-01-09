import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './assets/success-message.css';

type SuccessMessageProps = {
  message: string;
  durationInSeconds?: number;
};

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
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

  return <div className="success-message">{t(message)}</div>;
};
