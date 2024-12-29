import {
  INotificationService,
  EmailVerificationMailResponse,
} from './INotificationService';

export class NotificationService implements INotificationService {
  private readonly MAILSERVER_URL = process.env.MAILSERVER_URL;
  private readonly CLIENT_URL =
    process.env.CLIENT_URL || 'https://localhost:4200';

  private async sendMailRequest(mailData: {
    email: string;
    subject: string;
    html: string;
  }) {
    try {
      const response = await fetch(`${this.MAILSERVER_URL}/mail/send-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mailData.email,
          subject: mailData.subject,
          html: mailData.html,
        }),
      });

      return response.json();
    } catch (error) {
      console.error('sendMailRequest error:', error);
      return {
        success: false,
        message: 'Failed to call mail server',
      };
    }
  }

  /**
   * E-Mail-Verifikation
   */
  public async sendEmailVerificationMail(
    emailAddress: string,
    emailVerificationToken: string,
    language: string | 'en',
  ): Promise<EmailVerificationMailResponse> {
    try {
      // HTML & Betreff abhängig von Sprache
      const subject = this.getSubjectForVerification(language);
      const html = this.getHtmlForVerification(
        emailVerificationToken,
        language,
      );

      // Tatsächlich verschicken
      const response = await this.sendMailRequest({
        email: emailAddress,
        subject,
        html,
      });

      console.log(response);

      // Hier könntest du response success prüfen, z. B.:
      if (!response || response.success === false) {
        return {
          success: false,
          message: `Mailserver returned error: ${response.message || 'Unknown'}`,
        };
      }

      return {
        success: true,
        message: `Verification mail sent successfully to ${emailAddress}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: `Error while sending email verification mail to ${emailAddress}`,
      };
    }
  }

  /**
   * Passwort-Reset
   */
  public async sendPasswordResetMail(
    emailAddress: string,
    passwordResetToken: string,
    language: string | 'en',
  ): Promise<EmailVerificationMailResponse> {
    try {
      const subject = this.getSubjectForReset(language);
      const html = this.getHtmlForReset(passwordResetToken, language);

      const response = await this.sendMailRequest({
        email: emailAddress,
        subject,
        html,
      });

      if (!response || response.success === false) {
        return {
          success: false,
          message: `Mailserver returned error: ${response.message || 'Unknown'}`,
        };
      }

      return {
        success: true,
        message: `Password reset mail sent successfully to ${emailAddress}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: `Error while sending password reset mail to ${emailAddress}`,
      };
    }
  }

  public async sendBlockNoticeMail(
    emailAddress: string,
    language: string | 'en',
  ): Promise<EmailVerificationMailResponse> {
    try {
      const subject = this.getSubjectForBlock(language);
      const html = this.getHtmlForBlock(emailAddress, language);

      const response = await this.sendMailRequest({
        email: emailAddress,
        subject,
        html,
      });

      if (!response || response.success === false) {
        return {
          success: false,
          message: `Mailserver returned error: ${response.message || 'Unknown'}`,
        };
      }

      return {
        success: true,
        message: `Block notice mail sent successfully to ${emailAddress}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: `Error while blocking user with email ${emailAddress}`,
      };
    }
  }

  public async sendUnblockNoticeMail(
    emailAddress: string,
    language: string | 'en',
  ): Promise<EmailVerificationMailResponse> {
    try {
      const subject = this.getSubjectForUnblock(language);
      const html = this.getHtmlForUnblock(emailAddress, language);

      const response = await this.sendMailRequest({
        email: emailAddress,
        subject,
        html,
      });

      if (!response || response.success === false) {
        return {
          success: false,
          message: `Mailserver returned error: ${response.message || 'Unknown'}`,
        };
      }

      return {
        success: true,
        message: `Unblock notice mail sent successfully to ${emailAddress}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: `Error while unblocking user with email ${emailAddress}`,
      };
    }
  }

  private getSubjectForVerification(lang: string): string {
    return lang.startsWith('de')
      ? 'Deine E-Mail-Verifizierung'
      : 'Your Email Verification';
  }

  private getHtmlForVerification(token: string, lang: string): string {
    const verifyLink = `${this.CLIENT_URL}/verify-email?token=${token}`;
    if (lang.startsWith('de')) {
      return `
        <p>Hallo!</p>
        <p>Klicke bitte auf den folgenden Link, um deine E-Mail zu bestätigen:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
        <p>Viele Grüße</p>
      `;
    } else {
      return `
        <p>Hello!</p>
        <p>Please click the following link to verify your email:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
        <p>Best regards</p>
      `;
    }
  }

  private getSubjectForReset(lang: string): string {
    return lang.startsWith('de')
      ? 'Passwort zurücksetzen'
      : 'Reset your password';
  }

  private getHtmlForReset(token: string, lang: string): string {
    const resetLink = `${this.CLIENT_URL}/reset-password?token=${token}`;
    if (lang.startsWith('de')) {
      return `
        <p>Hallo!</p>
        <p>Klicke bitte auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Viele Grüße</p>
      `;
    } else {
      return `
        <p>Hello!</p>
        <p>Please click the following link to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Best regards</p>
      `;
    }
  }

  private getSubjectForBlock(lang: string): string {
    return lang.startsWith('de')
      ? 'Dein Konto wurde blockiert'
      : 'Your account has been blocked';
  }

  private getHtmlForBlock(emailAddress: string, lang: string): string {
    if (lang.startsWith('de')) {
      return `
        <p>Hallo!</p>
        <p>Dein Konto mit der E-Mail-Adresse ${emailAddress} wurde blockiert.</p>
        <p>Bitte kontaktiere den Support, falls du Fragen hast.</p>
      `;
    } else {
      return `
        <p>Hello!</p>
        <p>Your account associated with ${emailAddress} has been blocked.</p>
        <p>Please contact support if you have any questions.</p>
      `;
    }
  }

  private getSubjectForUnblock(lang: string): string {
    return lang.startsWith('de')
      ? 'Dein Konto wurde freigeschaltet'
      : 'Your account has been unblocked';
  }

  private getHtmlForUnblock(emailAddress: string, lang: string): string {
    if (lang.startsWith('de')) {
      return `
        <p>Hallo!</p>
        <p>Dein Konto mit der E-Mail-Adresse ${emailAddress} ist nun wieder freigeschaltet.</p>
        <p>Willkommen zurück!</p>
      `;
    } else {
      return `
        <p>Hello!</p>
        <p>Your account associated with ${emailAddress} is now unblocked.</p>
        <p>Welcome back!</p>
      `;
    }
  }
}
