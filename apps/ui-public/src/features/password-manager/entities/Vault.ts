export interface VaultProperties {
  id: number;
  userId: number;
  securityQuestion: string;
  secret: string;
  encryptedSecret: string;
  secretEncryptionIv: string;
  secretEncryptionSalt: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Vault {
  public readonly id: number;
  public readonly userId: number;
  public readonly securityQuestion: string;
  public readonly secret: string;
  public readonly encryptedSecret: string;
  public readonly secretEncryptionIv: string;
  public readonly secretEncryptionSalt: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(properties: VaultProperties) {
    this.id = properties.id;
    this.userId = properties.userId;
    this.securityQuestion = properties.securityQuestion;
    this.secret = properties.secret;
    this.encryptedSecret = properties.encryptedSecret;
    this.secretEncryptionIv = properties.secretEncryptionIv;
    this.secretEncryptionSalt = properties.secretEncryptionSalt;
    this.createdAt = properties.createdAt;
    this.updatedAt = properties.updatedAt;
  }

  static createFromResponse(responseData: any): Vault {
    return new Vault({
      id: responseData.id,
      userId: responseData.userId,
      securityQuestion: responseData.securityQuestion,
      secret: responseData.secret,
      encryptedSecret: responseData.encryptedSecret,
      secretEncryptionIv: responseData.secretEncryptionIv,
      secretEncryptionSalt: responseData.secretEncryptionSalt,
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt,
    });
  }
}
