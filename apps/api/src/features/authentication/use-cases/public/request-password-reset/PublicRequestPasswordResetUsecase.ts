import { INotificationService } from '@shared/services/index';
import { IToken } from '@shared/utils/token-generator/ITokenGenerator';
import { IPasswordHasher, ITokenGenerator } from '@shared/utils/index';

import { Email, User } from '@shared/entities/index';

import { IPublicRequestPasswordResetInputPort } from './IPublicRequestPasswordResetInputPort';
import { TPublicRequestPasswordResetRequestModel } from './TPublicRequestPasswordResetModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export class PublicRequestPasswordResetUsecase
  implements IPublicRequestPasswordResetInputPort
{
  constructor(
    private readonly notificationService: INotificationService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,

    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort,
  ) {}

  async requestPasswordReset(
    requestModel: TPublicRequestPasswordResetRequestModel,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      let validEmail: Email;
      try {
        validEmail = new Email(requestModel.email);
      } catch (error) {
        return this.outputPort.presentRequestPasswordResetResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message ||
            'authentication.requestPasswordReset.errors.unknownError',
        });
      }

      let foundUser: User;
      try {
        foundUser = await this.repository.findUserByEmail(
          validEmail.getValue(),
        );
      } catch (error) {
        console.error(error.message);
        // Set success to true to keep the response equal and avoid valid email
        // collection from an attacker
        return this.outputPort.presentRequestPasswordResetResult({
          success: true,
          internalMessage: 'Database error while finding user',
          errorCode: null,
        });
      }

      let passwordResetTokenObj: IToken;
      try {
        const TOKEN_LENGTH = parseInt(
          process.env.PASSWORD_RESET_TOKEN_LENGTH || '32',
        );
        const TOKEN_LIFETIME = parseInt(
          process.env.PASSWORD_RESET_TOKEN_LIFETIME || '3600',
        );
        passwordResetTokenObj = await this.tokenGenerator.generateToken(
          TOKEN_LENGTH,
          TOKEN_LIFETIME,
        );
        console.log(passwordResetTokenObj);
      } catch (error) {
        return this.outputPort.presentRequestPasswordResetResult({
          success: false,
          internalMessage: 'Error generating password reset verification token',
          errorCode:
            error.message ||
            'authentication.requestPasswordReset.errors.unknownError',
        });
      }

      try {
        await this.repository.updatePasswordResetToken(
          foundUser.id,
          passwordResetTokenObj.token,
          passwordResetTokenObj.expiresAt,
        );
      } catch (error) {
        return this.outputPort.presentRequestPasswordResetResult({
          success: false,
          internalMessage: 'Database error while updating token',
          errorCode:
            error.message ||
            'authentication.requestPasswordReset.errors.unknownError',
        });
      }

      void this.notificationService
        .sendPasswordResetMail(
          foundUser.email,
          passwordResetTokenObj.token,
          requestModel.language,
        )
        .catch((err) => {
          console.error('Mail sending failed (async):', err);
        });

      return this.outputPort.presentRequestPasswordResetResult({
        success: true,
        internalMessage: 'Email successfully sended',
        errorCode: null,
      });
    } catch (error) {
      return this.outputPort.presentRequestPasswordResetResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message ||
          'authentication.requestPasswordReset.errors.unexpectedError',
      });
    } finally {
      // Force same response time to avoid email collecting from an attacker
      await delay(Math.max(0, 3000 - (Date.now() - startTime)));
    }
  }
}
