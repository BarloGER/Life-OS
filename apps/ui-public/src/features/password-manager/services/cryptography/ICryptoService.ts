export type EncryptedResult = {
  encryptedData: string; // Base64-encoded Ciphertext
  iv: string; // Base64-encoded IV
  salt: string; // Base64-encoded Salt
};

export type DecryptedResult = {
  success: boolean;
  data?: string;
};

export interface ICryptoService {
  encrypt(masterPassword: string, plaintext: string): Promise<EncryptedResult>;
  decrypt(
    masterPassword: string,
    encryptedData: string,
    iv: string,
    salt: string
  ): Promise<DecryptedResult>;
}
