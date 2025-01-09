// src/features/password-manager/pages/VaultPage.tsx
import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PasswordManagerContext } from '@features/password-manager/context/index';
import { PasswordManagerTemplate } from '../templates/PasswordManagerTemplate';
import { CreateVaultForm } from '../organisms/CreateVaultForm';
import { UnlockVaultForm } from '../organisms/UnlockVaultForm';
import { CryptoService } from '@features/password-manager/services/index';
import { createVaultRequest } from '@features/password-manager/repositories/PasswordManagerRepository';
import { Vault } from '@features/password-manager/entities/index';
import { LoadingScreenPage } from '@shared/components/pages';

interface UnlockVaultFormData {
  masterPassword: string;
}

interface CreateVaultFormData {
  masterPassword: string;
  securityQuestion: string;
  securityAnswer: string;
}

export const VaultPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cryptoService = new CryptoService();

  const {
    masterPassword,
    setMasterPassword,
    isVaultUnlocked,
    setIsVaultUnlocked,
    hasVault,
    setHasVault,
    vaultData,
    setVaultData,
    isVaultLoading,
  } = useContext(PasswordManagerContext);

  const [createVaultFormData, setCreateVaultFormData] =
    useState<CreateVaultFormData>({
      masterPassword: '',
      securityQuestion: '',
      securityAnswer: '',
    });
  const [isLoadingCreateVault, setIsLoadingCreateVault] = useState(false);
  const [createVaultErrorMessage, setCreateVaultErrorMessage] = useState('');
  const [createVaultSuccessMessage, setCreateVaultSuccessMessage] =
    useState('');

  const [unlockVaultFormData, setUnlockVaultFormData] =
    useState<UnlockVaultFormData>({
      masterPassword: '',
    });
  const [isLoadingUnlockVault, setIsLoadingUnlockVault] = useState(false);
  const [unlockVaultErrorMessage, setUnlockVaultErrorMessage] = useState('');
  const [unlockVaultSuccessMessage, setUnlockVaultSuccessMessage] =
    useState('');

  // Wenn Tresor schon entsperrt => wir gehen zur overview
  useEffect(() => {
    if (isVaultUnlocked) {
      navigate('/password-manager/vault/overview');
    }
  }, [isVaultUnlocked, navigate]);

  /** =========== CREATE VAULT =========== */
  const handleCreateVaultChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCreateVaultFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processCreateVault = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingCreateVault(true);
    setCreateVaultErrorMessage('');
    setCreateVaultSuccessMessage('');

    try {
      const secret = createVaultFormData.securityAnswer.trim();
      const encrypted = await cryptoService.encrypt(
        createVaultFormData.masterPassword,
        secret
      );

      const response = await createVaultRequest({
        secret,
        encryptedSecret: encrypted.encryptedData,
        secretEncryptionIv: encrypted.iv,
        secretEncryptionSalt: encrypted.salt,
        securityQuestion: createVaultFormData.securityQuestion,
      });

      if (!response.success) {
        if (response.message === 'Failed to fetch') {
          setCreateVaultErrorMessage('externalService.serverError');
          return;
        }
        setCreateVaultErrorMessage(
          response.errorCode || 'passwordManager.createVault.failed'
        );
        return;
      }

      const vaultEntity = Vault.createFromResponse(response.vault);
      setVaultData(vaultEntity);
      setHasVault(true);

      setMasterPassword(createVaultFormData.masterPassword);
      setCreateVaultSuccessMessage(t('passwordManager.createVault.success'));
      setIsVaultUnlocked(true);
      // => navigiere zur overview
      navigate('/password-manager/vault/overview');
    } catch (err: any) {
      console.error(err);
      setCreateVaultErrorMessage(`Error creating vault: ${err.message}`);
    } finally {
      setIsLoadingCreateVault(false);
    }
  };

  /** =========== UNLOCK VAULT =========== */
  const handleUnlockVaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnlockVaultFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processUnlockVault = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUnlockVaultErrorMessage('');
    setUnlockVaultSuccessMessage('');

    if (!vaultData) {
      setUnlockVaultErrorMessage('No vault data found from server.');
      return;
    }

    setIsLoadingUnlockVault(true);
    try {
      const { masterPassword } = unlockVaultFormData;
      const {
        encryptedSecret,
        secretEncryptionIv,
        secretEncryptionSalt,
        secret,
      } = vaultData;

      const dec = await cryptoService.decrypt(
        masterPassword,
        encryptedSecret,
        secretEncryptionIv,
        secretEncryptionSalt
      );

      if (dec.success && dec.data === secret) {
        setMasterPassword(masterPassword);
        setIsVaultUnlocked(true);
        setUnlockVaultSuccessMessage('passwordManager.unlockVault.success');
        navigate('/password-manager/vault/overview');
      } else {
        setUnlockVaultErrorMessage(
          t('passwordManager.unlockVault.errors.unlockVaultFailed')
        );
      }
    } catch (err) {
      console.error(err);
      setUnlockVaultErrorMessage('Failed to unlock vault.');
    } finally {
      setIsLoadingUnlockVault(false);
    }
  };

  // RENDER LOGIK
  // => 1) isVaultLoading => optional
  // => 2) If hasVault===false => show CreateVaultForm
  // => 3) If hasVault===true => show UnlockVaultForm

  // if (isVaultLoading) {
  //   return <LoadingScreenPage />;
  // }

  if (!hasVault) {
    // => CreateVault
    return (
      <PasswordManagerTemplate>
        <section className="password-manager-template__section">
          <CreateVaultForm
            createVaultFormData={createVaultFormData}
            handleChange={handleCreateVaultChange}
            processCreateVault={processCreateVault}
            isLoading={isLoadingCreateVault}
            successMessage={createVaultSuccessMessage}
            errorMessage={createVaultErrorMessage}
            masterPasswordError=""
            securityQuestionError=""
            securityAnswerError=""
          />
        </section>
      </PasswordManagerTemplate>
    );
  }

  // else => hasVault=true => UnlockVault
  return (
    <PasswordManagerTemplate>
      <section className="password-manager-template__section">
        <UnlockVaultForm
          unlockVaultFormData={unlockVaultFormData}
          handleChange={handleUnlockVaultChange}
          processUnlockVault={processUnlockVault}
          isLoading={isLoadingUnlockVault}
          successMessage={unlockVaultSuccessMessage}
          errorMessage={unlockVaultErrorMessage}
          masterPasswordError=""
        />
      </section>
    </PasswordManagerTemplate>
  );
};
