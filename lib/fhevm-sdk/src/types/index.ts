/**
 * Type definitions for FHEVM SDK
 */

import type { Provider } from 'ethers';

/**
 * FHEVM Configuration
 */
export interface FHEVMConfig {
  /** Chain ID for the network */
  chainId: number;

  /** Optional ethers provider */
  provider?: Provider | any;

  /** Optional gateway URL (auto-detected if not provided) */
  gatewayUrl?: string;

  /** Optional public key (fetched from gateway if not provided) */
  publicKey?: string;

  /** Optional KMS verifier URL */
  kmsVerifierUrl?: string;

  /** Optional ACL contract address */
  aclAddress?: string;
}

/**
 * Encryption module interface
 */
export interface EncryptionModule {
  /** Encrypt a uint8 value (0-255) */
  uint8(value: number): Promise<Uint8Array>;

  /** Encrypt a uint16 value */
  uint16(value: number): Promise<Uint8Array>;

  /** Encrypt a uint32 value */
  uint32(value: number): Promise<Uint8Array>;

  /** Encrypt a uint64 value */
  uint64(value: bigint): Promise<Uint8Array>;

  /** Encrypt a uint128 value */
  uint128(value: bigint): Promise<Uint8Array>;

  /** Encrypt a uint256 value */
  uint256(value: bigint): Promise<Uint8Array>;

  /** Encrypt an address */
  address(address: string): Promise<Uint8Array>;

  /** Encrypt a boolean */
  bool(value: boolean): Promise<Uint8Array>;

  /** Encrypt bytes */
  bytes(data: Uint8Array): Promise<Uint8Array>;
}

/**
 * Decryption request parameters
 */
export interface DecryptionRequest {
  contractAddress: string;
  handle: bigint;
  userAddress: string;
}

/**
 * Decryption module interface
 */
export interface DecryptionModule {
  /** Request decryption from KMS */
  request(params: DecryptionRequest): Promise<bigint>;

  /** Reencrypt for viewing by user */
  reencrypt(
    handle: bigint,
    contractAddress: string,
    userAddress: string
  ): Promise<bigint>;
}

/**
 * Contract interaction helpers
 */
export interface ContractModule {
  /** Create encrypted input for contract call */
  createInput(contractAddress: string, userAddress: string): any;

  /** Generate permission signature */
  generatePermission(
    contractAddress: string,
    userAddress: string
  ): Promise<string>;
}

/**
 * Main FHEVM interface
 */
export interface FHEVM {
  /** Encryption methods */
  encrypt: EncryptionModule;

  /** Decryption methods */
  decrypt: DecryptionModule;

  /** Contract interaction helpers */
  contract: ContractModule;

  /** Check if initialized */
  isReady: boolean;

  /** Get underlying fhevmjs instance */
  getInstance(): any;

  /** Get configuration */
  getConfig(): FHEVMConfig;
}

/**
 * Encrypted input builder
 */
export interface EncryptedInput {
  add8(value: number): EncryptedInput;
  add16(value: number): EncryptedInput;
  add32(value: number): EncryptedInput;
  add64(value: bigint): EncryptedInput;
  add128(value: bigint): EncryptedInput;
  add256(value: bigint): EncryptedInput;
  addAddress(address: string): EncryptedInput;
  addBool(value: boolean): EncryptedInput;
  encrypt(): Promise<{
    handles: Uint8Array[];
    inputProof: string;
  }>;
}

/**
 * Error types
 */
export class FHEVMError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FHEVMError';
  }
}

export class InitializationError extends FHEVMError {
  constructor(message: string) {
    super(message, 'INIT_ERROR');
    this.name = 'InitializationError';
  }
}

export class EncryptionError extends FHEVMError {
  constructor(message: string) {
    super(message, 'ENCRYPTION_ERROR');
    this.name = 'EncryptionError';
  }
}

export class DecryptionError extends FHEVMError {
  constructor(message: string) {
    super(message, 'DECRYPTION_ERROR');
    this.name = 'DecryptionError';
  }
}
