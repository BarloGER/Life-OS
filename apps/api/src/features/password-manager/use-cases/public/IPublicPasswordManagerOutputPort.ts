import { TPublicGetVaultResponseModel } from './get-vault/TPublicGetVaultModels';
import { TPublicCreateVaultResponseModel } from './create-vault/TPublicCreateVaultModels';
import { TPublicGetAccountsResponseModel } from './get-accounts/TPublicGetAccountsModels';
import { TPublicCreateAccountResponseModel } from './create-account/TPublicCreateAccountModels';
import { TPublicEditAccountResponseModel } from './edit-account/TPublicEditAccountModels';

export interface IPublicPasswordManagerOutputPort {
  presentGetVaultResult(responseModel: TPublicGetVaultResponseModel): void;
  presentCreateVaultResult(
    responseModel: TPublicCreateVaultResponseModel
  ): void;

  presentGetAccountsResult(
    responseModel: TPublicGetAccountsResponseModel
  ): void;
  presentCreateAccountResult(
    responseModel: TPublicCreateAccountResponseModel
  ): void;
  presentEditAccountResult(
    responseModel: TPublicEditAccountResponseModel
  ): void;
}
