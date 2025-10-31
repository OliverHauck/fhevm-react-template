/**
 * FHE Key Management
 * Handles generation, storage, and management of FHE keys
 */

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  created: Date;
}

export interface KeyInfo {
  algorithm: string;
  keySize: number;
  created: string;
}

/**
 * Key Manager for FHE operations
 */
export class KeyManager {
  private static readonly STORAGE_KEY = 'fhe_keys';
  private static readonly PUBLIC_KEY_STORAGE = 'fhe_public_key';

  /**
   * Generate a new FHE key pair
   */
  static async generateKeyPair(): Promise<KeyPair> {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      const keyPair: KeyPair = {
        publicKey: data.publicKey,
        privateKey: data.privateKey,
        created: new Date(),
      };

      return keyPair;
    } catch (error) {
      throw new Error(`Key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Store keys in browser storage (localStorage)
   */
  static storeKeys(keyPair: KeyPair): void {
    if (typeof window === 'undefined') {
      throw new Error('Cannot store keys on server side');
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keyPair));
    } catch (error) {
      throw new Error(`Failed to store keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve keys from browser storage
   */
  static getStoredKeys(): KeyPair | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const keyPair = JSON.parse(stored);
      return {
        ...keyPair,
        created: new Date(keyPair.created),
      };
    } catch (error) {
      console.error('Failed to retrieve keys:', error);
      return null;
    }
  }

  /**
   * Clear stored keys
   */
  static clearKeys(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.PUBLIC_KEY_STORAGE);
    } catch (error) {
      console.error('Failed to clear keys:', error);
    }
  }

  /**
   * Get public key from server
   */
  static async getPublicKey(): Promise<string> {
    try {
      const response = await fetch('/api/keys', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      // Cache public key
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.PUBLIC_KEY_STORAGE, data.publicKey);
      }

      return data.publicKey;
    } catch (error) {
      throw new Error(`Failed to get public key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get cached public key
   */
  static getCachedPublicKey(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.PUBLIC_KEY_STORAGE);
  }

  /**
   * Rotate keys (generate new pair and invalidate old)
   */
  static async rotateKeys(): Promise<KeyPair> {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rotate' }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      // Generate and store new keys
      const newKeyPair = await this.generateKeyPair();
      this.storeKeys(newKeyPair);

      return newKeyPair;
    } catch (error) {
      throw new Error(`Key rotation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if keys need rotation (e.g., older than 30 days)
   */
  static shouldRotateKeys(keyPair: KeyPair, maxAgeDays: number = 30): boolean {
    const now = new Date();
    const ageInDays = (now.getTime() - keyPair.created.getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays >= maxAgeDays;
  }
}

export default KeyManager;
