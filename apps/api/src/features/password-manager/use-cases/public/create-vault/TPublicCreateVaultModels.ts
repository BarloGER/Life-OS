import { Vault } from '@features/password-manager/entities/index';

export type TPublicCreateVaultRequestModel = {
  userId: string;
  securityQuestion: string;
  secret: string;
  encryptedSecret: string;
  secretEncryptionIv: string;
  secretEncryptionSalt: string;
};

export type TPublicCreateVaultResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
  vault?: Vault | null;
};
