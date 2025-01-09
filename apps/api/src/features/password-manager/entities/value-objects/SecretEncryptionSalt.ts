export class SecretEncryptionSalt {
  private readonly salt: string;

  constructor(salt: string) {
    if (typeof salt !== 'string') {
      throw new Error('valueObjects.salt.notAString');
    }

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(salt)) {
      throw new Error('valueObjects.salt.invalidBase64');
    }

    if (salt.length < 4 || salt.length > 128) {
      throw new Error('valueObjects.salt.lengthOutOfRange');
    }

    this.salt = salt;
  }

  getValue(): string {
    return this.salt;
  }
}
