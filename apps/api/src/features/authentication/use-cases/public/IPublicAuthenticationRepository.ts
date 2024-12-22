import { User } from '@shared/entities/index';

export interface IPublicAuthenticationRepository {
  createUser(
    username: string,
    email: string,
    emailVerificationToken: string,
    emailVerificationTokenExpiresAt: Date,
    hashedPassword: string,
    isNewsletterAccepted: boolean,
    termsAcceptedAt: Date
  ): Promise<User>;
}
