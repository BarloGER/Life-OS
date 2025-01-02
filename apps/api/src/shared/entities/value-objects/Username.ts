export class Username {
  private readonly username: string;

  constructor(username: string) {
    if (typeof username !== 'string') {
      throw new Error('valueObjects.username.notAString');
    }
    if (username.length < 3) {
      throw new Error('valueObjects.username.tooShort');
    }
    if (username.length > 30) {
      throw new Error('valueObjects.username.tooLong');
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(username)) {
      throw new Error('valueObjects.username.illegalCharacters');
    }
    this.username = username;
  }

  getValue(): string {
    return this.username;
  }
}
