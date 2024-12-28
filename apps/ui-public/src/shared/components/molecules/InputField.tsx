import { Label, Input, ErrorText } from '../atoms';
import './assets/input-field.css';

type InputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  type?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  type = 'text',
}) => {
  return (
    <div className="input-field__container">
      <Label>
        {label}
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </Label>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};
