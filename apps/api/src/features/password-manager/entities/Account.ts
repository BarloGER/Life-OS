export class Account {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly accountName: string,
    public readonly username: string | null,
    public readonly email: string | null,
    public readonly encryptedPassword: string,
    public readonly passwordEncryptionIv: string,
    public readonly passwordEncryptionSalt: string,
    public readonly encryptedNotes: string | null,
    public readonly notesEncryptionIv: string | null,
    public readonly notesEncryptionSalt: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    id: number,
    userId: number,
    accountName: string,
    username: string | null,
    email: string | null,
    encryptedPassword: string,
    passwordEncryptionIv: string,
    passwordEncryptionSalt: string,
    encryptedNotes: string | null,
    notesEncryptionIv: string | null,
    notesEncryptionSalt: string | null,
    createdAt: Date,
    updatedAt: Date
  ): Account {
    return {
      id,
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
      createdAt,
      updatedAt,
    };
  }
}
