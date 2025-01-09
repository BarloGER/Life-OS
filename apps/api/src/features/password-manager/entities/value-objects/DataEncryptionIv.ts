// For optional data
export class DataEncryptionIv {
  private readonly iv: string;

  constructor(iv: string) {
    if (iv === null) {
      this.iv = null;
      return;
    }

    if (typeof iv !== 'string') {
      throw new Error('valueObjects.iv.notAString');
    }

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(iv)) {
      throw new Error('valueObjects.iv.invalidBase64');
    }

    if (iv.length < 8 || iv.length > 48) {
      throw new Error('valueObjects.iv.lengthOutOfRange');
    }

    this.iv = iv;
  }

  getValue(): string {
    return this.iv;
  }
}
