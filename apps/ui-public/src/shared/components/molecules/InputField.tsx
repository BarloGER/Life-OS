import React, { useState } from 'react';
import { Label, Input, ErrorText, Modal } from '../atoms';
import { AiOutlineInfoCircle } from 'react-icons/ai';
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
  infoModalContent?: React.ReactNode;
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
  infoModalContent,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen((prev) => !prev);

  return (
    <div className="input-field__container">
      <Label>
        <div
          className={`${error ? 'input-field__label-container--error' : 'input-field__label-container'}`}
        >
          {label}
          {infoModalContent && (
            <AiOutlineInfoCircle
              className="input-field__info-icon"
              onClick={toggleModal}
              title="More information"
            />
          )}
        </div>
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

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        content={infoModalContent}
      />
    </div>
  );
};
