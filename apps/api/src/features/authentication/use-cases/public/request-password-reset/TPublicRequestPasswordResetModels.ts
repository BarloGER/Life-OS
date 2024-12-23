export type TPublicRequestPasswordResetRequestModel = {
  email: string;
};

export type TPublicRequestPasswordResetResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
};
