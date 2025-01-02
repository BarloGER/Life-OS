import { INotificationService } from '@shared/services/index';
import { IPasswordHasher, ITokenGenerator } from '@shared/utils/index';

import { Email, Password, User } from '@shared/entities/index';
import { IToken } from '@shared/utils/token-generator/ITokenGenerator';

import { IPublicResendEmailVerificationInputPort } from './IPublicResendEmailVerificationInputPort';
import { TPublicResendEmailVerificationRequestModel } from './TPublicResendEmailVerificationModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export class PublicResendEmailVerificationUsecase
  implements IPublicResendEmailVerificationInputPort
{
  constructor(
    private readonly notificationService: INotificationService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort,
  ) {}

  async resendEmailVerification(
    requestModel: TPublicResendEmailVerificationRequestModel,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      let validEmail: Email, validPassword: Password;

      try {
        validEmail = new Email(requestModel.email);
        validPassword = Password.createForLogin(requestModel.password);
      } catch (error) {
        return this.outputPort.presentResendEmailVerificationResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message ||
            'authentication.resendEmailVerification.errors.unknownError',
        });
      }

      let foundUser: User;
      try {
        foundUser = await this.repository.findUserByEmail(
          validEmail.getValue(),
        );
      } catch (error) {
        console.error(error.message);
        // If an user doesnt exist in the db, we set it to null to keep
        // the function running, to get an equal response time
        foundUser = null;
      }

      let isPasswordValid: boolean;
      try {
        console.log(foundUser);
        // Dummy hash if an user doesnt exist to keep response time equal
        if (foundUser === null) {
          isPasswordValid = await this.passwordHasher.compare(
            validPassword.getValue(),
            'dummy-hash-value-for-non-existent-user',
          );
        } else {
          isPasswordValid = await this.passwordHasher.compare(
            validPassword.getValue(),
            foundUser.hashedPassword,
          );
        }

        if (!isPasswordValid) {
          throw Error(
            'authentication.resendEmailVerification.errors.invalidCredentials',
          );
        }
      } catch (error) {
        return this.outputPort.presentResendEmailVerificationResult({
          success: false,
          internalMessage: 'Error while comparing password hashes',
          errorCode:
            error.message ||
            'authentication.resendEmailVerification.errors.unknownError',
        });
      }

      if (foundUser.isEmailVerified) {
        throw Error(
          'authentication.resendEmailVerification.errors.emailAlreadyVerified',
        );
      }

      let emailVerificationTokenObj: IToken;
      try {
        const TOKEN_LENGTH = parseInt(
          process.env.EMAIL_VERIFICATION_TOKEN_LENGTH || '32',
        );
        const TOKEN_LIFETIME = parseInt(
          process.env.EMAIL_VERIFICATION_TOKEN_LIFETIME || '3600',
        );
        emailVerificationTokenObj = await this.tokenGenerator.generateToken(
          TOKEN_LENGTH,
          TOKEN_LIFETIME,
        );
      } catch (error) {
        return this.outputPort.presentResendEmailVerificationResult({
          success: false,
          internalMessage: 'Error generating email verification token',
          errorCode:
            error.message || 'authentication.register.errors.unknownError',
        });
      }

      try {
        await this.repository.updateEmailVerificationToken(
          foundUser.id,
          emailVerificationTokenObj.token,
          emailVerificationTokenObj.expiresAt,
        );
      } catch (error) {
        return this.outputPort.presentResendEmailVerificationResult({
          success: false,
          internalMessage:
            'Database Error while updating email verification token',
          errorCode:
            error.message || 'authentication.register.errors.unknownError',
        });
      }

      void this.notificationService
        .sendEmailVerificationMail(
          foundUser.email,
          emailVerificationTokenObj.token,
          requestModel.language,
        )
        .catch((err) => {
          console.error('Mail sending failed (async):', err);
        });

      return this.outputPort.presentResendEmailVerificationResult({
        success: true,
        internalMessage: 'New Code was sent to provided email',
        errorCode: null,
      });
    } catch (error) {
      return this.outputPort.presentResendEmailVerificationResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message ||
          'authentication.resendEmailVerification.errors.unexpectedError',
      });
    } finally {
      // Force same response time to avoid email collecting from an attacker
      await delay(Math.max(0, 3000 - (Date.now() - startTime)));
    }
  }
}
