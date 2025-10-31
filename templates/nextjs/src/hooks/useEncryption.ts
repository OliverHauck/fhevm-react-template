/**
 * useEncryption Hook
 * Specialized hook for encryption operations
 */

'use client';

import { useState, useCallback } from 'react';
import { useFHE } from './useFHE';

export interface UseEncryptionReturn {
  encrypt: (value: number | bigint, type?: string) => Promise<string | null>;
  isEncrypting: boolean;
  encryptedValue: string | null;
  error: string | null;
  clearEncrypted: () => void;
}

export function useEncryption(): UseEncryptionReturn {
  const { encrypt: fheEncrypt, isInitialized } = useFHE();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedValue, setEncryptedValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(
    async (value: number | bigint, type: string = 'uint32'): Promise<string | null> => {
      if (!isInitialized) {
        setError('FHE client not initialized');
        return null;
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const encrypted = await fheEncrypt(value, type);
        setEncryptedValue(encrypted);
        return encrypted;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        console.error('Encryption error:', err);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    [fheEncrypt, isInitialized]
  );

  const clearEncrypted = useCallback(() => {
    setEncryptedValue(null);
    setError(null);
  }, []);

  return {
    encrypt,
    isEncrypting,
    encryptedValue,
    error,
    clearEncrypted,
  };
}

export default useEncryption;
