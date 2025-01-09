import { TPublicCreateVaultRequestModel } from './TPublicCreateVaultModels';

export interface IPublicCreateVaultInputPort {
  createVault(requestModel: TPublicCreateVaultRequestModel): Promise<void>;
}
