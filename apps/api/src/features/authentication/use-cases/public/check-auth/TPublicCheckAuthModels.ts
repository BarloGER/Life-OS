import { User } from '@shared/entities/User';

export type TPublicCheckAuthRequestModel = {
  userId: string;
};

export type TPublicCheckAuthResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
  user: User | null;
};
