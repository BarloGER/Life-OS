import { IPasswordHasher } from '@shared/utils/index';

import { Password, Token, User } from '@shared/entities/index';

import { IPublicResetPasswordInputPort } from './IPublicResetPasswordInputPort';
import { TPublicResetPasswordRequestModel } from './TPublicResetPasswordModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicResetPasswordUsecase
  implements IPublicResetPasswordInputPort
{
  constructor(
    private readonly passwordHasher: IPasswordHasher,

    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort
  ) {}

  async resetPassword(
    requestModel: TPublicResetPasswordRequestModel
  ): Promise<void> {
    try {
      let validToken: Token, validPassword: Password;

      try {
        validPassword = Password.createForRegistration(
          requestModel.newPassword
        );
        validToken = new Token(requestModel.passwordResetToken);
      } catch (error) {
        return this.outputPort.presentResetPasswordResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'authentication.resetPassword.errors.unknownError',
        });
      }

      let foundUser: User;
      try {
        foundUser = await this.repository.findUserByPasswordResetToken(
          validToken.getValue()
        );
      } catch (error) {
        return this.outputPort.presentResetPasswordResult({
          success: false,
          internalMessage: 'Database error while finding user by token',
          errorCode:
            error.message || 'authentication.resetPassword.errors.unknownError',
        });
      }

      if (foundUser.passwordResetTokenExpiresAt < new Date()) {
        throw Error('authentication.resetPassword.errors.tokenExpired');
      }

      let hashedPassword: string;
      try {
        hashedPassword = await this.passwordHasher.hash(
          validPassword.getValue()
        );
      } catch (error) {
        return this.outputPort.presentResetPasswordResult({
          success: false,
          internalMessage: 'Password hashing failed',
          errorCode:
            error.message || 'authentication.resetPassword.errors.unknownError',
        });
      }

      try {
        await this.repository.updateUserPassword(foundUser.id, hashedPassword);
      } catch (error) {
        return this.outputPort.presentResetPasswordResult({
          success: false,
          internalMessage: 'Database error while updating token',
          errorCode:
            error.message || 'authentication.resetPassword.errors.unknownError',
        });
      }

      try {
        await this.repository.clearPasswordResetToken(foundUser.id);
      } catch (error) {
        return this.outputPort.presentResetPasswordResult({
          success: false,
          internalMessage: 'Error while sending verification mail',
          errorCode:
            error.message || 'authentication.resetPassword.errors.unknownError',
        });
      }

      return this.outputPort.presentResetPasswordResult({
        success: true,
        internalMessage: 'Password reset successful',
        errorCode: null,
      });
    } catch (error) {
      return this.outputPort.presentResetPasswordResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message ||
          'authentication.resetPassword.errors.unexpectedError',
      });
    }
  }
}
