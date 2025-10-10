/**
 * React Integration for FHEVM SDK
 * Provides hooks and components for easy React integration
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createFHEVM } from '../core/factory';
import type { FHEVM, FHEVMConfig } from '../types';

// ========== Context ==========

interface FHEVMContextValue {
  fhevm: FHEVM | null;
  loading: boolean;
  error: Error | null;
  isReady: boolean;
}

const FHEVMContext = createContext<FHEVMContextValue | null>(null);

// ========== Provider ==========

export interface FHEVMProviderProps {
  config: FHEVMConfig;
  children: React.ReactNode;
  onInit?: (fhevm: FHEVM) => void;
  onError?: (error: Error) => void;
  loadingComponent?: React.ReactNode;
}

export function FHEVMProvider({
  config,
  children,
  onInit,
  onError,
  loadingComponent = <div>Initializing FHEVM...</div>,
}: FHEVMProviderProps) {
  const [fhevm, setFhevm] = useState<FHEVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        setLoading(true);
        setError(null);

        const instance = await createFHEVM(config);

        if (!cancelled) {
          setFhevm(instance);
          onInit?.(instance);
        }
      } catch (err) {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error('Failed to initialize FHEVM');
          setError(error);
          onError?.(error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [config.chainId, config.gatewayUrl, config.publicKey]);

  const value: FHEVMContextValue = {
    fhevm,
    loading,
    error,
    isReady: fhevm?.isReady ?? false,
  };

  if (loading) {
    return <>{loadingComponent}</>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>FHEVM Initialization Error</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <FHEVMContext.Provider value={value}>
      {children}
    </FHEVMContext.Provider>
  );
}

// ========== Main Hook ==========

export function useFHEVM() {
  const context = useContext(FHEVMContext);

  if (!context) {
    throw new Error('useFHEVM must be used within FHEVMProvider');
  }

  return context.fhevm!;
}

// ========== Encryption Hook ==========

export interface UseEncryptResult {
  encrypt: <T extends keyof EncryptionModule>(
    value: any,
    type: T
  ) => Promise<Uint8Array>;
  encrypting: boolean;
  error: Error | null;
}

export function useEncrypt(): UseEncryptResult {
  const fhevm = useFHEVM();
  const [encrypting, setEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(
    async (value: any, type: keyof typeof fhevm.encrypt = 'uint8') => {
      setEncrypting(true);
      setError(null);

      try {
        const encrypted = await fhevm.encrypt[type](value);
        return encrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setEncrypting(false);
      }
    },
    [fhevm]
  );

  return { encrypt, encrypting, error };
}

// ========== Contract Hook ==========

export interface UseContractResult {
  createInput: (contractAddress: string, userAddress: string) => any;
  generatePermission: (contractAddress: string, userAddress: string) => Promise<string>;
  loading: boolean;
  error: Error | null;
}

export function useContract(): UseContractResult {
  const fhevm = useFHEVM();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createInput = useCallback(
    (contractAddress: string, userAddress: string) => {
      return fhevm.contract.createInput(contractAddress, userAddress);
    },
    [fhevm]
  );

  const generatePermission = useCallback(
    async (contractAddress: string, userAddress: string) => {
      setLoading(true);
      setError(null);

      try {
        const permission = await fhevm.contract.generatePermission(
          contractAddress,
          userAddress
        );
        return permission;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to generate permission');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fhevm]
  );

  return {
    createInput,
    generatePermission,
    loading,
    error,
  };
}

// ========== Decryption Hook ==========

export interface UseDecryptResult {
  requestDecryption: (params: {
    contractAddress: string;
    handle: bigint;
    userAddress: string;
  }) => Promise<bigint>;
  decrypting: boolean;
  error: Error | null;
}

export function useDecrypt(): UseDecryptResult {
  const fhevm = useFHEVM();
  const [decrypting, setDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestDecryption = useCallback(
    async (params: { contractAddress: string; handle: bigint; userAddress: string }) => {
      setDecrypting(true);
      setError(null);

      try {
        const decrypted = await fhevm.decrypt.request(params);
        return decrypted;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        throw error;
      } finally {
        setDecrypting(false);
      }
    },
    [fhevm]
  );

  return {
    requestDecryption,
    decrypting,
    error,
  };
}

// Export types
export type { FHEVM, FHEVMConfig } from '../types';
