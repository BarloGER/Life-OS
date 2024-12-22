import { IPublicAuthenticationRepository } from '@features/authentication/use-cases/public';
import { User } from '@shared/entities/index';

export class PublicAuthenticationRepository
  implements IPublicAuthenticationRepository
{
  constructor(private readonly dbClient) {}

  async createUser(
    username: string,
    email: string,
    emailVerificationToken: string,
    emailVerificationTokenExpiresAt: Date,
    hashedPassword: string,
    isNewsletterAllowed: boolean,
    termsAcceptedAt: Date
  ): Promise<User> {
    try {
      const query = `
    INSERT INTO users (
       username,
       email,
       email_verification_token,
       email_verification_token_expires_at,
       hashed_password,
       is_newsletter_allowed,
       terms_accepted_at,
       created_at,
       updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    RETURNING
       id,
       role,
       status,
       username,
       email,
       email_verification_token,
       email_verification_token_expires_at,
       email_failed_verification_attempts,
       hashed_password,
       failed_login_attempts,
       password_reset_token,
       password_reset_token_expires_at,
       password_reset_failed_verification_attempts,
       password_updated_at,
       locked_until,
       multi_factor_enabled,
       recovery_email,
       recovery_email_verification_token,
       recovery_email_verification_token_expires_at,
       recovery_email_failed_verification_attempts,
       phone_number,
       phone_number_verification_token,
       phone_number_verification_token_expires_at,
       phone_number_failed_verification_attempts,
       is_newsletter_allowed,
       terms_accepted_at,
       created_at,
       updated_at,
       is_email_verified,
       is_recovery_email_verified,
       is_phone_number_verified
`;

      const values = [
        username,
        email,
        emailVerificationToken,
        emailVerificationTokenExpiresAt,
        hashedPassword,
        isNewsletterAllowed,
        termsAcceptedAt,
      ];

      const result = await this.dbClient.query(query, values);
      const row = result.rows[0];

      const user = User.create(
        row.id,
        row.role,
        row.status,
        row.username,
        row.email,
        row.email_verification_token,
        row.email_verification_token_expires_at,
        row.email_failed_verification_attempts,
        row.hashed_password,
        row.failed_login_attempts,
        row.password_reset_token,
        row.password_reset_token_expires_at,
        row.password_reset_failed_verification_attempts,
        row.password_updated_at,
        row.locked_until,
        row.multi_factor_enabled,
        row.recovery_email,
        row.recovery_email_verification_token,
        row.recovery_email_verification_token_expires_at,
        row.recovery_email_failed_verification_attempts,
        row.phone_number,
        row.phone_number_verification_token,
        row.phone_number_verification_token_expires_at,
        row.phone_number_failed_verification_attempts,
        row.is_newsletter_allowed,
        row.terms_accepted_at,
        row.created_at,
        row.updated_at,
        row.is_email_verified,
        row.is_recovery_email_verified,
        row.is_phone_number_verified
      );

      return user;
    } catch (error) {
      console.log(error);
      // 23505 means postgresql unique constraint violation
      if (error.code === '23505') {
        throw new Error('authentication.register.errors.uniqueViolation');
      }

      throw new Error('authentication.register.errors.unknownError');
    }
  }
}
