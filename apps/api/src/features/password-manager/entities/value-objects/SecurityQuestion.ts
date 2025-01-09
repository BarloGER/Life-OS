export class SecurityQuestion {
  private readonly question: string;

  constructor(question: string) {
    if (typeof question !== 'string') {
      throw new Error('valueObjects.securityQuestion.notAString');
    }
    if (question.length < 3) {
      throw new Error('valueObjects.securityQuestion.tooShort');
    }
    if (question.length > 255) {
      throw new Error('valueObjects.securityQuestion.tooLong');
    }

    // const regex = /^[a-zA-Z0-9 ]+$/;
    // if (!regex.test(question)) {
    //   throw new Error('valueObjects.securityQuestion.illegalCharacters');
    // }

    this.question = question;
  }

  getValue(): string {
    return this.question;
  }
}
