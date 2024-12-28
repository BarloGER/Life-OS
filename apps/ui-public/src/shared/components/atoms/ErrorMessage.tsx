import './assets/error-message.css';

type ErrorMessageProps = {
  message: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div className="error-message">{message}</div>;
};
