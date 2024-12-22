import { randomBytes, pbkdf2Sync, createHash } from 'crypto';
import { IPasswordHasher } from './IPasswordHasher';

export class PBKDF2PasswordHasher implements IPasswordHasher {
  private readonly saltLength = parseInt(process.env.SALT_LENGTH || '16', 10); // Salt length in bytes
  private readonly iterations = parseInt(
    process.env.PBKDF2_ITERATIONS || '600000',
    10
  ); // Number of PBKDF2 iterations
  private readonly keyLength = parseInt(
    process.env.PBKDF2_KEY_LENGTH || '64',
    10
  ); // Length of the derived hash
  private readonly digest = process.env.PBKDF2_DIGEST || 'sha256'; // Hash algorithm
  private readonly pepper = process.env.PEPPER || ''; // Optional pepper for added security
  private readonly preHashThreshold = parseInt(
    process.env.PREHASH_THRESHOLD || '64',
    10
  ); // Password length threshold for pre-hashing

  async hash(password: string): Promise<string> {
    // Apply pre-hashing if the password exceeds the threshold length
    if (password.length > this.preHashThreshold) {
      password = this.preHash(password);
    }

    const salt = randomBytes(this.saltLength).toString('hex');

    const hash = pbkdf2Sync(
      password + this.pepper,
      salt,
      this.iterations,
      this.keyLength,
      this.digest
    ).toString('hex');

    // Return the salt, iterations, and hash in a single string
    return `${salt}:${this.iterations}:${hash}`;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const parts = hashedPassword.split(':');
    if (parts.length !== 3 || isNaN(Number(parts[1]))) {
      // Invalid format
      return false;
    }

    // Extract the components of the stored hash
    const [salt, iterations, storedHash] = hashedPassword.split(':');

    // Apply pre-hashing if the password length exceeds the threshold
    if (password.length > this.preHashThreshold) {
      password = this.preHash(password);
    }

    // Recalculate the hash using the same salt and iterations
    const hash = pbkdf2Sync(
      password + this.pepper,
      salt,
      parseInt(iterations, 10),
      this.keyLength,
      this.digest
    ).toString('hex');

    return hash === storedHash;
  }

  preHash(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
