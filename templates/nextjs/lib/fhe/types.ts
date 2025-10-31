/**
 * FHE Type Definitions for the application
 */

export type FHEDataType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'bool'
  | 'address'
  | 'bytes';

export interface EncryptedData {
  data: Uint8Array;
  type: FHEDataType;
}

export interface ContractInputValue {
  type: FHEDataType;
  value: any;
}

export interface ContractInput {
  contractAddress: string;
  userAddress: string;
  values: ContractInputValue[];
}

export interface ContractInputResult {
  handles: string[];
  inputProof: string;
}

export interface DecryptionRequest {
  contractAddress: string;
  handle: bigint;
  userAddress: string;
  signature?: string;
}

export interface FHEVMConfig {
  chainId: number;
  provider?: any;
  gatewayUrl?: string;
  publicKey?: string;
  aclAddress?: string;
}

export interface FHEOperationResult {
  success: boolean;
  data?: any;
  error?: string;
}
