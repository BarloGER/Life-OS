export interface UserProperties {
  id: string;
  role: string;
  status: string;
  username: string;
  email: string;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiresAt: Date | null;
  emailFailedVerificationAttempts: number;
  hashedPassword: string;
  failedLoginAttempts: number;
  passwordResetToken: string | null;
  passwordResetTokenExpiresAt: Date | null;
  passwordResetFailedVerificationAttempts: number;
  passwordUpdatedAt: Date | null;
  lockedUntil: Date | null;
  multiFactorEnabled: boolean;
  recoveryEmail: string | null;
  recoveryEmailVerificationToken: string | null;
  recoveryEmailVerificationTokenExpiresAt: Date | null;
  recoveryEmailFailedVerificationAttempts: number;
  phoneNumber: string | null;
  phoneNumberVerificationToken: string | null;
  phoneNumberVerificationTokenExpiresAt: Date | null;
  phoneNumberFailedVerificationAttempts: number;
  isNewsletterAllowed: boolean;
  termsAcceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  isRecoveryEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
}

export class User {
  public readonly id: string;
  public readonly role: string;
  public readonly status: string;
  public readonly username: string;
  public readonly email: string;

  public readonly emailVerificationToken: string | null;
  public readonly emailVerificationTokenExpiresAt: Date | null;
  public readonly emailFailedVerificationAttempts: number;
  public readonly hashedPassword: string;
  public readonly failedLoginAttempts: number;

  public readonly passwordResetToken: string | null;
  public readonly passwordResetTokenExpiresAt: Date | null;
  public readonly passwordResetFailedVerificationAttempts: number;
  public readonly passwordUpdatedAt: Date | null;
  public readonly lockedUntil: Date | null;

  public readonly multiFactorEnabled: boolean;
  public readonly recoveryEmail: string | null;
  public readonly recoveryEmailVerificationToken: string | null;
  public readonly recoveryEmailVerificationTokenExpiresAt: Date | null;
  public readonly recoveryEmailFailedVerificationAttempts: number;

  public readonly phoneNumber: string | null;
  public readonly phoneNumberVerificationToken: string | null;
  public readonly phoneNumberVerificationTokenExpiresAt: Date | null;
  public readonly phoneNumberFailedVerificationAttempts: number;

  public readonly isNewsletterAllowed: boolean;
  public readonly termsAcceptedAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public readonly isEmailVerified: boolean;
  public readonly isRecoveryEmailVerified: boolean;
  public readonly isPhoneNumberVerified: boolean;

  constructor(properties: UserProperties) {
    this.id = properties.id;
    this.role = properties.role;
    this.status = properties.status;
    this.username = properties.username;
    this.email = properties.email;

    this.emailVerificationToken = properties.emailVerificationToken;
    this.emailVerificationTokenExpiresAt =
      properties.emailVerificationTokenExpiresAt;
    this.emailFailedVerificationAttempts =
      properties.emailFailedVerificationAttempts;
    this.hashedPassword = properties.hashedPassword;
    this.failedLoginAttempts = properties.failedLoginAttempts;

    this.passwordResetToken = properties.passwordResetToken;
    this.passwordResetTokenExpiresAt = properties.passwordResetTokenExpiresAt;
    this.passwordResetFailedVerificationAttempts =
      properties.passwordResetFailedVerificationAttempts;
    this.passwordUpdatedAt = properties.passwordUpdatedAt;
    this.lockedUntil = properties.lockedUntil;

    this.multiFactorEnabled = properties.multiFactorEnabled;
    this.recoveryEmail = properties.recoveryEmail;
    this.recoveryEmailVerificationToken =
      properties.recoveryEmailVerificationToken;
    this.recoveryEmailVerificationTokenExpiresAt =
      properties.recoveryEmailVerificationTokenExpiresAt;
    this.recoveryEmailFailedVerificationAttempts =
      properties.recoveryEmailFailedVerificationAttempts;

    this.phoneNumber = properties.phoneNumber;
    this.phoneNumberVerificationToken = properties.phoneNumberVerificationToken;
    this.phoneNumberVerificationTokenExpiresAt =
      properties.phoneNumberVerificationTokenExpiresAt;
    this.phoneNumberFailedVerificationAttempts =
      properties.phoneNumberFailedVerificationAttempts;

    this.isNewsletterAllowed = properties.isNewsletterAllowed;
    this.termsAcceptedAt = properties.termsAcceptedAt;
    this.createdAt = properties.createdAt;
    this.updatedAt = properties.updatedAt;

    this.isEmailVerified = properties.isEmailVerified;
    this.isRecoveryEmailVerified = properties.isRecoveryEmailVerified;
    this.isPhoneNumberVerified = properties.isPhoneNumberVerified;
  }

  /**
   * Erstellt eine User-Instanz aus beliebigen Daten (z. B. einer HTTP-Response).
   * Hier kannst du bei Bedarf weitere Konvertierungen (z. B. Strings zu Date-Objekten) vornehmen.
   */
  static createFromResponse(responseData: any): User {
    return new User({
      id: responseData.id,
      role: responseData.role,
      status: responseData.status,
      username: responseData.username,
      email: responseData.email,

      emailVerificationToken: responseData.emailVerificationToken,
      emailVerificationTokenExpiresAt:
        responseData.emailVerificationTokenExpiresAt,
      emailFailedVerificationAttempts:
        responseData.emailFailedVerificationAttempts,
      hashedPassword: responseData.hashedPassword,
      failedLoginAttempts: responseData.failedLoginAttempts,

      passwordResetToken: responseData.passwordResetToken,
      passwordResetTokenExpiresAt: responseData.passwordResetTokenExpiresAt,
      passwordResetFailedVerificationAttempts:
        responseData.passwordResetFailedVerificationAttempts,
      passwordUpdatedAt: responseData.passwordUpdatedAt,
      lockedUntil: responseData.lockedUntil,

      multiFactorEnabled: responseData.multiFactorEnabled,
      recoveryEmail: responseData.recoveryEmail,
      recoveryEmailVerificationToken:
        responseData.recoveryEmailVerificationToken,
      recoveryEmailVerificationTokenExpiresAt:
        responseData.recoveryEmailVerificationTokenExpiresAt,
      recoveryEmailFailedVerificationAttempts:
        responseData.recoveryEmailFailedVerificationAttempts,

      phoneNumber: responseData.phoneNumber,
      phoneNumberVerificationToken: responseData.phoneNumberVerificationToken,
      phoneNumberVerificationTokenExpiresAt:
        responseData.phoneNumberVerificationTokenExpiresAt,
      phoneNumberFailedVerificationAttempts:
        responseData.phoneNumberFailedVerificationAttempts,

      isNewsletterAllowed: responseData.isNewsletterAllowed,
      termsAcceptedAt: responseData.termsAcceptedAt,
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt,

      isEmailVerified: responseData.isEmailVerified,
      isRecoveryEmailVerified: responseData.isRecoveryEmailVerified,
      isPhoneNumberVerified: responseData.isPhoneNumberVerified,
    });
  }
}
