// For optional data
export class Username {
  private readonly username: string;

  constructor(username: string) {
    // Erlaubt: username ist null
    if (username === '') {
      this.username = null;
      return;
    }

    if (typeof username !== 'string') {
      throw new Error('valueObjects.username.invalidType');
    }

    if (username.length > 50) {
      throw new Error('valueObjects.username.tooLong');
    }

    const forbiddenCharacters = /['";\-/*\\]/;
    if (forbiddenCharacters.test(username)) {
      throw new Error('valueObjects.username.illegalCharacters');
    }

    this.username = username;
  }

  getValue(): string | null {
    return this.username;
  }
}
