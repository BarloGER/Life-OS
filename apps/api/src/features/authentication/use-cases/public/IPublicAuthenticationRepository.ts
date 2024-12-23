import { User } from '@shared/entities/index';

export interface IPublicAuthenticationRepository {
  findUserById(userId: string): Promise<User>;
  findUserByEmail(email: string): Promise<User>;

  createUser(
    username: string,
    email: string,
    emailVerificationToken: string,
    emailVerificationTokenExpiresAt: Date,
    hashedPassword: string,
    isNewsletterAccepted: boolean,
    termsAcceptedAt: Date
  ): Promise<User>;

  incrementFailedLoginAttempts(userId: string): Promise<void>;
  resetFailedLoginAttempts(userId: string): Promise<void>;

  lockUserAccount(userId: string, durationInMinutes: number): Promise<void>;
  unlockUserAccount(userId: string): Promise<void>;

  findUserByEmailVerificationToken(token: string): Promise<User>;
  activateUserAccount(userId: string): Promise<void>;

  updateEmailVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void>;
}
