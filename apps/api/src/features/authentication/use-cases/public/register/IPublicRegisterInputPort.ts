import { TPublicRegisterRequestModel } from './TPublicRegisterModels';

export interface IPublicRegisterInputPort {
  registerUser(requestModel: TPublicRegisterRequestModel): Promise<void>;
}
