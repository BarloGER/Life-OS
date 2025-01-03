export type TPublicResetPasswordRequestModel = {
  passwordResetToken: string;
  newPassword: string;
};

export type TPublicResetPasswordResponseModel = {
  success: boolean;
  internalMessage: string;
  errorCode: string | null;
  errorStackTrace?: string;
};
