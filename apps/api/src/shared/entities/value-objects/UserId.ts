export class UserId {
  private readonly userId: string;

  constructor(userId: string) {
    if (!this.isValid(userId)) {
      throw new Error('authentication.errors.invalidInput');
    }
    this.userId = userId;
  }

  private isValid(userId: string): boolean {
    if (typeof userId !== 'string') {
      return false;
    }

    const maxLength = 36;
    const regex = /^[a-z0-9-]+$/;

    return userId.length <= maxLength && regex.test(userId);
  }

  getValue(): string {
    return this.userId;
  }
}
