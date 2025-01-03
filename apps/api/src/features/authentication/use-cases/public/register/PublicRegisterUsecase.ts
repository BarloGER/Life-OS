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

import { IPublicRegisterInputPort } from './IPublicRegisterInputPort';
import { TPublicRegisterRequestModel } from './TPublicRegisterModels';
import { IPublicAuthenticationOutputPort } from '../IPublicAuthenticationOutputPort';
import { IPublicAuthenticationRepository } from '../IPublicAuthenticationRepository';

export class PublicRegisterUsecase implements IPublicRegisterInputPort {
  constructor(
    private readonly notificationService: INotificationService,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenGenerator: ITokenGenerator,

    private readonly repository: IPublicAuthenticationRepository,
    private readonly outputPort: IPublicAuthenticationOutputPort,
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
          validPassword.getValue(),
        );
      } catch (error) {
        console.error(error.message);
        return this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Password hashing failed',
          errorCode: 'authentication.register.errors.registrationFailed',
          user: null,
        });
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
        console.error(error.message);
        return this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Error generating email verification token',
          errorCode:
            error.message ||
            'authentication.register.errors.registrationFailed',
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
          termsAcceptedAt.getDate(),
        );
      } catch (error) {
        console.error(error.message);
        if (error.message.includes('usernameAlreadyExists')) {
          return this.outputPort.presentRegistrationResult({
            success: false,
            internalMessage: 'Username already exists.',
            errorCode: 'authentication.register.errors.usernameAlreadyExists',
            user: null,
          });
        } else if (error.message.includes('emailAlreadyExists'))
          // success is set to true so that an attacker cannot collect valid emails.
          return this.outputPort.presentRegistrationResult({
            success: true,
            internalMessage: 'Email already exists.',
            errorCode: null,
            user: null,
          });

        return this.outputPort.presentRegistrationResult({
          success: false,
          internalMessage: 'Database error while creating user',
          errorCode: 'authentication.register.errors.registrationFailed',
          user: null,
        });
      }

      // Fire and forget to avoid increased response times, that an attacker can use to guess valid used emails
      void this.notificationService
        .sendEmailVerificationMail(
          user.email,
          user.emailVerificationToken,
          requestModel.language,
        )
        .catch((err) => {
          console.error('Mail sending failed (async):', err);
        });

      return this.outputPort.presentRegistrationResult({
        success: true,
        internalMessage: 'User successfully registered',
        errorCode: null,
        user: user,
      });
    } catch (error) {
      console.error(error.message);
      return this.outputPort.presentRegistrationResult({
        success: false,
        internalMessage: 'Unexpected error in use case',
        errorCode: 'authentication.register.errors.registrationFailed',
        user: null,
      });
    }
  }
}
