export class Terms {
  private readonly termsAcceptedAt: Date;

  constructor(termsAccepted: boolean) {
    if (typeof termsAccepted !== 'boolean') {
      throw new Error('valueObjects.terms.notBoolean');
    }
    if (!termsAccepted) {
      throw new Error('valueObjects.terms.notAccepted');
    }
    this.termsAcceptedAt = new Date();
  }

  getDate(): Date {
    return this.termsAcceptedAt;
  }
}
