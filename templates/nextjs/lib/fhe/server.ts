/**
 * Server-side FHE Operations
 * Node.js server-side FHE operations
 */

import { createFHEVM } from '@astral/fhevm-sdk';
import type { FHEDataType } from '@/types/fhe';

let serverFHEVM: any = null;

/**
 * Initialize server-side FHEVM
 */
export async function initServerFHEVM(chainId: number = 11155111) {
  if (!serverFHEVM) {
    serverFHEVM = await createFHEVM({ chainId });
  }
  return serverFHEVM;
}

/**
 * Server-side encryption
 */
export async function serverEncrypt(
  value: number | bigint | boolean | string,
  type: FHEDataType
) {
  const fhevm = serverFHEVM || await initServerFHEVM();

  switch (type) {
    case 'uint8':
      return await fhevm.encrypt.uint8(value as number);
    case 'uint16':
      return await fhevm.encrypt.uint16(value as number);
    case 'uint32':
      return await fhevm.encrypt.uint32(value as number);
    case 'uint64':
      return await fhevm.encrypt.uint64(BigInt(value));
    case 'bool':
      return await fhevm.encrypt.bool(value as boolean);
    case 'address':
      return await fhevm.encrypt.address(value as string);
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Batch encryption
 */
export async function batchEncrypt(
  items: Array<{ value: any; type: FHEDataType }>
) {
  const fhevm = serverFHEVM || await initServerFHEVM();
  const results = [];

  for (const item of items) {
    try {
      const encrypted = await serverEncrypt(item.value, item.type);
      results.push({
        success: true,
        type: item.type,
        value: item.value,
        encrypted
      });
    } catch (error: any) {
      results.push({
        success: false,
        type: item.type,
        value: item.value,
        error: error.message
      });
    }
  }

  return results;
}
