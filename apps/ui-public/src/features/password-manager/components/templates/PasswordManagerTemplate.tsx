import './assets/password-manager-template.css';

type PasswordManagerTemplateProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const PasswordManagerTemplate: React.FC<
  PasswordManagerTemplateProps
> = ({ header, children, footer }) => {
  return (
    <>
      {header && <header>{header}</header>}
      <main className="password-manager-template">{children}</main>
      {footer && <footer>{footer}</footer>}
    </>
  );
};
