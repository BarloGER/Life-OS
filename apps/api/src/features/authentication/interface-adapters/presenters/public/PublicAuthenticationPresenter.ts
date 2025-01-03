import {
  IPublicAuthenticationOutputPort,
  TPublicCheckAuthResponseModel,
  TPublicRegisterResponseModel,
  TPublicLoginResponseModel,
  TPublicVerifyEmailResponseModel,
  TPublicResendEmailVerificationResponseModel,
  TPublicRequestPasswordResetResponseModel,
  TPublicResetPasswordResponseModel,
} from '@features/authentication/use-cases/public';

export class PublicAuthenticationPresenter
  implements IPublicAuthenticationOutputPort
{
  private checkAuthResult: TPublicCheckAuthResponseModel | null = null;
  private registrationResult: TPublicRegisterResponseModel | null = null;
  private loginResult: TPublicLoginResponseModel | null = null;
  private verifyEmailResult: TPublicVerifyEmailResponseModel | null = null;
  private resendEmailVerificationResult: TPublicVerifyEmailResponseModel | null =
    null;
  private requestPasswordResetResult: TPublicRequestPasswordResetResponseModel | null =
    null;
  private resetPasswordResult: TPublicResetPasswordResponseModel | null = null;

  presentCheckAuthResult(responseModel: TPublicCheckAuthResponseModel) {
    this.checkAuthResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      user: responseModel.user,
    };
  }

  getCheckAuthResult() {
    return this.checkAuthResult;
  }

  presentRegistrationResult(responseModel: TPublicRegisterResponseModel) {
    this.registrationResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      user: responseModel.user,
    };
  }

  getRegistrationResult() {
    return this.registrationResult;
  }

  presentLoginResult(responseModel: TPublicLoginResponseModel) {
    this.loginResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      user: responseModel.user,
    };
  }

  getLoginResult() {
    return this.loginResult;
  }

  presentVerifyEmailResult(responseModel: TPublicVerifyEmailResponseModel) {
    this.verifyEmailResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
    };
  }

  getVerifyEmailResult() {
    return this.verifyEmailResult;
  }

  presentResendEmailVerificationResult(
    responseModel: TPublicResendEmailVerificationResponseModel
  ) {
    this.resendEmailVerificationResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
    };
  }

  getResendEmailVerificationResult() {
    return this.resendEmailVerificationResult;
  }

  presentRequestPasswordResetResult(
    responseModel: TPublicRequestPasswordResetResponseModel
  ) {
    this.requestPasswordResetResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
    };
  }

  getRequestPasswordResetResult() {
    return this.requestPasswordResetResult;
  }

  presentResetPasswordResult(responseModel: TPublicResetPasswordResponseModel) {
    this.resetPasswordResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
    };
  }

  getResetPasswordResult() {
    return this.resetPasswordResult;
  }
}
