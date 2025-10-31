/**
 * Type definitions for FHE operations
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

export interface FHEConfig {
  chainId: number;
  publicKey?: string;
  privateKey?: string;
  contractAddress?: string;
  networkUrl?: string;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'and' | 'or' | 'xor';
  operands: EncryptedValue[];
  resultType?: FHEType;
}

export interface ComputationResult {
  result: EncryptedValue;
  gasUsed?: number;
  transactionHash?: string;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}

export interface FHETransaction {
  hash: string;
  from: string;
  to: string;
  data: string;
  gasLimit: number;
  gasPrice: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface FHEContract {
  address: string;
  abi: any[];
  methods: string[];
}

export interface EncryptionOptions {
  type?: FHEType;
  publicKey?: string;
  compact?: boolean;
}

export interface DecryptionOptions {
  privateKey?: string;
  verifyProof?: boolean;
}

export interface FHEProvider {
  encrypt: (value: any, options?: EncryptionOptions) => Promise<EncryptedValue>;
  decrypt: (encrypted: EncryptedValue, options?: DecryptionOptions) => Promise<DecryptedValue>;
  compute: (request: ComputationRequest) => Promise<ComputationResult>;
  getPublicKey: () => Promise<string>;
}

export default FHEProvider;
