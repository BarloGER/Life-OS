import { TPublicCheckAuthRequestModel } from './TPublicCheckAuthModels';

export interface IPublicCheckAuthInputPort {
  checkAuth(requestModel: TPublicCheckAuthRequestModel): Promise<void>;
}
