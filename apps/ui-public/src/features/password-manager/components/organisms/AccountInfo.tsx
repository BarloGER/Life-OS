import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEmail, MdEdit, MdDeleteForever } from 'react-icons/md';
import { IoKeySharp } from 'react-icons/io5';
import {
  FaClipboardUser,
  FaEye,
  FaEyeSlash,
  FaNoteSticky,
} from 'react-icons/fa6';
import { SiStackblitz } from 'react-icons/si';
import './assets/account-info.css';
import { SuccessMessage } from '@shared/components/atoms';

interface AccountInfoProps {
  currentAccount: {
    accountName: string;
    username: string | '';
    email: string | '';
    decryptedPassword: string;
    decryptedNotes: string | '';
    updatedAt: string;
    createdAt: string;
  };
  onEditClick: () => void;
  deleteAccount: () => void;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  currentAccount,
  onEditClick,
  deleteAccount,
}) => {
  const { t } = useTranslation();

  // State zum Umschalten der Passwort-Anzeige
  const [showPassword, setShowPassword] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  async function copyToClipboard(text: string) {
    setCopyMessage('');
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(t('passwordManager.accountInfo.copiedToClipboard'));
    } catch (err) {
      console.error('Clipboard error:', err);
      setCopyMessage(t('passwordManager.accountInfo.errors.copiedToClipboard'));
    }
  }

  const passwordCopyText = currentAccount
    ? currentAccount.decryptedPassword
    : '';
  const notesCopyText = currentAccount ? currentAccount.decryptedNotes : '';

  if (!currentAccount) {
    return <span>{t('passwordManager.accountInfo.noAccountSelected')}</span>;
  }

  return (
    <div className="account-info">
      <h2>{currentAccount.accountName}</h2>

      {/* Edit-Button */}
      <div className="account-info__buttons">
        <button className="account-info__edit" onClick={onEditClick}>
          <MdEdit />
          <span>{t('passwordManager.accountInfo.edit')}</span>
        </button>
        <button className="account-info__delete" onClick={deleteAccount}>
          <MdDeleteForever />
        </button>
      </div>

      <div className="account-info__data-container">
        {/* USERNAME */}
        <div
          className="account-info__data-container__item"
          onClick={() => copyToClipboard(currentAccount.username || '')}
        >
          <FaClipboardUser className="account-info__data-container__icon" />
          <div className="account-info__data-container__text-container">
            <div className="account-info__data-container__text-info">
              {t('passwordManager.accountInfo.username')}
            </div>
            <div className="account-info__data-container__text">
              {currentAccount.username ||
                t('passwordManager.accountInfo.empty')}
            </div>
          </div>
        </div>

        {/* EMAIL */}
        <div
          className="account-info__data-container__item"
          onClick={() => copyToClipboard(currentAccount.email || '')}
        >
          <MdEmail className="account-info__data-container__icon" />
          <div className="account-info__data-container__text-container">
            <div className="account-info__data-container__text-info">
              {t('passwordManager.accountInfo.email')}
            </div>
            <div className="account-info__data-container__text">
              {currentAccount.email || t('passwordManager.accountInfo.empty')}
            </div>
          </div>
        </div>

        {/* PASSWORD */}
        <div
          className="account-info__data-container__item"
          onClick={() => copyToClipboard(passwordCopyText)}
        >
          <IoKeySharp className="account-info__data-container__icon" />
          <div className="account-info__data-container__text-container">
            <div className="account-info__data-container__text-info">
              {t('passwordManager.accountInfo.password')}
            </div>

            <div className="account-info__data-container__text">
              {currentAccount.decryptedPassword
                ? showPassword
                  ? currentAccount.decryptedPassword
                  : '********'
                : ''}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* NOTES */}
        <div
          className="account-info__data-container__item"
          onClick={() => copyToClipboard(notesCopyText || '')}
        >
          <FaNoteSticky className="account-info__data-container__icon" />
          <div className="account-info__data-container__text-container">
            <div className="account-info__data-container__text-info">
              {t('passwordManager.accountInfo.notes')}
            </div>
            <div className="account-info__data-container__text">
              {currentAccount.decryptedNotes ||
                t('passwordManager.accountInfo.empty')}
            </div>
          </div>
        </div>
      </div>

      {copyMessage && (
        <SuccessMessage message={copyMessage} durationInSeconds={300} />
      )}

      {/* METADATA: updatedAt, createdAt */}
      <div className="account-info__info-container">
        <div className="account-info__info-container__item">
          <MdEdit className="account-info__info-container__icon" />
          <div className="account-info__info-container__text-container">
            <div className="account-info__info-container__text-info">
              {t('passwordManager.accountInfo.updatedAt')}
            </div>
            <div className="account-info__info-container__text">
              {currentAccount.updatedAt}
            </div>
          </div>
        </div>
        <div className="account-info__info-container__item">
          <SiStackblitz className="account-info__info-container__icon" />
          <div className="account-info__info-container__text-container">
            <div className="account-info__info-container__text-info">
              {t('passwordManager.accountInfo.createdAt')}
            </div>
            <div className="account-info__info-container__text">
              {currentAccount.createdAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
