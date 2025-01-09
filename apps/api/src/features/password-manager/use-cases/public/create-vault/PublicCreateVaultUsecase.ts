import { UserId } from '@shared/entities/index';
import {
  Vault,
  SecurityQuestion,
  Secret,
  EncryptedSecret,
  SecretEncryptionIv,
  SecretEncryptionSalt,
} from '@features/password-manager/entities/index';

import { IPublicCreateVaultInputPort } from './IPublicCreateVaultInputPort';
import { TPublicCreateVaultRequestModel } from './TPublicCreateVaultModels';
import { IPublicPasswordManagerOutputPort } from '../IPublicPasswordManagerOutputPort';
import { IPublicPasswordManagerRepository } from '../IPublicPasswordManagerRepository';

export class PublicCreateVaultUsecase implements IPublicCreateVaultInputPort {
  constructor(
    private readonly repository: IPublicPasswordManagerRepository,
    private readonly outputPort: IPublicPasswordManagerOutputPort
  ) {}

  async createVault(
    requestModel: TPublicCreateVaultRequestModel
  ): Promise<void> {
    try {
      let validUserId: UserId,
        validSecurityQuestion: SecurityQuestion,
        validSecret: Secret,
        validEncryptedSecret: EncryptedSecret,
        validSecretEncryptionIv: SecretEncryptionIv,
        validSecretEncryptionSalt: SecretEncryptionSalt;
      try {
        validUserId = new UserId(requestModel.userId);
        validSecurityQuestion = new SecurityQuestion(
          requestModel.securityQuestion
        );
        validSecret = new Secret(requestModel.secret);
        validEncryptedSecret = new EncryptedSecret(
          requestModel.encryptedSecret
        );
        validSecretEncryptionIv = new SecretEncryptionIv(
          requestModel.secretEncryptionIv
        );
        validSecretEncryptionSalt = new SecretEncryptionSalt(
          requestModel.secretEncryptionSalt
        );
      } catch (error) {
        return this.outputPort.presentCreateVaultResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'passwordManager.createVault.errors.unknownError',
          vault: null,
        });
      }

      let vault: Vault;
      try {
        vault = await this.repository.createVault(
          validUserId.getValue(),
          validSecurityQuestion.getValue(),
          validSecret.getValue(),
          validEncryptedSecret.getValue(),
          validSecretEncryptionIv.getValue(),
          validSecretEncryptionSalt.getValue()
        );
      } catch (error) {
        console.error(error.message);
        if (error.message.includes('vaultnameAlreadyExists')) {
          return this.outputPort.presentCreateVaultResult({
            success: false,
            internalMessage: 'Vaultname already exists.',
            errorCode:
              'passwordManager.createVault.errors.vaultnameAlreadyExists',
            vault: null,
          });
        } else if (error.message.includes('emailAlreadyExists'))
          // success is set to true so that an attacker cannot collect valid emails.
          return this.outputPort.presentCreateVaultResult({
            success: true,
            internalMessage: 'Email already exists.',
            errorCode: null,
            vault: null,
          });

        return this.outputPort.presentCreateVaultResult({
          success: false,
          internalMessage: 'Database error while creating vault',
          errorCode: 'passwordManager.createVault.errors.createVaultFailed',
          vault: null,
        });
      }

      return this.outputPort.presentCreateVaultResult({
        success: true,
        internalMessage: 'Vault successfully createVaulted',
        errorCode: null,
        vault: vault,
      });
    } catch (error) {
      console.error(error.message);
      return this.outputPort.presentCreateVaultResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode: 'passwordManager.createVault.errors.createVaultFailed',
        vault: null,
      });
    }
  }
}
