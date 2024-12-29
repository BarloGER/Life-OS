import { User } from '@shared/entities/User';

export type TPublicRegisterRequestModel = {
  username: string;
  email: string;
  password: string;
  isNewsletterAccepted: boolean;
  isTermsAccepted: boolean;
  language: string;
};

export type TPublicRegisterResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
  user: User | null;
};
