export class DecryptedAccount {
  public readonly id: number;
  public readonly accountName: string;
  public readonly username: string | null;
  public readonly email: string | null;
  public readonly decryptedPassword: string | null;
  public readonly decryptedNotes: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: number,
    accountName: string,
    username: string | null,
    email: string | null,
    decryptedPassword: string | null,
    decryptedNotes: string | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.accountName = accountName;
    this.username = username;
    this.email = email;
    this.decryptedPassword = decryptedPassword;
    this.decryptedNotes = decryptedNotes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
