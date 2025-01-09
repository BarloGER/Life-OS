import { UserId } from '@shared/entities/index';
import { Account } from '@features/password-manager/entities/index';

import { IPublicGetAccountsInputPort } from './IPublicGetAccountsInputPort';
import { TPublicGetAccountsRequestModel } from './TPublicGetAccountsModels';
import { IPublicPasswordManagerOutputPort } from '../IPublicPasswordManagerOutputPort';
import { IPublicPasswordManagerRepository } from '../IPublicPasswordManagerRepository';

export class PublicGetAccountsUsecase implements IPublicGetAccountsInputPort {
  constructor(
    private readonly repository: IPublicPasswordManagerRepository,
    private readonly outputPort: IPublicPasswordManagerOutputPort
  ) {}

  async getAccounts(
    requestModel: TPublicGetAccountsRequestModel
  ): Promise<void> {
    try {
      let validUserId: UserId;

      try {
        validUserId = new UserId(requestModel.userId);
      } catch (error) {
        return this.outputPort.presentGetAccountsResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'authentication.getAccounts.errors.unknownError',
          accounts: null,
        });
      }

      let foundAccounts: Array<Account> | null;
      try {
        foundAccounts = await this.repository.findAccountsByUserId(
          validUserId.getValue()
        );
      } catch (error) {
        console.log(error);
        return this.outputPort.presentGetAccountsResult({
          success: false,
          internalMessage: 'Database error while finding accounts',
          errorCode:
            error.message || 'authentication.getAccounts.errors.unknownError',
          accounts: null,
        });
      }

      console.log(foundAccounts);

      return this.outputPort.presentGetAccountsResult({
        success: true,
        internalMessage: 'Get Accounts succesful',
        errorCode: null,
        accounts: foundAccounts,
      });
    } catch (error) {
      return this.outputPort.presentGetAccountsResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message || 'authentication.getAccounts.errors.unexpectedError',
        accounts: null,
      });
    }
  }
}
