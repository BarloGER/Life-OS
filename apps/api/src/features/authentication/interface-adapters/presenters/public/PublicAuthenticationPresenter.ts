import {
  IPublicAuthenticationOutputPort,
  TPublicRegisterResponseModel,
} from '@features/authentication/use-cases/public';

export class PublicAuthenticationPresenter
  implements IPublicAuthenticationOutputPort
{
  private registrationResult: TPublicRegisterResponseModel | null = null;

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
}
