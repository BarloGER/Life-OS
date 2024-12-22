import { TPublicLoginResponseModel } from './login/TPublicLoginModels';
import { TPublicRegisterResponseModel } from './register/TPublicRegisterModels';

export interface IPublicAuthenticationOutputPort {
  presentRegistrationResult(responseModel: TPublicRegisterResponseModel): void;
  presentLoginResult(responseModel: TPublicLoginResponseModel): void;
}
