import { TPublicGetAccountsRequestModel } from './TPublicGetAccountsModels';

export interface IPublicGetAccountsInputPort {
  getAccounts(requestModel: TPublicGetAccountsRequestModel): Promise<void>;
}
