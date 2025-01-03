export class Token {
  private readonly token: string;

  constructor(token: string) {
    if (typeof token !== 'string') {
      throw new Error('valueObjects.token.notAString');
    }

    if (token.length < 8) {
      throw new Error('valueObjects.token.tooShort');
    }

    if (token.length > 32) {
      throw new Error('valueObjects.token.tooLong');
    }

    const regex = /^[A-Z0-9]+$/;
    if (!regex.test(token)) {
      throw new Error('valueObjects.token.invalidCharacters');
    }

    this.token = token;
  }

  getValue(): string {
    return this.token;
  }
}
