import { Account, Vault } from '@features/password-manager/entities/index';

export interface IPublicPasswordManagerRepository {
  findVaultByUserId(userId: string): Promise<Vault>;
  createVault(
    userId: string,
    securityQuestion: string,
    secret: string,
    encryptedSecret: string,
    secretEncryptionIv: string,
    secretEncryptionSalt: string
  ): Promise<Vault>;

  findAccountsByUserId(userId: string): Promise<Array<Account> | null>;
  createAccount(
    userId: string,
    accountName: string,
    username: string,
    email: string,
    encryptedPassword: string,
    passwordEncryptionIv: string,
    passwordEncryptionSalt: string,
    encryptedNotes: string | null,
    notesEncryptionIv: string | null,
    notesEncryptionSalt: string | null
  ): Promise<Account>;
  editAccount(
    id: string,
    userId: string,
    updates: Partial<{
      accountName: string;
      username: string;
      email: string;
      encryptedPassword: string;
      passwordEncryptionIv: string;
      passwordEncryptionSalt: string;
      encryptedNotes: string | null;
      notesEncryptionIv: string | null;
      notesEncryptionSalt: string | null;
    }>
  ): Promise<Account>;
}
