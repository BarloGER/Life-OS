import {
  IPublicPasswordManagerOutputPort,
  TPublicGetVaultResponseModel,
  TPublicCreateVaultResponseModel,
  TPublicGetAccountsResponseModel,
  TPublicCreateAccountResponseModel,
  TPublicEditAccountResponseModel,
} from '@features/password-manager/use-cases/public';

export class PublicPasswordManagerPresenter
  implements IPublicPasswordManagerOutputPort
{
  private getVaultResult: TPublicGetVaultResponseModel | null = null;
  private createVaultResult: TPublicCreateVaultResponseModel | null = null;
  private getAccountsResult: TPublicGetAccountsResponseModel | null = null;
  private createAccountResult: TPublicCreateAccountResponseModel | null = null;
  private editAccountResult: TPublicEditAccountResponseModel | null = null;

  presentGetVaultResult(responseModel: TPublicGetVaultResponseModel) {
    this.getVaultResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      vault: responseModel.vault,
    };
  }

  getGetVaultResult() {
    return this.getVaultResult;
  }

  presentCreateVaultResult(responseModel: TPublicCreateVaultResponseModel) {
    this.createVaultResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      vault: responseModel.vault,
    };
  }

  getCreateVaultResult() {
    return this.createVaultResult;
  }

  presentGetAccountsResult(responseModel: TPublicGetAccountsResponseModel) {
    this.getAccountsResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      accounts: responseModel.accounts,
    };
  }

  getGetAccountsResult() {
    return this.getAccountsResult;
  }

  presentCreateAccountResult(responseModel: TPublicCreateAccountResponseModel) {
    this.createAccountResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      account: responseModel.account,
    };
  }

  getCreateAccountResult() {
    return this.createAccountResult;
  }

  presentEditAccountResult(responseModel: TPublicEditAccountResponseModel) {
    this.editAccountResult = {
      success: responseModel.success,
      internalMessage: responseModel.internalMessage,
      errorCode: responseModel.errorCode,
      account: responseModel.account,
    };
  }

  getEditAccountResult() {
    return this.editAccountResult;
  }
}
