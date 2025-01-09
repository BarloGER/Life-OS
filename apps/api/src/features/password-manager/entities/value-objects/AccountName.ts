export class AccountName {
  private readonly accountName: string;

  constructor(accountName: string) {
    if (typeof accountName !== 'string') {
      throw new Error('valueObjects.accountName.notAString');
    }

    if (accountName.length < 1) {
      throw new Error('valueObjects.accountName.tooShort');
    }
    if (accountName.length > 100) {
      throw new Error('valueObjects.accountName.tooLong');
    }

    this.accountName = accountName;
  }

  getValue(): string {
    return this.accountName;
  }
}
