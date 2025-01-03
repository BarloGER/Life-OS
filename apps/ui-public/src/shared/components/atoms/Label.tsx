type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = ({ children, ...rest }) => {
  return <label {...rest}>{children}</label>;
};
