import { IToken, ITokenGenerator } from './ITokenGenerator';

export class TokenGenerator implements ITokenGenerator {
  async generateToken(
    length: number,
    lifetimeInMinutes: number
  ): Promise<IToken> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + lifetimeInMinutes);

    return {
      token,
      expiresAt,
    };
  }
}
