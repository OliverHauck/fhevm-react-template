/**
 * API Type definitions for Next.js demo
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptRequest {
  value: number | bigint | string;
  type?: string;
}

export interface EncryptResponse {
  encrypted: string;
  type: string;
  originalValue?: number | string;
}

export interface DecryptRequest {
  encryptedData: string;
  privateKey?: string;
}

export interface DecryptResponse {
  decrypted: number | string;
  type: string;
}

export interface ComputeRequest {
  operation: string;
  operands: number[] | string[];
}

export interface ComputeResponse {
  operation: string;
  encryptedResult: string;
  operandCount: number;
}

export interface KeysResponse {
  publicKey: string;
  privateKey?: string;
  keyInfo?: {
    algorithm: string;
    keySize: number;
    created: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export default APIResponse;
