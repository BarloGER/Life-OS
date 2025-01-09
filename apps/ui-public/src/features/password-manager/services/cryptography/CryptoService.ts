import {
  ICryptoService,
  EncryptedResult,
  DecryptedResult,
} from './ICryptoService';

export class CryptoService implements ICryptoService {
  private iterations = 100_000;
  private keyLength = 256;
  private hash = 'SHA-256';

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async deriveKey(
    masterPassword: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    const enc = new TextEncoder();

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(masterPassword),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.iterations,
        hash: this.hash,
      },
      keyMaterial,
      { name: 'AES-GCM', length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
    return key;
  }

  public async encrypt(
    masterPassword: string,
    plaintext: string
  ): Promise<EncryptedResult> {
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await this.deriveKey(masterPassword, salt);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      enc.encode(plaintext)
    );

    return {
      encryptedData: this.arrayBufferToBase64(ciphertext),
      iv: this.arrayBufferToBase64(iv.buffer),
      salt: this.arrayBufferToBase64(salt.buffer),
    };
  }

  public async decrypt(
    masterPassword: string,
    encryptedData: string,
    iv: string,
    salt: string
  ): Promise<DecryptedResult> {
    try {
      const dec = new TextDecoder();

      const saltBuffer = this.base64ToArrayBuffer(salt);
      const ivBuffer = this.base64ToArrayBuffer(iv);
      const ciphertextBuffer = this.base64ToArrayBuffer(encryptedData);

      const key = await this.deriveKey(
        masterPassword,
        new Uint8Array(saltBuffer)
      );

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(ivBuffer),
        },
        key,
        ciphertextBuffer
      );

      return {
        success: true,
        data: dec.decode(decrypted),
      };
    } catch (error) {
      console.error('Decryption failed:', error);
      return { success: false };
    }
  }
}
