import { TPublicRegisterRequestModel } from './register/TPublicRegisterModels';

export interface IPublicAuthenticationInputPort {
  registerUser(requestModel: TPublicRegisterRequestModel): Promise<void>;
}
