import { Token, User } from '@shared/entities/index';

import { TPublicVerifyEmailRequestModel } from './TPublicVerifyEmailModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicVerifyEmailUsecase {
  constructor(
    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort
  ) {}

  async verifyEmail(
    requestModel: TPublicVerifyEmailRequestModel
  ): Promise<void> {
    try {
      let validToken: Token;

      try {
        validToken = new Token(requestModel.token);
      } catch (error) {
        return this.outputPort.presentVerifyEmailResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'authentication.verifyEmail.errors.unknownError',
        });
      }

      let foundUser: User;
      try {
        foundUser = await this.repository.findUserByEmailVerificationToken(
          validToken.getValue()
        );
      } catch (error) {
        return this.outputPort.presentVerifyEmailResult({
          success: false,
          internalMessage: 'Database error while finding user by token',
          errorCode:
            error.message || 'authentication.verifyEmail.errors.unknownError',
        });
      }

      if (foundUser.emailVerificationTokenExpiresAt < new Date()) {
        throw Error('authentication.verifyEmail.errors.tokenExpired');
      }

      try {
        await this.repository.activateUserAccount(foundUser.id);
      } catch (error) {
        return this.outputPort.presentVerifyEmailResult({
          success: false,
          internalMessage: 'Database error while verifying user email',
          errorCode:
            error.message || 'authentication.verifyEmail.errors.unknownError',
        });
      }

      return this.outputPort.presentVerifyEmailResult({
        success: true,
        internalMessage: 'Email successfully verified.',
        errorCode: null,
      });
    } catch (error) {
      return this.outputPort.presentVerifyEmailResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message || 'authentication.verifyEmail.errors.unexpectedError',
      });
    }
  }
}
