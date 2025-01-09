export class Secret {
  private readonly secret: string;

  constructor(secret: string) {
    if (typeof secret !== 'string') {
      throw new Error('valueObjects.secret.notAString');
    }

    if (secret.length < 1) {
      throw new Error('valueObjects.secret.tooShort');
    }
    if (secret.length > 1024) {
      throw new Error('valueObjects.secret.tooLong');
    }

    this.secret = secret;
  }

  getValue(): string {
    return this.secret;
  }
}
