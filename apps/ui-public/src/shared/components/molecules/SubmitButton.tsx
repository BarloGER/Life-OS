import { FaSpinner } from 'react-icons/fa';
import './assets/submit-button.css';

type SubmitButtonProps = {
  children: string;
  isLoading: boolean;
  className?: string;
  modifier?: string;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading,
  className = 'submit-button',
  modifier = 'hover',
}) => {
  const buttonClass = `submit-button ${
    modifier ? `submit-button--${modifier}` : ''
  } ${className}`;

  const renderContent = () => {
    if (isLoading) {
      return <FaSpinner className="spinner" />;
    }

    return children;
  };

  return (
    <button type="submit" className={buttonClass} disabled={isLoading}>
      {renderContent()}
    </button>
  );
};
