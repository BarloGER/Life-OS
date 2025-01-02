export class Password {
  private readonly password: string;

  private constructor(password: string) {
    this.password = password;
  }

  static createForRegistration(password: string): Password {
    if (typeof password !== 'string') {
      throw new Error('valueObjects.password.notAString');
    }
    if (password.length < 8) {
      throw new Error('valueObjects.password.tooShort');
    }
    if (password.length > 128) {
      throw new Error('valueObjects.password.tooLong');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('valueObjects.password.noUppercase');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('valueObjects.password.noLowercase');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('valueObjects.password.noNumber');
    }
    const specialCharacters = '@$!%*?&#^()_-+=';
    if (![...password].some((char) => specialCharacters.includes(char))) {
      throw new Error('valueObjects.password.noSpecialChar');
    }

    return new Password(password);
  }

  static createForLogin(password: string): Password {
    if (typeof password !== 'string') {
      throw new Error('valueObjects.password.notAString');
    }
    if (password.length < 8) {
      throw new Error('valueObjects.password.tooShort');
    }
    if (password.length > 128) {
      throw new Error('valueObjects.password.tooLong');
    }

    return new Password(password);
  }

  getValue(): string {
    return this.password;
  }
}
