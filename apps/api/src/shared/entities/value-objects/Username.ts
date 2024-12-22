export class Username {
  private readonly username: string;

  constructor(username: string) {
    if (!this.isValid(username)) {
      throw new Error('authentication.registerUser.errors.invalidInput');
    }
    this.username = username;
  }

  private isValid(username: string): boolean {
    if (typeof username !== 'string') {
      return false;
    }

    const minLength = 3;
    const maxLength = 30;
    const regex = /^[a-zA-Z0-9_-]+$/;

    return (
      username.length >= minLength &&
      username.length <= maxLength &&
      regex.test(username)
    );
  }

  getValue(): string {
    return this.username;
  }
}
