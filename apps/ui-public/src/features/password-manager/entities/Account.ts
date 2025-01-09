export interface AccountProperties {
  id: number;
  userId: number;
  accountName: string;
  username: string | null;
  email: string | null;
  encryptedPassword: string;
  passwordEncryptionIv: string;
  passwordEncryptionSalt: string;
  encryptedNotes: string | null;
  notesEncryptionIv: string | null;
  notesEncryptionSalt: string | null;
  createdAt: Date;
  updatedAt: Date;

  decryptedPassword?: string;
  decryptedNotes?: string;
}

export class Account {
  public readonly id: number;
  public readonly userId: number;
  public readonly accountName: string;
  public readonly username: string | null;
  public readonly email: string | null;
  public readonly encryptedPassword: string;
  public readonly passwordEncryptionIv: string;
  public readonly passwordEncryptionSalt: string;
  public readonly encryptedNotes: string | null;
  public readonly notesEncryptionIv: string | null;
  public readonly notesEncryptionSalt: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public decryptedPassword?: string;
  public decryptedNotes?: string;

  constructor(properties: AccountProperties) {
    this.id = properties.id;
    this.userId = properties.userId;
    this.accountName = properties.accountName;
    this.username = properties.username;
    this.email = properties.email;
    this.encryptedPassword = properties.encryptedPassword;
    this.passwordEncryptionIv = properties.passwordEncryptionIv;
    this.passwordEncryptionSalt = properties.passwordEncryptionSalt;
    this.encryptedNotes = properties.encryptedNotes;
    this.notesEncryptionIv = properties.notesEncryptionIv;
    this.notesEncryptionSalt = properties.notesEncryptionSalt;
    this.createdAt = properties.createdAt;
    this.updatedAt = properties.updatedAt;
  }

  static createFromResponse(responseData: any): Account {
    return new Account({
      id: responseData.id,
      userId: responseData.userId,
      accountName: responseData.accountName,
      username: responseData.username,
      email: responseData.email,
      encryptedPassword: responseData.encryptedPassword,
      passwordEncryptionIv: responseData.passwordEncryptionIv,
      passwordEncryptionSalt: responseData.passwordEncryptionSalt,
      encryptedNotes: responseData.encryptedNotes,
      notesEncryptionIv: responseData.notesEncryptionIv,
      notesEncryptionSalt: responseData.notesEncryptionSalt,
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt,
    });
  }
}
