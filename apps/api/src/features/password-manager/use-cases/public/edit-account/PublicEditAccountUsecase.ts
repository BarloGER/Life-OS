import { UserId } from '@shared/entities/index';
import {
  Account,
  AccountName,
  Email,
  EncryptedData,
  DataEncryptionIv,
  DataEncryptionSalt,
  EncryptedSecret,
  SecretEncryptionIv,
  SecretEncryptionSalt,
  Username,
} from '@features/password-manager/entities/index';

import { IPublicEditAccountInputPort } from './IPublicEditAccountInputPort';
import { TPublicEditAccountRequestModel } from './TPublicEditAccountModels';
import { IPublicPasswordManagerOutputPort } from '../IPublicPasswordManagerOutputPort';
import { IPublicPasswordManagerRepository } from '../IPublicPasswordManagerRepository';

export class PublicEditAccountUsecase implements IPublicEditAccountInputPort {
  constructor(
    private readonly repository: IPublicPasswordManagerRepository,
    private readonly outputPort: IPublicPasswordManagerOutputPort
  ) {}

  async editAccount(
    requestModel: TPublicEditAccountRequestModel
  ): Promise<void> {
    try {
      let validUserId: UserId, validId: string;
      const updates: Record<string, any> = {};

      try {
        validUserId = new UserId(requestModel.userId);
        validId = requestModel.id;

        if (requestModel.accountName) {
          updates.accountName = new AccountName(
            requestModel.accountName
          ).getValue();
        }
        if (requestModel.username) {
          updates.username = new Username(requestModel.username).getValue();
        }
        if (requestModel.email) {
          updates.email = new Email(requestModel.email).getValue();
        }
        if (requestModel.encryptedPassword) {
          updates.encryptedPassword = new EncryptedSecret(
            requestModel.encryptedPassword
          ).getValue();

          updates.passwordEncryptionIv = new SecretEncryptionIv(
            requestModel.passwordEncryptionIv
          ).getValue();

          updates.passwordEncryptionSalt = new SecretEncryptionSalt(
            requestModel.passwordEncryptionSalt
          ).getValue();
        }

        if (requestModel.encryptedNotes) {
          updates.encryptedNotes = new EncryptedData(
            requestModel.encryptedNotes
          ).getValue();

          updates.notesEncryptionIv = new DataEncryptionIv(
            requestModel.notesEncryptionIv
          ).getValue();

          updates.notesEncryptionSalt = new DataEncryptionSalt(
            requestModel.notesEncryptionSalt
          ).getValue();
        }
      } catch (error) {
        return this.outputPort.presentEditAccountResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'passwordManager.editAccount.errors.unknownError',
          account: null,
        });
      }

      let updatedAccount: Account;
      try {
        updatedAccount = await this.repository.editAccount(
          validId,
          validUserId.getValue(),
          updates
        );
      } catch (error) {
        return this.outputPort.presentEditAccountResult({
          success: false,
          internalMessage: 'Database error while editing account',
          errorCode: 'passwordManager.editAccount.errors.editAccountFailed',
          account: null,
        });
      }

      return this.outputPort.presentEditAccountResult({
        success: true,
        internalMessage: 'Account successfully updated',
        errorCode: null,
        account: updatedAccount,
      });
    } catch (error) {
      return this.outputPort.presentEditAccountResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode: 'passwordManager.editAccount.errors.unexpectedError',
        account: null,
      });
    }
  }
}
