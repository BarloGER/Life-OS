import { TPublicLoginRequestModel } from './TPublicLoginModels';

export interface IPublicLoginInputPort {
  loginUser(requestModel: TPublicLoginRequestModel): Promise<void>;
}
