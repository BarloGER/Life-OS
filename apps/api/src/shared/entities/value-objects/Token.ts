export class Token {
  private readonly token: string;

  constructor(token: string) {
    if (!this.isValid(token)) {
      throw new Error('authentication.verifyEmail.errors.invalidInput');
    }
    this.token = token;
  }

  private isValid(token: string): boolean {
    if (typeof token !== 'string') {
      return false;
    }

    const minLength = 8;
    const maxLength = 32;
    const regex = /^[A-Z0-9]+$/;

    return (
      token.length >= minLength &&
      token.length <= maxLength &&
      regex.test(token)
    );
  }

  getValue(): string {
    return this.token;
  }
}
