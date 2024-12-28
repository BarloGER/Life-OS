export class Password {
  private readonly password: string;

  private constructor(password: string) {
    this.password = password;
  }

  /**
   * Erstellt ein Password-Objekt für die Registrierung nach strengen Anforderungen.
   */
  static createForRegistration(password: string): Password {
    if (!this.isValidForRegistration(password)) {
      throw new Error('valueObjects.password.invalidInput');
    }
    return new Password(password);
  }

  /**
   * Erstellt ein Password-Objekt für den Login nach minimalen Anforderungen.
   */
  static createForLogin(password: string): Password {
    if (!this.isValidForLogin(password)) {
      throw new Error('valueObjects.password.invalidInput');
    }
    return new Password(password);
  }

  /**
   * Validiert ein Passwort basierend auf allen Registrierungsanforderungen.
   */
  private static isValidForRegistration(password: string): boolean {
    return (
      this.isString(password) &&
      this.hasValidLength(password) &&
      this.hasUppercase(password) &&
      this.hasLowercase(password) &&
      this.hasNumber(password) &&
      this.hasSpecialCharacter(password)
    );
  }

  /**
   * Validiert ein Passwort basierend auf den minimalen Anforderungen für einen Login.
   */
  private static isValidForLogin(password: string): boolean {
    return this.isString(password) && this.hasValidLength(password);
  }

  private static isString(password: string): boolean {
    return typeof password === 'string';
  }

  private static hasValidLength(password: string): boolean {
    const minLength = 8;
    const maxLength = 128;
    return password.length >= minLength && password.length <= maxLength;
  }

  private static hasUppercase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  private static hasLowercase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  private static hasNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  private static hasSpecialCharacter(password: string): boolean {
    const specialCharacters = '@$!%*?&#^()_-+=';
    return [...password].some((char) => specialCharacters.includes(char));
  }

  getValue(): string {
    return this.password;
  }
}
