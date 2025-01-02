export class Email {
  private readonly email: string;

  constructor(email: string) {
    if (typeof email !== 'string') {
      throw new Error('valueObjects.email.notAString');
    }
    if (email.length > 254) {
      throw new Error('valueObjects.email.tooLong');
    }

    const dangerousCharacters = ['`', "'", '"', ';', ':', '<', '>', '\\', '/'];
    if (dangerousCharacters.some((char) => email.includes(char))) {
      throw new Error('valueObjects.email.illegalCharacters');
    }

    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) {
      throw new Error('valueObjects.email.invalidFormat');
    }
    if (localPart.length > 63) {
      throw new Error('valueObjects.email.invalidFormat');
    }
    const domainRegex = /^[a-zA-Z0-9.-]+$/;
    if (!domainRegex.test(domain)) {
      throw new Error('valueObjects.email.invalidFormat');
    }
    if (
      domain.startsWith('-') ||
      domain.endsWith('-') ||
      domain.includes('..')
    ) {
      throw new Error('valueObjects.email.invalidFormat');
    }

    this.email = email;
  }

  getValue(): string {
    return this.email;
  }
}
