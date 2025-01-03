import { INotificationService } from '@shared/services/index';
import { IPasswordHasher, ITokenGenerator } from '@shared/utils/index';

import { Email, Password, User } from '@shared/entities/index';

import { IPublicLoginInputPort } from './IPublicLoginInputPort';
import { TPublicLoginRequestModel } from './TPublicLoginModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicLoginUsecase implements IPublicLoginInputPort {
  constructor(
    private readonly notificationService: INotificationService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,

    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort,
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
        console.error(error);
        return this.outputPort.presentLoginResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode: 'authentication.login.errors.loginFailed',
          user: null,
        });
      }

      let foundUser: User;
      try {
        foundUser = await this.repository.findUserByEmail(
          validEmail.getValue(),
        );
      } catch (error) {
        console.error(error);
        return this.outputPort.presentLoginResult({
          success: false,
          internalMessage: 'Database error while finding user',
          errorCode: 'authentication.login.errors.loginFailed',
          user: null,
        });
      }

      let isPasswordValid: boolean;
      try {
        isPasswordValid = await this.passwordHasher.compare(
          validPassword.getValue(),
          foundUser.hashedPassword,
        );
        if (!isPasswordValid) {
          await this.repository.incrementFailedLoginAttempts(foundUser.id);

          // Check if account should be locked
          if (foundUser.failedLoginAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
            await this.repository.lockUserAccount(
              foundUser.id,
              LOCK_DURATION_MINUTES,
            );
            this.notificationService.sendBlockNoticeMail(
              foundUser.email,
              requestModel.language,
            );
            throw Error('authentication.login.errors.loginFailed');
          }

          throw Error('authentication.login.errors.loginFailed');
        }
      } catch (error) {
        console.error(error);
        return this.outputPort.presentLoginResult({
          success: false,
          internalMessage: 'Database error while finding user',
          errorCode: 'authentication.login.errors.loginFailed',
          user: null,
        });
      }

      await this.repository.resetFailedLoginAttempts(foundUser.id);

      if (foundUser.status === 'pending_verification') {
        throw Error('authentication.login.errors.pendingVerification');
      }

      if (foundUser.status !== 'active') {
        throw Error('authentication.login.errors.loginFailed');
      }

      if (foundUser.lockedUntil && foundUser.lockedUntil > new Date()) {
        throw Error('authentication.login.errors.loginFailed');
      } else if (foundUser.lockedUntil) {
        await this.repository.unlockUserAccount(foundUser.id);
        this.notificationService.sendUnblockNoticeMail(
          foundUser.email,
          requestModel.language,
        );
      }

      // Get updated user
      const updatedUser = await this.repository.findUserById(foundUser.id);

      return this.outputPort.presentLoginResult({
        success: true,
        internalMessage: 'User successfully authenticated',
        errorCode: null,
        user: updatedUser,
      });
    } catch (error) {
      console.error(error.message);
      return this.outputPort.presentLoginResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode: error.message || 'authentication.login.errors.loginFailed',
        user: null,
      });
    }
  }
}
