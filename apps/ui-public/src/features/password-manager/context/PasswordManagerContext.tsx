import React, { createContext, useState, ReactNode } from 'react';
import {
  CryptoService,
  ICryptoService,
} from '@features/password-manager/services/index';

import { Account } from '../entities';

type TVaultData = {
  secret: string;
  encryptedSecret: string;
  secretEncryptionIv: string;
  secretEncryptionSalt: string;
  securityQuestion: string;
};

type TPasswordManagerContext = {
  masterPassword: string;
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>;

  isVaultUnlocked: boolean;
  setIsVaultUnlocked: React.Dispatch<React.SetStateAction<boolean>>;

  hasVault: boolean;
  setHasVault: React.Dispatch<React.SetStateAction<boolean>>;

  vaultData: TVaultData | null;
  setVaultData: React.Dispatch<React.SetStateAction<TVaultData | null>>;

  isVaultLoading: boolean;
  setIsVaultLoading: React.Dispatch<React.SetStateAction<boolean>>;

  accountList: Account[];
  setAccountList: React.Dispatch<React.SetStateAction<Account[]>>;

  cryptoService: ICryptoService;
};

export const PasswordManagerContext = createContext<TPasswordManagerContext>(
  {} as TPasswordManagerContext
);

type Props = {
  children: ReactNode;
};

export const PasswordManagerProvider: React.FC<Props> = ({ children }) => {
  const cryptoService = new CryptoService();
  const [masterPassword, setMasterPassword] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [hasVault, setHasVault] = useState(false);
  const [vaultData, setVaultData] = useState<TVaultData | null>(null);
  const [isVaultLoading, setIsVaultLoading] = useState(false);
  const [accountList, setAccountList] = useState<Account[]>([]);

  const value: TPasswordManagerContext = {
    masterPassword,
    setMasterPassword,
    isVaultUnlocked,
    setIsVaultUnlocked,
    hasVault,
    setHasVault,
    vaultData,
    setVaultData,
    isVaultLoading,
    setIsVaultLoading,
    accountList,
    setAccountList,
    cryptoService,
  };

  return (
    <PasswordManagerContext.Provider value={value}>
      {children}
    </PasswordManagerContext.Provider>
  );
};
