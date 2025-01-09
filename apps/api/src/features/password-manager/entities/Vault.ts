export class Vault {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly securityQuestion: string,
    public readonly secret: string,
    public readonly encryptedSecret: string,
    public readonly secretEncryptionIv: string,
    public readonly secretEncryptionSalt: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    id: string,
    userId: string,
    securityQuestion: string,
    secret: string,
    encryptedSecret: string,
    secretEncryptionIv: string,
    secretEncryptionSalt: string,
    createdAt: Date,
    updatedAt: Date
  ): Vault {
    return {
      id,
      userId,
      securityQuestion,
      secret,
      encryptedSecret,
      secretEncryptionIv,
      secretEncryptionSalt,
      createdAt,
      updatedAt,
    };
  }
}
