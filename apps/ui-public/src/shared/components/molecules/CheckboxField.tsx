import { Checkbox, Label, ErrorText } from '../atoms';
import './assets/checkbox-field.css';

type CheckboxFieldProps = {
  name: string; // <-- neu
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  checked,
  onChange,
  error,
}) => {
  return (
    <div className="checkbox-field__container">
      <Label className="checkbox-field__label">
        {/* Name mitgeben */}
        <Checkbox name={name} checked={checked} onChange={onChange} />
        {label}
      </Label>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};
