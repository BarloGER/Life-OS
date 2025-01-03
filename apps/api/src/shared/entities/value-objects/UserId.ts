export class UserId {
  private readonly userId: string;

  constructor(userId: string) {
    if (typeof userId !== 'string') {
      throw new Error('valueObjects.userId.notAString');
    }
    if (userId.length > 36) {
      throw new Error('valueObjects.userId.tooLong');
    }
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(userId)) {
      throw new Error('valueObjects.userId.invalidCharacters');
    }
    this.userId = userId;
  }

  getValue(): string {
    return this.userId;
  }
}
