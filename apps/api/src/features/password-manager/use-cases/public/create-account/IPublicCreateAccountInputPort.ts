import { TPublicCreateAccountRequestModel } from './TPublicCreateAccountModels';

export interface IPublicCreateAccountInputPort {
  createAccount(requestModel: TPublicCreateAccountRequestModel): Promise<void>;
}
