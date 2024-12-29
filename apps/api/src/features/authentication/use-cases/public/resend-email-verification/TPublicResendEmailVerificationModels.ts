export type TPublicResendEmailVerificationRequestModel = {
  email: string;
  password: string;
  language: string;
};

export type TPublicResendEmailVerificationResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
};
