import './assets/success-message.css';

type SuccessMessageProps = {
  message: string;
};

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return <div className="success-message">{message}</div>;
};
