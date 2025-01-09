import { TPublicEditAccountRequestModel } from './TPublicEditAccountModels';

export interface IPublicEditAccountInputPort {
  editAccount(requestModel: TPublicEditAccountRequestModel): Promise<void>;
}
