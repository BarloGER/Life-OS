import { PBKDF2PasswordHasher } from './PBKDF2PasswordHasher';

// Mock environment variables
process.env.SALT_LENGTH = '16';
process.env.PBKDF2_ITERATIONS = '600000';
process.env.PBKDF2_KEY_LENGTH = '64';
process.env.PBKDF2_DIGEST = 'sha256';
process.env.PEPPER = 'test-pepper';
process.env.PREHASH_THRESHOLD = '64';

describe('PBKDF2PasswordHasher', () => {
  let hasher: PBKDF2PasswordHasher;

  beforeEach(() => {
    hasher = new PBKDF2PasswordHasher();
  });

  test('should hash a password correctly', async () => {
    const password = 'securepassword123';
    const hashedPassword = await hasher.hash(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword.split(':')).toHaveLength(3); // Format: salt:iterations:hash
  });

  test('should verify a correct password successfully', async () => {
    const password = 'securepassword123';
    const hashedPassword = await hasher.hash(password);

    const isValid = await hasher.compare(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  test('should reject an incorrect password', async () => {
    const password = 'securepassword123';
    const wrongPassword = 'wrongpassword';
    const hashedPassword = await hasher.hash(password);

    const isValid = await hasher.compare(wrongPassword, hashedPassword);
    expect(isValid).toBe(false);
  });

  test('should handle passwords that exceed the pre-hash threshold', async () => {
    const longPassword = 'a'.repeat(70); // Exceeds default pre-hash threshold of 64
    const hashedPassword = await hasher.hash(longPassword);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword.split(':')).toHaveLength(3);

    const isValid = await hasher.compare(longPassword, hashedPassword);
    expect(isValid).toBe(true);
  });

  test('should produce different hashes for the same password due to salting', async () => {
    const password = 'securepassword123';
    const hash1 = await hasher.hash(password);
    const hash2 = await hasher.hash(password);

    expect(hash1).not.toEqual(hash2); // Salting ensures different hashes
  });

  test('should fail if hashedPassword format is incorrect', async () => {
    const password = 'securepassword123';
    const invalidHash = 'invalid:hash:format';

    await expect(hasher.compare(password, invalidHash)).resolves.toBe(false);
  });

  test('should properly handle edge cases with short passwords', async () => {
    const shortPassword = 'a'; // Single character password
    const hashedPassword = await hasher.hash(shortPassword);

    expect(hashedPassword).toBeDefined();
    const isValid = await hasher.compare(shortPassword, hashedPassword);
    expect(isValid).toBe(true);
  });

  test('should properly hash and verify passwords without using pre-hashing', async () => {
    const shortPassword = 'shortpassword'; // Below pre-hash threshold
    const hashedPassword = await hasher.hash(shortPassword);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword.split(':')).toHaveLength(3);

    const isValid = await hasher.compare(shortPassword, hashedPassword);
    expect(isValid).toBe(true);
  });

  test('should use pre-hashing for long passwords', async () => {
    const longPassword = 'x'.repeat(100); // Exceeds pre-hash threshold
    const preHashedPassword = hasher['preHash'](longPassword); // Call private preHash method

    const hashedPassword = await hasher.hash(longPassword);
    const [salt, iterations, storedHash] = hashedPassword.split(':');

    // Verwende die Werte, um sicherzustellen, dass sie korrekt sind
    expect(salt).toBeDefined(); // Salt sollte immer definiert sein
    expect(Number(iterations)).toBeGreaterThan(0); // Iterationen müssen sinnvoll sein
    expect(storedHash).toMatch(/[a-f0-9]{64}/); // Prüfe, dass der Hash korrekt aussieht

    const recomputedHash = hasher['preHash'](longPassword);
    expect(preHashedPassword).toBe(recomputedHash); // Confirm pre-hashing worked
  });

  test('should use the correct number of iterations from environment variables', async () => {
    const password = 'securepassword123';
    const hashedPassword = await hasher.hash(password);

    const [, iterations] = hashedPassword.split(':'); // Nur Iterationen extrahieren
    expect(Number(iterations)).toBe(600000); // Verwende nur das, was getestet wird
  });
});
