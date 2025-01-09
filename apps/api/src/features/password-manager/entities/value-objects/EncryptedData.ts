// For optional data
export class EncryptedData {
  private readonly encryptedData: string | null;

  constructor(encryptedData: string | null) {
    if (encryptedData === null) {
      this.encryptedData = null;
      return;
    }

    if (typeof encryptedData !== 'string') {
      throw new Error('valueObjects.encryptedData.notAString');
    }

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    if (!base64Regex.test(encryptedData)) {
      throw new Error('valueObjects.encryptedData.invalidBase64');
    }

    if (encryptedData.length > 4096) {
      throw new Error('valueObjects.encryptedData.tooLong');
    }

    this.encryptedData = encryptedData;
  }

  getValue(): string {
    return this.encryptedData;
  }
}
