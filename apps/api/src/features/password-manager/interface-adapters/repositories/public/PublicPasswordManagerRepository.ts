import { IPublicPasswordManagerRepository } from '@features/password-manager/use-cases/public';
import { Account, Vault } from '@features/password-manager/entities/index';

export class PublicPasswordManagerRepository
  implements IPublicPasswordManagerRepository
{
  constructor(private readonly dbClient) {}

  private mapRowToVault(row): Vault {
    return Vault.create(
      row.id,
      row.user_id,
      row.security_question,
      row.secret,
      row.encrypted_secret,
      row.secret_encryption_iv,
      row.secret_encryption_salt,
      row.created_at,
      row.updated_at
    );
  }

  private mapRowToAccount(row): Account {
    return Account.create(
      row.id,
      row.user_id,
      row.account_name,
      row.username,
      row.email,
      row.encrypted_password,
      row.password_encryption_iv,
      row.password_encryption_salt,
      row.encrypted_notes,
      row.notes_encryption_iv,
      row.notes_encryption_salt,
      row.created_at,
      row.updated_at
    );
  }

  async findVaultByUserId(userId: string): Promise<Vault> {
    try {
      const query = `SELECT * FROM password_manager_vaults WHERE user_id = $1`;
      const values = [userId];

      const result = await this.dbClient.query(query, values);
      if (result.rowCount === 0) {
        throw new Error('passwordManager.repository.errors.vaultNotFound');
      }

      const row = result.rows[0];
      return this.mapRowToVault(row);
    } catch (error) {
      if (error.message.includes('vaultNotFound')) {
        throw new Error(error.message);
      }

      throw new Error('passwordManager.repository.errors.databaseError');
    }
  }

  async createVault(
    userId: string,
    securityQuestion: string,
    secret: string,
    encryptedSecret: string,
    secretEncryptionIv: string,
    secretEncryptionSalt: string
  ): Promise<Vault> {
    try {
      const query = `
            INSERT INTO password_manager_vaults (
              user_id,
              security_question,
              secret,
              encrypted_secret,
              secret_encryption_iv,
              secret_encryption_salt,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING *`;

      const values = [
        userId,
        securityQuestion,
        secret,
        encryptedSecret,
        secretEncryptionIv,
        secretEncryptionSalt,
      ];

      const result = await this.dbClient.query(query, values);

      const row = result.rows[0];
      return this.mapRowToVault(row);
    } catch (error) {
      console.log(error);
      throw new Error('passwordManager.repository.errors.databaseError');
    }
  }

  async findAccountsByUserId(userId: string): Promise<Account[] | null> {
    try {
      const query = `SELECT * FROM password_manager_accounts WHERE user_id = $1`;
      const values = [userId];

      const result = await this.dbClient.query(query, values);

      if (result.rowCount === 0) {
        return null;
      }

      const accounts = result.rows.map((row) => this.mapRowToAccount(row));
      console.log('rep', accounts);
      return accounts;
    } catch (error) {
      console.error(error);

      throw new Error('passwordManager.repository.errors.databaseError');
    }
  }

  async createAccount(
    userId: string,
    accountName: string,
    username: string,
    email: string,
    encryptedPassword: string,
    passwordEncryptionIv: string,
    passwordEncryptionSalt: string,
    encryptedNotes: string | null,
    notesEncryptionIv: string | null,
    notesEncryptionSalt: string | null
  ): Promise<Account> {
    try {
      const query = `
            INSERT INTO password_manager_accounts (
              user_id,
              account_name,
              username,
              email,
              encrypted_password,
              password_encryption_iv,
              password_encryption_salt,
              encrypted_notes,
              notes_encryption_iv,
              notes_encryption_salt,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            RETURNING *`;

      const values = [
        userId,
        accountName,
        username,
        email,
        encryptedPassword,
        passwordEncryptionIv,
        passwordEncryptionSalt,
        encryptedNotes,
        notesEncryptionIv,
        notesEncryptionSalt,
      ];

      const result = await this.dbClient.query(query, values);

      const row = result.rows[0];
      return this.mapRowToAccount(row);
    } catch (error) {
      console.log(error);
      throw new Error('passwordManager.repository.errors.databaseError');
    }
  }

  async editAccount(
    id: string,
    userId: string,
    updates: Partial<{
      accountName: string;
      username: string;
      email: string;
      encryptedPassword: string;
      passwordEncryptionIv: string;
      passwordEncryptionSalt: string;
      encryptedNotes: string | null;
      notesEncryptionIv: string | null;
      notesEncryptionSalt: string | null;
    }>
  ): Promise<Account> {
    console.log({ id, userId, updates });
    try {
      const fieldMap = {
        accountName: 'account_name',
        username: 'username',
        email: 'email',
        encryptedPassword: 'encrypted_password',
        passwordEncryptionIv: 'password_encryption_iv',
        passwordEncryptionSalt: 'password_encryption_salt',
        encryptedNotes: 'encrypted_notes',
        notesEncryptionIv: 'notes_encryption_iv',
        notesEncryptionSalt: 'notes_encryption_salt',
      };

      const dbUpdates: Record<string, any> = {};

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && fieldMap[key]) {
          dbUpdates[fieldMap[key]] = value;
        }
      });

      if (Object.keys(dbUpdates).length === 0) {
        throw new Error('passwordManager.repository.errors.noFieldsToUpdate');
      }

      const updateFields = Object.entries(dbUpdates)
        .map(([dbKey], index) => `${dbKey} = $${index + 3}`)
        .join(', ');

      const query = `
        UPDATE password_manager_accounts
        SET ${updateFields}, updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;

      const values = [id, userId, ...Object.values(dbUpdates)];

      const result = await this.dbClient.query(query, values);

      if (result.rowCount === 0) {
        throw new Error('passwordManager.repository.errors.accountNotFound');
      }

      const row = result.rows[0];
      return this.mapRowToAccount(row);
    } catch (error) {
      console.error(error);
      if (error.message.includes('accountNotFound')) {
        throw new Error(error.message);
      }
      throw new Error('passwordManager.repository.errors.databaseError');
    }
  }
}
