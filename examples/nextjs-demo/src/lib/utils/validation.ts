/**
 * Validation utilities
 * Provides validation functions for FHE operations and user input
 */

import { FHEType } from '../fhe/types';

/**
 * Validate FHE type
 */
export function isValidFHEType(type: string): type is FHEType {
  const validTypes: FHEType[] = [
    'uint8',
    'uint16',
    'uint32',
    'uint64',
    'uint128',
    'uint256',
    'bool',
    'address',
  ];
  return validTypes.includes(type as FHEType);
}

/**
 * Validate value for specific FHE type
 */
export function isValidValueForType(value: any, type: FHEType): boolean {
  switch (type) {
    case 'bool':
      return typeof value === 'boolean';

    case 'address':
      return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);

    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'uint64':
    case 'uint128':
    case 'uint256':
      try {
        const num = BigInt(value);
        const maxValues: Record<string, bigint> = {
          uint8: 255n,
          uint16: 65535n,
          uint32: 4294967295n,
          uint64: 18446744073709551615n,
          uint128: (1n << 128n) - 1n,
          uint256: (1n << 256n) - 1n,
        };
        return num >= 0n && num <= maxValues[type];
      } catch {
        return false;
      }

    default:
      return false;
  }
}

/**
 * Validate encryption input
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEncryptionInput(
  value: any,
  type?: string
): ValidationResult {
  if (value === undefined || value === null) {
    return { valid: false, error: 'Value cannot be undefined or null' };
  }

  if (type && !isValidFHEType(type)) {
    return { valid: false, error: `Invalid FHE type: ${type}` };
  }

  if (type && !isValidValueForType(value, type as FHEType)) {
    return {
      valid: false,
      error: `Value ${value} is not valid for type ${type}`,
    };
  }

  return { valid: true };
}

/**
 * Validate decryption input
 */
export function validateDecryptionInput(encryptedData: string): ValidationResult {
  if (!encryptedData || typeof encryptedData !== 'string') {
    return { valid: false, error: 'Encrypted data must be a non-empty string' };
  }

  // Check if it's valid base64
  try {
    const decoded = Buffer.from(encryptedData, 'base64').toString('base64');
    if (decoded !== encryptedData) {
      return { valid: false, error: 'Invalid base64 encoded data' };
    }
  } catch {
    return { valid: false, error: 'Invalid encrypted data format' };
  }

  return { valid: true };
}

/**
 * Validate computation operation
 */
export function validateComputationOperation(
  operation: string
): ValidationResult {
  const validOperations = [
    'add',
    'subtract',
    'multiply',
    'divide',
    'compare',
    'and',
    'or',
    'xor',
    'not',
  ];

  if (!validOperations.includes(operation)) {
    return {
      valid: false,
      error: `Invalid operation: ${operation}. Valid operations are: ${validOperations.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate computation operands
 */
export function validateComputationOperands(
  operation: string,
  operands: any[]
): ValidationResult {
  if (!Array.isArray(operands)) {
    return { valid: false, error: 'Operands must be an array' };
  }

  const requiredOperands: Record<string, number> = {
    add: 2,
    subtract: 2,
    multiply: 2,
    divide: 2,
    compare: 2,
    and: 2,
    or: 2,
    xor: 2,
    not: 1,
  };

  const required = requiredOperands[operation];
  if (required !== undefined && operands.length !== required) {
    return {
      valid: false,
      error: `Operation ${operation} requires exactly ${required} operand(s), got ${operands.length}`,
    };
  }

  if (operands.length === 0) {
    return { valid: false, error: 'At least one operand is required' };
  }

  return { valid: true };
}

/**
 * Validate wallet address
 */
export function validateWalletAddress(address: string): ValidationResult {
  if (!address || typeof address !== 'string') {
    return { valid: false, error: 'Address must be a non-empty string' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}

/**
 * Validate chain ID
 */
export function validateChainId(chainId: any): ValidationResult {
  const id = Number(chainId);

  if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return { valid: false, error: 'Chain ID must be a positive integer' };
  }

  return { valid: true };
}

/**
 * Validate transaction hash
 */
export function validateTransactionHash(hash: string): ValidationResult {
  if (!hash || typeof hash !== 'string') {
    return { valid: false, error: 'Transaction hash must be a non-empty string' };
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
    return { valid: false, error: 'Invalid transaction hash format' };
  }

  return { valid: true };
}

/**
 * Validate contract ABI
 */
export function validateContractABI(abi: any): ValidationResult {
  if (!Array.isArray(abi)) {
    return { valid: false, error: 'ABI must be an array' };
  }

  if (abi.length === 0) {
    return { valid: false, error: 'ABI cannot be empty' };
  }

  // Basic ABI structure validation
  for (const item of abi) {
    if (!item.type || typeof item.type !== 'string') {
      return { valid: false, error: 'Invalid ABI: each item must have a type' };
    }
  }

  return { valid: true };
}

/**
 * Sanitize and validate JSON input
 */
export function validateJSON(input: string): ValidationResult & { parsed?: any } {
  try {
    const parsed = JSON.parse(input);
    return { valid: true, parsed };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export default {
  isValidFHEType,
  isValidValueForType,
  validateEncryptionInput,
  validateDecryptionInput,
  validateComputationOperation,
  validateComputationOperands,
  validateWalletAddress,
  validateChainId,
  validateTransactionHash,
  validateContractABI,
  validateJSON,
};
