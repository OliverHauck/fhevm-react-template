/**
 * useEncryption Hook
 * Hook for encryption operations
 */

'use client';

import { useState } from 'react';
import { encryptValue } from '@/lib/fhe/client';
import type { FHEDataType, EncryptedData } from '@/types/fhe';

export function useEncryption() {
  const [encrypting, setEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EncryptedData | null>(null);

  const encrypt = async (
    value: number | bigint | boolean | string,
    type: FHEDataType
  ) => {
    try {
      setEncrypting(true);
      setError(null);
      const encrypted = await encryptValue(value, type);
      setResult(encrypted);
      return encrypted;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setEncrypting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    encrypt,
    encrypting,
    error,
    result,
    reset
  };
}
