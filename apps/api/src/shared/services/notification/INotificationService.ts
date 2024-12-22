export type EmailVerificationMailResponse = {
  success: boolean;
  message: string;
};

export interface INotificationService {
  sendEmailVerificationMail(
    emailAddress: string,
    emailVerificationToken: string
  ): Promise<EmailVerificationMailResponse>;

  sendBlockNoticeMail(
    emailAddress: string
  ): Promise<EmailVerificationMailResponse>;
  sendUnblockNoticeMail(
    emailAddress: string
  ): Promise<EmailVerificationMailResponse>;
  sendPasswordResetMail(emailAddress: string, passwordResetToken: string);
}
