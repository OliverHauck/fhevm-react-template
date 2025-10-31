/**
 * FHE Type definitions for Next.js demo
 */

export type FHEType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'bool' | 'address';

export interface EncryptedValue {
  data: string;
  type: FHEType;
  timestamp?: number;
}

export interface DecryptedValue {
  value: number | bigint | boolean | string;
  type: FHEType;
}

export interface FHEOperation {
  type: 'encrypt' | 'decrypt' | 'compute';
  status: 'pending' | 'success' | 'error';
  timestamp: number;
  result?: any;
  error?: string;
}

export interface FHEContext {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  publicKey: string | null;
}

export default FHEContext;
