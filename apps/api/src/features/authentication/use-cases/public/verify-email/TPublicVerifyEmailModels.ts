export type TPublicVerifyEmailRequestModel = {
  token: string;
};

export type TPublicVerifyEmailResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
};
