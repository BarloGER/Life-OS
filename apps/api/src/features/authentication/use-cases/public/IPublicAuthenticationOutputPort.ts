import { TPublicRegisterResponseModel } from './register/TPublicRegisterModels';

export interface IPublicAuthenticationOutputPort {
  presentRegistrationResult(responseModel: TPublicRegisterResponseModel): void;
}
