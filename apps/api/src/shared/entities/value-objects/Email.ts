export class Email {
  private readonly email: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('authentication.registerUser.errors.invalidInput');
    }
    this.email = email;
  }

  private readonly dangerousCharacters = [
    '`',
    "'",
    '"',
    ';',
    ':',
    '<',
    '>',
    '\\',
    '/',
  ];

  private syntacticValidation(email: string): boolean {
    if (email.length > 254 || typeof email !== 'string') {
      return false;
    }

    if (this.dangerousCharacters.some((char) => email.includes(char))) {
      return false;
    }

    // Split into local and domain part, local part is everything before @
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) {
      return false;
    }

    if (localPart.length > 63) {
      return false;
    }

    // Domain contains only alphanumeric charcters, "." and "-"
    const domainRegex = /^[a-zA-Z0-9.-]+$/;
    if (!domainRegex.test(domain)) {
      return false;
    }

    // Check if domain is valid
    if (
      domain.startsWith('-') ||
      domain.endsWith('-') ||
      domain.includes('..')
    ) {
      return false;
    }

    return true;
  }

  private isValid(email: string): boolean {
    return this.syntacticValidation(email);
  }

  getValue(): string {
    return this.email;
  }
}
