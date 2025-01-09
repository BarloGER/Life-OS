import { UserId } from '@shared/entities/index';
import { Vault } from '@features/password-manager/entities/index';

import { IPublicGetVaultInputPort } from './IPublicGetVaultInputPort';
import { TPublicGetVaultRequestModel } from './TPublicGetVaultModels';
import { IPublicPasswordManagerOutputPort } from '../IPublicPasswordManagerOutputPort';
import { IPublicPasswordManagerRepository } from '../IPublicPasswordManagerRepository';

export class PublicGetVaultUsecase implements IPublicGetVaultInputPort {
  constructor(
    private readonly repository: IPublicPasswordManagerRepository,
    private readonly outputPort: IPublicPasswordManagerOutputPort
  ) {}

  async getVault(requestModel: TPublicGetVaultRequestModel): Promise<void> {
    try {
      let validUserId: UserId;

      try {
        validUserId = new UserId(requestModel.userId);
      } catch (error) {
        return this.outputPort.presentGetVaultResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'authentication.getVault.errors.unknownError',
          vault: null,
        });
      }

      let foundVault: Vault;
      try {
        foundVault = await this.repository.findVaultByUserId(
          validUserId.getValue()
        );
      } catch (error) {
        console.log(error);
        return this.outputPort.presentGetVaultResult({
          success: false,
          internalMessage: 'Database error while finding vault',
          errorCode:
            error.message || 'authentication.getVault.errors.unknownError',
          vault: null,
        });
      }

      return this.outputPort.presentGetVaultResult({
        success: true,
        internalMessage: 'Get Vault succesful',
        errorCode: null,
        vault: foundVault,
      });
    } catch (error) {
      return this.outputPort.presentGetVaultResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message || 'authentication.getVault.errors.unexpectedError',
        vault: null,
      });
    }
  }
}
