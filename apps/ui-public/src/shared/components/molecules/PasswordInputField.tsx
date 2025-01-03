import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import { Label, Input, ErrorText } from '../atoms';
import { Modal } from '../atoms/Modal';
import { Password } from '@shared/entities/index';
import './assets/password-input-field.css';

type PasswordInputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  showStrength?: boolean;
  infoModalContent?: React.ReactNode;
};

export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  showStrength = false,
  infoModalContent,
}) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (showStrength) {
      setPasswordStrength(Password.evaluateStrength(e.target.value));
    }
  };

  const toggleModal = () => setModalOpen((prev) => !prev);

  return (
    <div className="password-input-field__container">
      <Label>
        <div className="password-input-field__label-container">
          {label}
          {infoModalContent && (
            <AiOutlineInfoCircle
              className="password-input-field__info-icon"
              onClick={toggleModal}
              title={t('shared.components.molecules.inputField.moreInfo')}
            />
          )}
        </div>
        <div className="password-input-field__with-icon">
          <Input
            name={name}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={handlePasswordChange}
            required={required}
          />
          <button
            type="button"
            className="password-input-field__toggle-visibility"
            onClick={toggleVisibility}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </Label>
      {showStrength && value && (
        <div
          className={`password-input-field__password-strength ${passwordStrength.toLowerCase()}`}
        >
          <span>
            {t(
              'shared.components.molecules.passwordInputField.passwordStrength',
            )}{' '}
            {t(
              `shared.components.molecules.passwordInputField.${passwordStrength.toLowerCase()}`,
            )}
          </span>
        </div>
      )}
      {error && <ErrorText>{error}</ErrorText>}

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        content={infoModalContent}
      />
    </div>
  );
};
