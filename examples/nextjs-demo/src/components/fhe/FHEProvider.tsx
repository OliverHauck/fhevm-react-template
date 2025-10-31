/**
 * FHE Provider Component
 * Provides FHE context to child components
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FHEClient } from '../../lib/fhe/client';
import type { FHEConfig } from '../../lib/fhe/types';

interface FHEContextType {
  client: FHEClient | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  publicKey: string | null;
  init: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export function FHEProvider({
  children,
  config = { chainId: 11155111 },
}: {
  children: ReactNode;
  config?: FHEConfig;
}) {
  const [client, setClient] = useState<FHEClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const init = async () => {
    if (isInitialized || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const fheClient = new FHEClient(config);
      await fheClient.init();
      setClient(fheClient);
      setIsInitialized(true);

      // Fetch public key
      try {
        const response = await fetch('/api/keys');
        const data = await response.json();
        if (data.success && data.publicKey) {
          setPublicKey(data.publicKey);
        }
      } catch (err) {
        console.warn('Failed to fetch public key:', err);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize FHE client';
      setError(errorMessage);
      console.error('FHE initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <FHEContext.Provider
      value={{
        client,
        isInitialized,
        isLoading,
        error,
        publicKey,
        init,
      }}
    >
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within a FHEProvider');
  }
  return context;
}

export default FHEProvider;
