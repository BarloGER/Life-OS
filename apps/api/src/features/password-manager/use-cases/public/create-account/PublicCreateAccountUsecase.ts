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

import { IPublicCreateAccountInputPort } from './IPublicCreateAccountInputPort';
import { TPublicCreateAccountRequestModel } from './TPublicCreateAccountModels';
import { IPublicPasswordManagerOutputPort } from '../IPublicPasswordManagerOutputPort';
import { IPublicPasswordManagerRepository } from '../IPublicPasswordManagerRepository';

export class PublicCreateAccountUsecase
  implements IPublicCreateAccountInputPort
{
  constructor(
    private readonly repository: IPublicPasswordManagerRepository,
    private readonly outputPort: IPublicPasswordManagerOutputPort
  ) {}

  async createAccount(
    requestModel: TPublicCreateAccountRequestModel
  ): Promise<void> {
    try {
      let validUserId: UserId,
        validAccountName: AccountName,
        validUsername: Username,
        validEmail: Email,
        validEncryptedPassword: EncryptedSecret,
        validPasswordEncryptionIv: SecretEncryptionIv,
        validPasswordEncryptionSalt: SecretEncryptionSalt,
        validEncryptedNotes: EncryptedData,
        validNotesEncryptionIv: DataEncryptionIv,
        validNotesEncryptionSalt: DataEncryptionSalt;
      try {
        validUserId = new UserId(requestModel.userId);
        validAccountName = new AccountName(requestModel.accountName);
        validUsername = new Username(requestModel.username);
        validEmail = new Email(requestModel.email);
        validEncryptedPassword = new EncryptedSecret(
          requestModel.encryptedPassword
        );
        validPasswordEncryptionIv = new SecretEncryptionIv(
          requestModel.passwordEncryptionIv
        );
        validPasswordEncryptionSalt = new SecretEncryptionSalt(
          requestModel.passwordEncryptionSalt
        );
        validEncryptedNotes = new EncryptedData(requestModel.encryptedNotes);
        validNotesEncryptionIv = new DataEncryptionIv(
          requestModel.notesEncryptionIv
        );
        validNotesEncryptionSalt = new DataEncryptionSalt(
          requestModel.notesEncryptionSalt
        );
      } catch (error) {
        return this.outputPort.presentCreateAccountResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message ||
            'passwordManager.createAccount.errors.unknownError',
          account: null,
        });
      }

      let account: Account;
      try {
        account = await this.repository.createAccount(
          validUserId.getValue(),
          validAccountName.getValue(),
          validUsername.getValue(),
          validEmail.getValue(),
          validEncryptedPassword.getValue(),
          validPasswordEncryptionIv.getValue(),
          validPasswordEncryptionSalt.getValue(),
          validEncryptedNotes.getValue(),
          validNotesEncryptionIv.getValue(),
          validNotesEncryptionSalt.getValue()
        );
      } catch (error) {
        console.error(error.message);
        return this.outputPort.presentCreateAccountResult({
          success: false,
          internalMessage: 'Database error while creating account',
          errorCode: 'passwordManager.createAccount.errors.createAccountFailed',
          account: null,
        });
      }

      return this.outputPort.presentCreateAccountResult({
        success: true,
        internalMessage: 'Account successfully created',
        errorCode: null,
        account: account,
      });
    } catch (error) {
      console.error(error.message);
      return this.outputPort.presentCreateAccountResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode: 'passwordManager.createAccount.errors.createAccountFailed',
        account: null,
      });
    }
  }
}
