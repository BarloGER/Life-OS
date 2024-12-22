import {
  IPublicAuthenticationOutputPort,
  TPublicRegisterResponseModel,
  TPublicLoginResponseModel,
} from '@features/authentication/use-cases/public';

export class PublicAuthenticationPresenter
  implements IPublicAuthenticationOutputPort
{
  private registrationResult: TPublicRegisterResponseModel | null = null;
  private loginResult: TPublicLoginResponseModel | null = null;

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
}
