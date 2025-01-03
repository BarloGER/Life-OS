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

  static evaluateStrength(password: string): string {
    const lengthScore =
      password.length >= 12 ? 2 : password.length >= 8 ? 1 : 0;
    const hasUpperCase = /[A-Z]/.test(password) ? 1 : 0;
    const hasLowerCase = /[a-z]/.test(password) ? 1 : 0;
    const hasNumber = /[0-9]/.test(password) ? 1 : 0;
    const hasSpecialChar = /[@$!%*?&#^()_\-+=]/.test(password) ? 1 : 0;

    const strengthScore =
      lengthScore + hasUpperCase + hasLowerCase + hasNumber + hasSpecialChar;

    if (strengthScore <= 2) return 'Weak';
    if (strengthScore === 3) return 'Moderate';
    return 'Strong';
  }
}
