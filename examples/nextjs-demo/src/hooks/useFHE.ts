/**
 * useFHE Hook
 * Main hook for FHE operations in React components
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { FHEClient } from '../lib/fhe/client';
import type { FHEConfig } from '../lib/fhe/types';

export interface UseFHEReturn {
  client: FHEClient | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  encrypt: (value: number | bigint, type?: string) => Promise<string>;
  decrypt: (encryptedData: string) => Promise<number>;
  compute: (operation: string, operands: number[]) => Promise<string>;
  getAccount: () => Promise<string | null>;
  init: () => Promise<void>;
}

export function useFHE(config: FHEConfig = { chainId: 11155111 }): UseFHEReturn {
  const [client, setClient] = useState<FHEClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const init = useCallback(async () => {
    if (isInitialized || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fheClient = new FHEClient(config);
      await fheClient.init();
      setClient(fheClient);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE client';
      setError(errorMessage);
      console.error('FHE initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config, isInitialized, isLoading]);

  const encrypt = useCallback(
    async (value: number | bigint, type: string = 'uint32'): Promise<string> => {
      if (!client || !isInitialized) {
        throw new Error('FHE client not initialized');
      }

      try {
        return await client.encrypt(value, type);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        throw err;
      }
    },
    [client, isInitialized]
  );

  const decrypt = useCallback(
    async (encryptedData: string): Promise<number> => {
      if (!client || !isInitialized) {
        throw new Error('FHE client not initialized');
      }

      try {
        return await client.decrypt(encryptedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Decryption failed';
        setError(errorMessage);
        throw err;
      }
    },
    [client, isInitialized]
  );

  const compute = useCallback(
    async (operation: string, operands: number[]): Promise<string> => {
      if (!client || !isInitialized) {
        throw new Error('FHE client not initialized');
      }

      try {
        return await client.compute(operation, operands);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed';
        setError(errorMessage);
        throw err;
      }
    },
    [client, isInitialized]
  );

  const getAccount = useCallback(async (): Promise<string | null> => {
    if (!client || !isInitialized) {
      return null;
    }

    try {
      return await client.getAccount();
    } catch (err) {
      console.error('Failed to get account:', err);
      return null;
    }
  }, [client, isInitialized]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!isInitialized && !isLoading && !error) {
      init();
    }
  }, [init, isInitialized, isLoading, error]);

  return {
    client,
    isInitialized,
    isLoading,
    error,
    encrypt,
    decrypt,
    compute,
    getAccount,
    init,
  };
}

export default useFHE;
