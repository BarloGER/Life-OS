import {
  IPublicAuthenticationOutputPort,
  TPublicRegisterResponseModel,
  TPublicLoginResponseModel,
  TPublicVerifyEmailResponseModel,
  TPublicResendEmailVerificationResponseModel,
} from '@features/authentication/use-cases/public';

export class PublicAuthenticationPresenter
  implements IPublicAuthenticationOutputPort
{
  private registrationResult: TPublicRegisterResponseModel | null = null;
  private loginResult: TPublicLoginResponseModel | null = null;
  private verifyEmailResult: TPublicVerifyEmailResponseModel | null = null;
  private resendEmailVerificationResult: TPublicVerifyEmailResponseModel | null =
    null;

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
}
