import { INotificationService } from '@shared/services/index';
import { IToken } from '@shared/utils/token-generator/ITokenGenerator';
import { IPasswordHasher, ITokenGenerator } from '@shared/utils/index';

import {
  Username,
  Email,
  Password,
  Newsletter,
  Terms,
  User,
} from '@shared/entities/index';

import { TPublicRegisterRequestModel } from './TPublicRegisterModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicRegisterUsecase {
  constructor(
    private readonly notificationService: INotificationService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,

    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort
  ) {}

  async registerUser(requestModel: TPublicRegisterRequestModel): Promise<void> {
    try {
      let validUsername: Username,
        validEmail: Email,
        validPassword: Password,
        newsletterAccepted: Newsletter,
        termsAcceptedAt: Terms;
      try {
        validUsername = new Username(requestModel.username);
        validEmail = new Email(requestModel.email);
        validPassword = Password.createForRegistration(requestModel.password);
        newsletterAccepted = new Newsletter(requestModel.isNewsletterAccepted);
        termsAcceptedAt = new Terms(requestModel.isTermsAccepted);
      } catch (error) {
        return this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Validation error occurred in entities',
          errorCode:
            error.message || 'authentication.register.errors.unknownError',
          user: null,
        });
      }

      let hashedPassword: string;
      try {
        hashedPassword = await this.passwordHasher.hash(
          validPassword.getValue()
        );
      } catch (error) {
        return this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Password hashing failed',
          errorCode:
            error.message || 'authentication.register.errors.unknownError',
          user: null,
        });
      }

      let emailVerificationTokenObj: IToken;
      try {
        const TOKEN_LENGTH = parseInt(
          process.env.EMAIL_VERIFICATION_TOKEN_LENGTH || '32'
        );
        const TOKEN_LIFETIME = parseInt(
          process.env.EMAIL_VERIFICATION_TOKEN_LIFETIME || '3600'
        );
        emailVerificationTokenObj = await this.tokenGenerator.generateToken(
          TOKEN_LENGTH,
          TOKEN_LIFETIME
        );
      } catch (error) {
        return this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Error generating email verification token',
          errorCode:
            error.message || 'authentication.register.errors.unknownError',
          user: null,
        });
      }

      let user: User;
      try {
        user = await this.repository.createUser(
          validUsername.getValue(),
          validEmail.getValue(),
          emailVerificationTokenObj.token,
          emailVerificationTokenObj.expiresAt,
          hashedPassword,
          newsletterAccepted.getValue(),
          termsAcceptedAt.getDate()
        );
      } catch (error) {
        return this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Database error while creating user',
          errorCode:
            error.message || 'authentication.register.errors.unknownError',
          user: null,
        });
      }

      try {
        await this.notificationService.sendEmailVerificationMail(
          user.email,
          user.emailVerificationToken
        );
      } catch (error) {
        // No return, to proceed with success message, because user is already created
        this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Error while sending verification mail',
          errorCode:
            error.message || 'authentication.register.errors.unknownError',
          user: null,
        });
      }

      return this.outputPort.presentRegistrationResult({
        success: true,
        internalMessage: 'User successfully registered',
        errorCode: null,
        user: user,
      });
    } catch (error) {
      return this.outputPort.presentRegistrationResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode:
          error.message || 'authentication.register.errors.unexpectedError',
        user: null,
      });
    }
  }
}
