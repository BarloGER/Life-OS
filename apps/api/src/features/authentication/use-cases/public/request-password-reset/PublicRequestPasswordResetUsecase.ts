import { INotificationService } from '@shared/services/index';
import { IToken } from '@shared/utils/token-generator/ITokenGenerator';
import { IPasswordHasher, ITokenGenerator } from '@shared/utils/index';

import { Email, User } from '@shared/entities/index';

import { IPublicRequestPasswordResetInputPort } from './IPublicRequestPasswordResetInputPort';
import { TPublicRequestPasswordResetRequestModel } from './TPublicRequestPasswordResetModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicRequestPasswordResetUsecase
  implements IPublicRequestPasswordResetInputPort
{
  constructor(
    private readonly notificationService: INotificationService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,

    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort
  ) {}

  async requestPasswordReset(
    requestModel: TPublicRequestPasswordResetRequestModel
  ): Promise<void> {
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
          validEmail.getValue()
        );
      } catch (error) {
        return this.outputPort.presentRequestPasswordResetResult({
          success: false,
          internalMessage: 'Database error while finding user',
          errorCode:
            error.message ||
            'authentication.requestPasswordReset.errors.unknownError',
        });
      }

      let passwordResetTokenObj: IToken;
      try {
        const TOKEN_LENGTH = parseInt(
          process.env.PASSWORD_RESET_TOKEN_LENGTH || '32'
        );
        const TOKEN_LIFETIME = parseInt(
          process.env.PASSWORD_RESET_TOKEN_LIFETIME || '3600'
        );
        passwordResetTokenObj = await this.tokenGenerator.generateToken(
          TOKEN_LENGTH,
          TOKEN_LIFETIME
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
          passwordResetTokenObj.expiresAt
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

      try {
        await this.notificationService.sendPasswordResetMail(
          foundUser.email,
          passwordResetTokenObj.token
        );
      } catch (error) {
        return this.outputPort.presentRequestPasswordResetResult({
          success: false,
          internalMessage: 'Error while sending verification mail',
          errorCode:
            error.message ||
            'authentication.requestPasswordReset.errors.unknownError',
        });
      }

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
    }
  }
}
