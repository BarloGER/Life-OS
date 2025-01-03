import { UserId, User } from '@shared/entities/index';

import { IPublicCheckAuthInputPort } from './IPublicCheckAuthInputPort';
import { TPublicCheckAuthRequestModel } from './TPublicCheckAuthModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicCheckAuthUsecase implements IPublicCheckAuthInputPort {
  constructor(
    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort
  ) {}

  async checkAuth(requestModel: TPublicCheckAuthRequestModel): Promise<void> {
    try {
      let validUserId: UserId;

      try {
        validUserId = new UserId(requestModel.userId);
      } catch (error) {
        return this.outputPort.presentCheckAuthResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'authentication.checkAuth.errors.unknownError',
          user: null,
        });
      }

      let foundUser: User;
      try {
        foundUser = await this.repository.findUserById(validUserId.getValue());
      } catch (error) {
        return this.outputPort.presentCheckAuthResult({
          success: false,
          internalMessage: 'Database error while finding user',
          errorCode:
            error.message || 'authentication.checkAuth.errors.unknownError',
          user: null,
        });
      }

      if (foundUser.status !== 'active') {
        throw Error('authentication.checkAuth.errors.accountNotActive');
      }

      return this.outputPort.presentCheckAuthResult({
        success: true,
        internalMessage: 'User successfully authenticated',
        errorCode: null,
        user: foundUser,
      });
    } catch (error) {
      return this.outputPort.presentCheckAuthResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message || 'authentication.checkAuth.errors.unexpectedError',
        user: null,
      });
    }
  }
}
