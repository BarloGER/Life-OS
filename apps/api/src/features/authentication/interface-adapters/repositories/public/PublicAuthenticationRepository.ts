import { IPublicAuthenticationRepository } from '@features/authentication/use-cases/public';
import { User } from '@shared/entities/index';

export class PublicAuthenticationRepository
  implements IPublicAuthenticationRepository
{
  constructor(private readonly dbClient) {}

  private mapRowToUser(row): User {
    return User.create(
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
  }

  async findUserById(userId: string): Promise<User> {
    console.log('hello');
    console.log(userId);
    try {
      const query = `SELECT * FROM users WHERE id = $1`;
      const values = [userId];

      const result = await this.dbClient.query(query, values);
      if (result.rows.length === 0) {
        console.log(`No user found with id: ${userId}`);
        throw new Error('bad');
      }

      const row = result.rows[0];
      return this.mapRowToUser(row);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new Error('authentication.login.errors.uniqueViolation');
      }
      throw new Error('authentication.login.errors.unknownError');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const values = [email];

      const result = await this.dbClient.query(query, values);
      if (result.rows.length === 0) {
        console.log(`No user found with email: ${email}`);
        throw new Error('authentication.login.errors.invalidCredentials');
      }

      const row = result.rows[0];

      if (row.locked_until && row.locked_until >= new Date()) {
        throw Error('authentication.login.errors.accountLocked');
      }

      return this.mapRowToUser(row);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new Error('authentication.login.errors.uniqueViolation');
      }
      throw new Error('authentication.login.errors.unknownError');
    }
  }

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
      return this.mapRowToUser(row);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new Error('authentication.register.errors.uniqueViolation');
      }
      throw new Error('authentication.register.errors.unknownError');
    }
  }

  async incrementFailedLoginAttempts(userId: string): Promise<void> {
    const query = `UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1`;
    const result = await this.dbClient.query(query, [userId]);
    console.log(result);
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const query = `UPDATE users SET failed_login_attempts = 0 WHERE id = $1`;
    await this.dbClient.query(query, [userId]);
  }

  async lockUserAccount(
    userId: string,
    durationInMinutes: number
  ): Promise<void> {
    const lockedUntil = new Date(Date.now() + durationInMinutes * 60 * 1000);
    const query = `UPDATE users SET locked_until = $1 WHERE id = $2`;
    await this.dbClient.query(query, [lockedUntil, userId]);
  }

  async unlockUserAccount(userId: string): Promise<void> {
    const lockedUntil = null;
    const query = `UPDATE users SET locked_until = $1 WHERE id = $2`;
    await this.dbClient.query(query, [lockedUntil, userId]);
  }

  async findUserByEmailVerificationToken(token: string): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE email_verification_token = $1`;
      const values = [token];

      const result = await this.dbClient.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('authentication.verifyEmail.tokenDoesntExist');
      }
      const row = result.rows[0];

      return this.mapRowToUser(row);
    } catch (error) {
      if (error.message) {
        throw new Error('authentication.verifyEmail.errors.unknownError');
      }

      throw new Error('authentication.verifyEmail.errors.unknownError');
    }
  }

  async activateUserAccount(userId: string): Promise<void> {
    try {
      const query = `UPDATE users
                 SET status = 'active',
                     is_email_verified = true,
                     email_failed_verification_attempts = 0,
                     email_verification_token = null,
                     email_verification_token_expires_at = null
                     WHERE id = $1`;

      await this.dbClient.query(query, [userId]);
    } catch (error) {
      if (error.message) {
        throw new Error('authentication.verifyEmail.errors.unknownError');
      }

      throw new Error('authentication.verifyEmail.errors.unknownError');
    }
  }

  async updateEmailVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    const query = `UPDATE users SET email_verification_token = $1, email_verification_token_expires_at = $2 WHERE id = $3`;
    await this.dbClient.query(query, [token, expiresAt, userId]);
  }

  async updatePasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    const query = `UPDATE users SET password_reset_token = $1, password_reset_token_expires_at = $2 WHERE id = $3`;
    await this.dbClient.query(query, [token, expiresAt, userId]);
  }

  async findUserByPasswordResetToken(token: string): Promise<User> {
    try {
      const query = `SELECT * FROM users WHERE password_reset_token = $1`;
      const values = [token];

      const result = await this.dbClient.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('authentication.resetPassword.tokenDoesntExist');
      }
      const row = result.rows[0];

      return this.mapRowToUser(row);
    } catch (error) {
      if (error.message) {
        throw new Error('authentication.resetPassword.errors.unknownError');
      }

      throw new Error('authentication.resetPassword.errors.unknownError');
    }
  }

  async updateUserPassword(
    userId: string,
    hashedPassword: string
  ): Promise<void> {
    const query = `UPDATE users SET hashed_password = $1, password_updated_at = NOW() WHERE id = $2`;
    await this.dbClient.query(query, [hashedPassword, userId]);
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    const query = `UPDATE users SET password_reset_token = null, password_reset_token_expires_at = null WHERE id = $1`;
    await this.dbClient.query(query, [userId]);
  }
}
