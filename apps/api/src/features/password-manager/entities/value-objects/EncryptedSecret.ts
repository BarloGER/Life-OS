export class EncryptedSecret {
  private readonly encryptedSecret: string;

  constructor(encryptedSecret: string) {
    if (typeof encryptedSecret !== 'string') {
      throw new Error('valueObjects.encryptedSecret.notAString');
    }

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    if (!base64Regex.test(encryptedSecret)) {
      throw new Error('valueObjects.encryptedSecret.invalidBase64');
    }

    if (encryptedSecret.length > 4096) {
      throw new Error('valueObjects.encryptedSecret.tooLong');
    }

    this.encryptedSecret = encryptedSecret;
  }

  getValue(): string {
    return this.encryptedSecret;
  }
}
