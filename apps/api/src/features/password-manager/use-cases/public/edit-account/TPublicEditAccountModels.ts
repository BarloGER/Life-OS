import { Account } from '@features/password-manager/entities/index';

export type TPublicEditAccountRequestModel = {
  userId: string;
  id: string;
  accountName?: string;
  username?: string;
  email?: string;
  encryptedPassword?: string;
  passwordEncryptionIv?: string;
  passwordEncryptionSalt?: string;
  encryptedNotes?: string | null;
  notesEncryptionIv?: string | null;
  notesEncryptionSalt?: string | null;
};

export type TPublicEditAccountResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
  account: Account | null;
};
