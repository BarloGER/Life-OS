import './assets/feature-overview-template.css';

type FeatureOverviewTemplateProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export const FeatureOverviewTemplate: React.FC<
  FeatureOverviewTemplateProps
> = ({ header, children, footer }) => {
  return (
    <>
      {header && <header>{header}</header>}
      <main className="feature-overview-template">{children}</main>
      {footer && <footer>{footer}</footer>}
    </>
  );
};
