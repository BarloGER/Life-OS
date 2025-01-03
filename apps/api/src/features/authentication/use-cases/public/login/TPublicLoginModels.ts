import { User } from '@shared/entities/User';

export type TPublicLoginRequestModel = {
  email: string;
  password: string;
  language: string;
};

export type TPublicLoginResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
  user: User | null;
};
