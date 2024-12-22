import { INotificationService } from '@shared/services/index';
import { IPasswordHasher, ITokenGenerator } from '@shared/utils/index';

import { Email, Password, User } from '@shared/entities/index';

import { TPublicLoginRequestModel } from './TPublicLoginModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicLoginUsecase {
  constructor(
    private readonly notificationService: INotificationService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,

    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort
  ) {}

  async loginUser(requestModel: TPublicLoginRequestModel): Promise<void> {
    const MAX_FAILED_ATTEMPTS = 5;
    const LOCK_DURATION_MINUTES = 15;

    try {
      let validEmail: Email, validPassword: Password;

      try {
        validEmail = new Email(requestModel.email);
        validPassword = Password.createForLogin(requestModel.password);
      } catch (error) {
        return this.outputPort.presentLoginResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'authentication.login.errors.unknownError',
          user: null,
        });
      }

      let foundUser: User;
      try {
        foundUser = await this.repository.findUserByEmail(
          validEmail.getValue()
        );
      } catch (error) {
        return this.outputPort.presentLoginResult({
          success: false,
          internalMessage: 'Database error while finding user',
          errorCode:
            error.message || 'authentication.login.errors.unknownError',
          user: null,
        });
      }

      if (foundUser.status !== 'active') {
        throw Error('authentication.login.errors.accountNotActive');
      }

      if (!foundUser.isEmailVerified) {
        throw Error('authentication.login.errors.emailNotVerified');
      }

      if (foundUser.lockedUntil && foundUser.lockedUntil > new Date()) {
        throw Error('authentication.login.errors.accountLocked');
      } else if (foundUser.lockedUntil) {
        await this.repository.unlockUserAccount(foundUser.id);
      }

      let isPasswordValid: boolean;
      try {
        isPasswordValid = await this.passwordHasher.compare(
          validPassword.getValue(),
          foundUser.hashedPassword
        );
        if (!isPasswordValid) {
          await this.repository.incrementFailedLoginAttempts(foundUser.id);

          // Check if account should be locked
          if (foundUser.failedLoginAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
            await this.repository.lockUserAccount(
              foundUser.id,
              LOCK_DURATION_MINUTES
            );
            throw Error('authentication.login.errors.accountLocked');
          }

          throw Error('authentication.login.errors.invalidCredentials');
        }
      } catch (error) {
        return this.outputPort.presentLoginResult({
          success: false,
          internalMessage: 'Database error while finding user',
          errorCode:
            error.message || 'authentication.login.errors.unknownError',
          user: null,
        });
      }

      await this.repository.resetFailedLoginAttempts(foundUser.id);

      // Get updated user
      const updatedUser = await this.repository.findUserById(foundUser.id);

      return this.outputPort.presentLoginResult({
        success: true,
        internalMessage: 'User successfully authenticated',
        errorCode: null,
        user: updatedUser,
      });
    } catch (error) {
      return this.outputPort.presentLoginResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message || 'authentication.login.errors.unexpectedError',
        user: null,
      });
    }
  }
}
