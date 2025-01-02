export class Terms {
  private readonly isTermsAccepted: boolean;

  constructor(isTermsAccepted: boolean) {
    if (typeof isTermsAccepted !== 'boolean') {
      throw new Error('valueObjects.terms.notBoolean');
    }
    if (!isTermsAccepted) {
      throw new Error('valueObjects.terms.notAccepted');
    }
    this.isTermsAccepted = isTermsAccepted;
  }

  getValue(): boolean {
    return this.isTermsAccepted;
  }
}
