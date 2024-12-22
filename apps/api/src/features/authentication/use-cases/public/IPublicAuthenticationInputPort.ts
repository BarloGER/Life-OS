import { TPublicRegisterRequestModel } from './register/TPublicRegisterModels';
import { TPublicLoginRequestModel } from './login/TPublicLoginModels';

export interface IPublicAuthenticationInputPort {
  registerUser(requestModel: TPublicRegisterRequestModel): Promise<void>;
  loginUser(requestModel: TPublicLoginRequestModel): Promise<void>;
}
