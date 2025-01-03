export type EmailVerificationMailResponse = {
  success: boolean;
  message: string;
};

export interface INotificationService {
  sendEmailVerificationMail(
    emailAddress: string,
    emailVerificationToken: string,
    language: string,
  ): Promise<EmailVerificationMailResponse>;

  sendBlockNoticeMail(
    emailAddress: string,
    language: string,
  ): Promise<EmailVerificationMailResponse>;
  sendUnblockNoticeMail(
    emailAddress: string,
    language: string,
  ): Promise<EmailVerificationMailResponse>;
  sendPasswordResetMail(
    emailAddress: string,
    passwordResetToken: string,
    language: string,
  ): Promise<EmailVerificationMailResponse>;
}
