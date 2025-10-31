/**
 * FHE Provider Component
 * Wrapper component for FHE context
 */

'use client';

import React, { createContext, useContext } from 'react';
import { useFHE } from '@/hooks/useFHE';

interface FHEContextType {
  fhevm: any;
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

const FHEContext = createContext<FHEContextType | null>(null);

export function FHEProvider({
  children,
  chainId = 11155111
}: {
  children: React.ReactNode;
  chainId?: number;
}) {
  const fheData = useFHE(chainId);

  return (
    <FHEContext.Provider value={fheData}>
      {children}
    </FHEContext.Provider>
  );
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}
