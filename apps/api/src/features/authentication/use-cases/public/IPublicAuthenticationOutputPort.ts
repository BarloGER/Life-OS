import { TPublicLoginResponseModel } from './login/TPublicLoginModels';
import { TPublicRegisterResponseModel } from './register/TPublicRegisterModels';
import { TPublicVerifyEmailResponseModel } from './verify-email/TPublicVerifyEmailModels';

export interface IPublicAuthenticationOutputPort {
  presentRegistrationResult(responseModel: TPublicRegisterResponseModel): void;
  presentLoginResult(responseModel: TPublicLoginResponseModel): void;
  presentVerifyEmailResult(
    responseModel: TPublicVerifyEmailResponseModel
  ): void;
}
