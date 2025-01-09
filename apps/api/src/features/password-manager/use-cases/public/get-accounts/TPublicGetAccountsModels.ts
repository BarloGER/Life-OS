import { Account } from '@features/password-manager/entities/index';

export type TPublicGetAccountsRequestModel = {
  userId: string;
};

export type TPublicGetAccountsResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
  accounts?: Array<Account> | null;
};
