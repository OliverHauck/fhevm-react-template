/**
 * useFHE Hook
 * Main hook for FHE operations
 */

'use client';

import { useState, useEffect } from 'react';
import { initFHEVM, getFHEVM } from '@/lib/fhe/client';

export function useFHE(chainId: number = 11155111) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        await initFHEVM(chainId);
        setInitialized(true);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setInitialized(false);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [chainId]);

  return {
    fhevm: initialized ? getFHEVM() : null,
    initialized,
    loading,
    error
  };
}
