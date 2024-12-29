import {
  INotificationService,
  EmailVerificationMailResponse,
} from './INotificationService';

export class NotificationService implements INotificationService {
  async sendEmailVerificationMail(
    emailAddress: string,
    emailVerificationToken: string,
  ): Promise<EmailVerificationMailResponse> {
    try {
      console.log(
        `https://localhost:4200/verify-email?token=${emailVerificationToken}`,
      );

      return {
        success: true,
        message: `Email with email verification token ${emailVerificationToken} successfuly send to ${emailAddress}`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Error while sending email verification mail to ${emailAddress}`,
      };
    }
  }

  async sendPasswordResetMail(
    emailAddress: string,
    passwordResetToken: string,
  ): Promise<EmailVerificationMailResponse> {
    try {
      console.log(
        `Email with password reset token ${passwordResetToken} successfuly send to ${emailAddress}`,
      );

      return {
        success: true,
        message: `Email with password reset token ${passwordResetToken} successfuly send to ${emailAddress}`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Error while sending password reset mail to ${emailAddress}`,
      };
    }
  }

  async sendBlockNoticeMail(
    emailAddress: string,
  ): Promise<EmailVerificationMailResponse> {
    try {
      console.log(`Blocked user with email ${emailAddress}`);

      return {
        success: true,
        message: `Blocked user with email ${emailAddress}`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Error while blocking user with email ${emailAddress}`,
      };
    }
  }

  async sendUnblockNoticeMail(
    emailAddress: string,
  ): Promise<EmailVerificationMailResponse> {
    try {
      console.log(`Unblocked user with email ${emailAddress}`);

      return {
        success: true,
        message: `Unblocked user with email ${emailAddress}`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Error while unblocking user with email ${emailAddress}`,
      };
    }
  }
}
