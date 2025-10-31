/**
 * FHE Type Definitions
 * Fully Homomorphic Encryption types for Next.js application
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address' | 'bytes';

export interface EncryptedData {
  data: Uint8Array;
  handles: string[];
}

export interface EncryptionRequest {
  value: number | bigint | boolean | string;
  type: FHEDataType;
}

export interface EncryptionResponse {
  success: boolean;
  encrypted?: EncryptedData;
  error?: string;
}

export interface DecryptionRequest {
  handle: string;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptionResponse {
  success: boolean;
  decrypted?: number | bigint | boolean | string;
  error?: string;
}

export interface ComputationRequest {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  operand1: string; // handle
  operand2: string; // handle
}

export interface ComputationResponse {
  success: boolean;
  result?: string; // result handle
  error?: string;
}

export interface FHEKeys {
  publicKey: string;
  privateKey?: string;
}

export interface ContractInput {
  contractAddress: string;
  userAddress: string;
  values: Array<{
    type: FHEDataType;
    value: any;
  }>;
}

export interface ContractInputResult {
  handles: string[];
  inputProof: string;
}
