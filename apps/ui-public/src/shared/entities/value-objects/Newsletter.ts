export class Newsletter {
  private readonly isNewsletterAccepted: boolean;

  constructor(isNewsletterAccepted: boolean) {
    if (typeof isNewsletterAccepted !== 'boolean') {
      throw new Error('valueObjects.newsletter.notBoolean');
    }

    this.isNewsletterAccepted = isNewsletterAccepted;
  }

  getValue(): boolean {
    return this.isNewsletterAccepted;
  }
}
