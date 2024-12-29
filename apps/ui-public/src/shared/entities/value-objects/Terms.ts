export class Terms {
  private readonly isTermsAccepted: boolean;

  constructor(isTermsAccepted: boolean) {
    if (!this.isValid(isTermsAccepted)) {
      throw Error('authentication.registerUser.errors.invalidInput');
    }
    this.isTermsAccepted = isTermsAccepted;
  }

  private isValid(isTermsAccepted: boolean): boolean {
    return typeof isTermsAccepted === 'boolean';
  }

  getValue(): boolean {
    return this.isTermsAccepted;
  }
}
