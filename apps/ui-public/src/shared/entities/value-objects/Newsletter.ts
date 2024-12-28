export class Newsletter {
  private readonly isNewsletterAccepted: boolean;

  constructor(isNewsletterAccepted: boolean) {
    if (!this.isValid(isNewsletterAccepted)) {
      throw Error('authentication.registerUser.errors.invalidInput');
    }
    this.isNewsletterAccepted = isNewsletterAccepted;
  }

  private isValid(isNewsletterAccepted: boolean): boolean {
    return typeof isNewsletterAccepted === 'boolean';
  }

  getValue(): boolean {
    return this.isNewsletterAccepted;
  }
}
