import { Vault } from '@features/password-manager/entities/index';

export type TPublicGetVaultRequestModel = {
  userId: string;
};

export type TPublicGetVaultResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
  vault?: Vault | null;
};
