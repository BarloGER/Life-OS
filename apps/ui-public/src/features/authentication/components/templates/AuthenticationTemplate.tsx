import './assets/authentication-template.css';

type AuthenticationTemplateProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const AuthenticationTemplate: React.FC<AuthenticationTemplateProps> = ({
  header,
  children,
  footer,
}) => {
  return (
    <>
      {header && <header>{header}</header>}
      <main className="authentication-template">{children}</main>
      {footer && <footer>{footer}</footer>}
    </>
  );
};
