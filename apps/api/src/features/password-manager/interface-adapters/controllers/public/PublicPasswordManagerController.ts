import {
  IPublicGetVaultInputPort,
  TPublicGetVaultRequestModel,
  IPublicCreateVaultInputPort,
  TPublicCreateVaultRequestModel,
  IPublicGetAccountsInputPort,
  TPublicGetAccountsRequestModel,
  IPublicCreateAccountInputPort,
  TPublicCreateAccountRequestModel,
  IPublicEditAccountInputPort,
  TPublicEditAccountRequestModel,
} from '@features/password-manager/use-cases/public';

export class PublicPasswordManagerController {
  constructor(
    private readonly getVaultInteractor: IPublicGetVaultInputPort,
    private readonly createVaultInteractor: IPublicCreateVaultInputPort,
    private readonly getAccountsInteractor: IPublicGetAccountsInputPort,
    private readonly createAccountInteractor: IPublicCreateAccountInputPort,
    private readonly editAccountInteractor: IPublicEditAccountInputPort
  ) {}

  async handleGetVaultRequest(
    rawData: TPublicGetVaultRequestModel
  ): Promise<void> {
    const { userId } = rawData;

    const requestModel: TPublicGetVaultRequestModel = {
      userId,
    };

    await this.getVaultInteractor.getVault(requestModel);
  }

  async handleCreateVaultRequest(
    rawData: TPublicCreateVaultRequestModel
  ): Promise<void> {
    const {
      userId,
      securityQuestion,
      secret,
      encryptedSecret,
      secretEncryptionIv,
      secretEncryptionSalt,
    } = rawData;

    console.log(rawData);

    const requestModel: TPublicCreateVaultRequestModel = {
      userId,
      securityQuestion,
      secret,
      encryptedSecret,
      secretEncryptionIv,
      secretEncryptionSalt,
    };

    await this.createVaultInteractor.createVault(requestModel);
  }

  async handleGetAccountsRequest(
    rawData: TPublicGetAccountsRequestModel
  ): Promise<void> {
    const { userId } = rawData;

    const requestModel: TPublicGetAccountsRequestModel = {
      userId,
    };

    await this.getAccountsInteractor.getAccounts(requestModel);
  }

  async handleCreateAccountRequest(
    rawData: TPublicCreateAccountRequestModel
  ): Promise<void> {
    const {
      userId,
      accountName,
      username,
      email,
      encryptedPassword,
      passwordEncryptionIv,
      passwordEncryptionSalt,
      encryptedNotes,
      notesEncryptionIv,
      notesEncryptionSalt,
    } = rawData;

    console.log(rawData);

    const requestModel: TPublicCreateAccountRequestModel = {
      userId,
      accountName,
      username,
      email,
      encryptedPassword,
      passwordEncryptionIv,
      passwordEncryptionSalt,
      encryptedNotes,
      notesEncryptionIv,
      notesEncryptionSalt,
    };

    await this.createAccountInteractor.createAccount(requestModel);
  }

  async handleEditAccountRequest(
    rawData: TPublicEditAccountRequestModel
  ): Promise<void> {
    const {
      userId,
      id,
      accountName,
      username,
      email,
      encryptedPassword,
      passwordEncryptionIv,
      passwordEncryptionSalt,
      encryptedNotes,
      notesEncryptionIv,
      notesEncryptionSalt,
    } = rawData;

    const requestModel: TPublicEditAccountRequestModel = {
      userId,
      id,
      accountName,
      username,
      email,
      encryptedPassword,
      passwordEncryptionIv,
      passwordEncryptionSalt,
      encryptedNotes,
      notesEncryptionIv,
      notesEncryptionSalt,
    };

    await this.editAccountInteractor.editAccount(requestModel);
  }
}
