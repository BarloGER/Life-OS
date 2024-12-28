type ErrorTextProps = {
  children: React.ReactNode;
};

export const ErrorText: React.FC<ErrorTextProps> = ({ children }) => {
  return <div className="error-text">{children}</div>;
};
