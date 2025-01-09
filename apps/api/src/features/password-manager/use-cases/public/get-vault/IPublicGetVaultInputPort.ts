import { TPublicGetVaultRequestModel } from './TPublicGetVaultModels';

export interface IPublicGetVaultInputPort {
  getVault(requestModel: TPublicGetVaultRequestModel): Promise<void>;
}
