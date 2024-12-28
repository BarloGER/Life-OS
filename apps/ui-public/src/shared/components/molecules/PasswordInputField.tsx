import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { Label, Input, ErrorText } from '../atoms';
import './assets/password-input-field.css';

type PasswordInputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
};

/**
 * Ein spezialisiertes Input-Feld für Passwörter, das das Umschalten
 * zwischen "password"- und "text"-Anzeige ermöglicht.
 */
export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="input-field__container">
      <Label>
        {label}
        <div className="input-with-icon">
          <Input
            name={name}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
          />
          <button
            type="button"
            className="toggle-password-visibility"
            onClick={toggleVisibility}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </Label>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};
