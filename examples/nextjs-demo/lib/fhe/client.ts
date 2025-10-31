/**
 * Client-side FHE Operations
 * Browser-side encryption and FHE operations using FHEVM SDK
 */

import { createFHEVM } from '@astral/fhevm-sdk';
import type { FHEDataType, EncryptedData, ContractInput, ContractInputResult } from '@/types/fhe';

let fhevmInstance: any = null;

/**
 * Initialize FHEVM SDK
 */
export async function initFHEVM(chainId: number = 11155111) {
  if (!fhevmInstance) {
    fhevmInstance = await createFHEVM({ chainId });
  }
  return fhevmInstance;
}

/**
 * Get FHEVM instance
 */
export function getFHEVM() {
  if (!fhevmInstance) {
    throw new Error('FHEVM not initialized. Call initFHEVM() first.');
  }
  return fhevmInstance;
}

/**
 * Encrypt a value using FHE
 */
export async function encryptValue(
  value: number | bigint | boolean | string,
  type: FHEDataType
): Promise<EncryptedData> {
  const fhevm = getFHEVM();

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
    case 'bytes':
      return await fhevm.encrypt.bytes(value as Uint8Array);
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Create encrypted contract input
 */
export async function createContractInput(
  input: ContractInput
): Promise<ContractInputResult> {
  const fhevm = getFHEVM();
  const contractInput = fhevm.contract.createInput(
    input.contractAddress,
    input.userAddress
  );

  // Add all values to the input
  for (const { type, value } of input.values) {
    switch (type) {
      case 'uint8':
        contractInput.add8(value);
        break;
      case 'uint16':
        contractInput.add16(value);
        break;
      case 'uint32':
        contractInput.add32(value);
        break;
      case 'uint64':
        contractInput.add64(BigInt(value));
        break;
      case 'bool':
        contractInput.addBool(value);
        break;
      case 'address':
        contractInput.addAddress(value);
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  // Encrypt and get proof
  const { handles, inputProof } = await contractInput.encrypt();

  return { handles, inputProof };
}

/**
 * Generate permission signature for decryption
 */
export async function generatePermission(
  contractAddress: string,
  userAddress: string,
  signer: any
): Promise<string> {
  const fhevm = getFHEVM();
  return await fhevm.generatePermission(contractAddress, userAddress, signer);
}
