/**
 * Validation Utilities
 * Input validation helpers
 */

import type { FHEDataType } from '@/types/fhe';

/**
 * Validate value for FHE type
 */
export function validateValueForType(
  value: any,
  type: FHEDataType
): { valid: boolean; error?: string } {
  switch (type) {
    case 'uint8':
      if (typeof value !== 'number' || value < 0 || value > 255) {
        return { valid: false, error: 'Value must be between 0 and 255' };
      }
      break;
    case 'uint16':
      if (typeof value !== 'number' || value < 0 || value > 65535) {
        return { valid: false, error: 'Value must be between 0 and 65535' };
      }
      break;
    case 'uint32':
      if (typeof value !== 'number' || value < 0 || value > 4294967295) {
        return { valid: false, error: 'Value must be between 0 and 4294967295' };
      }
      break;
    case 'bool':
      if (typeof value !== 'boolean') {
        return { valid: false, error: 'Value must be a boolean' };
      }
      break;
    case 'address':
      if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
        return { valid: false, error: 'Invalid Ethereum address' };
      }
      break;
  }
  return { valid: true };
}

/**
 * Validate API request
 */
export function validateRequest(body: any, requiredFields: string[]): {
  valid: boolean;
  error?: string;
} {
  for (const field of requiredFields) {
    if (!(field in body)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  return { valid: true };
}
