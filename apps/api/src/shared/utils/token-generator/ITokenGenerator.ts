export type IToken = {
  token: string;
  expiresAt: Date;
};

export interface ITokenGenerator {
  generateToken(length: number, lifetimeInMinutes: number): Promise<IToken>;
}
