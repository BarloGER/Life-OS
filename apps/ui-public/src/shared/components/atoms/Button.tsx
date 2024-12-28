import { useTranslation } from 'react-i18next';
import './assets/button.css';

export const Button = ({
  children,
  onClick,
  type = 'button',
  className = 'button',
  modifier = 'hover',
}) => {
  const { t } = useTranslation();

  const buttonClass = `button ${
    modifier ? `button--${modifier}` : ''
  } ${className}`;

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {t(children)}
    </button>
  );
};
