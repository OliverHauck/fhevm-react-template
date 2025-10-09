# 📚 Universal FHEVM SDK - API Reference

Complete API documentation for the Universal FHEVM SDK.

---

## Table of Contents

- [Core API](#core-api)
- [React API](#react-api)
- [Vue API](#vue-api)
- [Node.js API](#nodejs-api)
- [Type Definitions](#type-definitions)

---

## Core API

### `createFHEVM(config)`

Initialize the FHEVM SDK instance.

**Parameters:**
- `config` (object, required):
  - `chainId` (number, required): Blockchain network ID (e.g., 11155111 for Sepolia)
  - `provider` (Provider, optional): Ethers.js provider instance
  - `gatewayUrl` (string, optional): Custom gateway URL for decryption
  - `publicKey` (string, optional): Custom public key for encryption

**Returns:** `Promise<FHEVMInstance>`

**Example:**
```typescript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({
  chainId: 11155111,
  provider: window.ethereum
});
```

---

## Encryption API

### `fhevm.encrypt`

Encryption utilities for different data types.

#### `fhevm.encrypt.uint8(value)`

Encrypt an unsigned 8-bit integer (0-255).

**Parameters:**
- `value` (number, required): Value to encrypt (0-255)

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt.uint8(42);
```

#### `fhevm.encrypt.uint16(value)`

Encrypt an unsigned 16-bit integer (0-65535).

**Parameters:**
- `value` (number, required): Value to encrypt (0-65535)

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt.uint16(1000);
```

#### `fhevm.encrypt.uint32(value)`

Encrypt an unsigned 32-bit integer (0 to 2^32-1).

**Parameters:**
- `value` (number, required): Value to encrypt

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt.uint32(1000000);
```

#### `fhevm.encrypt.uint64(value)`

Encrypt an unsigned 64-bit integer.

**Parameters:**
- `value` (bigint, required): BigInt value to encrypt

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt.uint64(1000000n);
```

#### `fhevm.encrypt.address(value)`

Encrypt an Ethereum address.

**Parameters:**
- `value` (string, required): Ethereum address (0x...)

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt.address('0x1234567890abcdef1234567890abcdef12345678');
```

#### `fhevm.encrypt.bool(value)`

Encrypt a boolean value.

**Parameters:**
- `value` (boolean, required): Boolean value to encrypt

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt.bool(true);
```

#### `fhevm.encrypt.bytes(value)`

Encrypt a byte array.

**Parameters:**
- `value` (Uint8Array, required): Byte array to encrypt

**Returns:** `Promise<EncryptedData>`

**Example:**
```typescript
const encrypted = await fhevm.encrypt.bytes(new Uint8Array([1, 2, 3]));
```

---

## Contract Integration API

### `fhevm.contract.createInput(contractAddress, userAddress)`

Create an encrypted input builder for contract interaction.

**Parameters:**
- `contractAddress` (string, required): Smart contract address
- `userAddress` (string, required): User's Ethereum address

**Returns:** `EncryptedInput`

**Example:**
```typescript
const input = fhevm.contract.createInput(
  '0x1234...',
  '0xabcd...'
);
```

### `EncryptedInput` Methods

#### `.add8(value)`

Add an encrypted uint8 to the input.

**Parameters:**
- `value` (number, required): Value (0-255)

**Returns:** `EncryptedInput` (chainable)

**Example:**
```typescript
input.add8(42);
```

#### `.add16(value)`

Add an encrypted uint16 to the input.

**Parameters:**
- `value` (number, required): Value (0-65535)

**Returns:** `EncryptedInput` (chainable)

**Example:**
```typescript
input.add16(1000);
```

#### `.add32(value)`

Add an encrypted uint32 to the input.

**Parameters:**
- `value` (number, required): Value

**Returns:** `EncryptedInput` (chainable)

**Example:**
```typescript
input.add32(1000000);
```

#### `.add64(value)`

Add an encrypted uint64 to the input.

**Parameters:**
- `value` (bigint, required): BigInt value

**Returns:** `EncryptedInput` (chainable)

**Example:**
```typescript
input.add64(1000000n);
```

#### `.addAddress(value)`

Add an encrypted address to the input.

**Parameters:**
- `value` (string, required): Ethereum address

**Returns:** `EncryptedInput` (chainable)

**Example:**
```typescript
input.addAddress('0x1234567890abcdef1234567890abcdef12345678');
```

#### `.addBool(value)`

Add an encrypted boolean to the input.

**Parameters:**
- `value` (boolean, required): Boolean value

**Returns:** `EncryptedInput` (chainable)

**Example:**
```typescript
input.addBool(true);
```

#### `.encrypt()`

Generate the encrypted proof and handles.

**Returns:** `Promise<{ handles: string[], inputProof: string }>`

**Example:**
```typescript
const input = fhevm.contract.createInput(contractAddr, userAddr);
input.add8(42).add16(1000).addBool(true);

const { handles, inputProof } = await input.encrypt();

// Send to contract
await contract.myFunction(handles, inputProof);
```

---

## Permission Management API

### `fhevm.contract.generatePermission(contractAddress, signer)`

Generate an EIP-712 signature for decryption permission.

**Parameters:**
- `contractAddress` (string, required): Smart contract address
- `signer` (Signer, required): Ethers.js signer instance

**Returns:** `Promise<{ signature: string, publicKey: string }>`

**Example:**
```typescript
const permission = await fhevm.contract.generatePermission(
  '0x1234...',
  signer
);

await contract.allowAccess(permission.signature, permission.publicKey);
```

---

## Decryption API

### `fhevm.decrypt.request(handle, contractAddress)`

Request decryption of an encrypted value.

**Parameters:**
- `handle` (string, required): Encrypted value handle
- `contractAddress` (string, required): Contract address

**Returns:** `Promise<number | boolean | string>`

**Example:**
```typescript
const decrypted = await fhevm.decrypt.request(handle, contractAddr);
console.log('Decrypted value:', decrypted);
```

---

## React API

### `<FHEVMProvider>`

React context provider for FHEVM SDK.

**Props:**
- `config` (object, required): Same as `createFHEVM` config
- `children` (ReactNode, required): Child components

**Example:**
```tsx
import { FHEVMProvider } from '@astral/fhevm-sdk/react';

function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <MyComponents />
    </FHEVMProvider>
  );
}
```

### `useFHEVM()`

React hook to access FHEVM instance.

**Returns:** `FHEVMInstance`

**Example:**
```tsx
import { useFHEVM } from '@astral/fhevm-sdk/react';

function MyComponent() {
  const fhevm = useFHEVM();

  const handleEncrypt = async () => {
    const encrypted = await fhevm.encrypt.uint8(42);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### `useEncrypt()`

React hook with encryption utilities and loading states.

**Returns:**
```typescript
{
  encrypt: (value: any, type: string) => Promise<EncryptedData>,
  encrypting: boolean,
  error: Error | null
}
```

**Example:**
```tsx
import { useEncrypt } from '@astral/fhevm-sdk/react';

function MyComponent() {
  const { encrypt, encrypting, error } = useEncrypt();

  const handleClick = async () => {
    const result = await encrypt(42, 'uint8');
  };

  return (
    <button onClick={handleClick} disabled={encrypting}>
      {encrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

### `useContract()`

React hook for contract integration utilities.

**Returns:**
```typescript
{
  createInput: (contractAddr: string, userAddr: string) => EncryptedInput,
  generatePermission: (contractAddr: string, signer: Signer) => Promise<Permission>
}
```

**Example:**
```tsx
import { useContract } from '@astral/fhevm-sdk/react';

function MyComponent() {
  const { createInput, generatePermission } = useContract();

  const handleSubmit = async () => {
    const input = createInput(contractAddr, userAddr);
    input.add8(42);
    const { handles, inputProof } = await input.encrypt();
    await contract.submit(handles, inputProof);
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### `useDecrypt()`

React hook for decryption with loading states.

**Returns:**
```typescript
{
  requestDecryption: (handle: string, contractAddr: string) => Promise<any>,
  decrypting: boolean,
  error: Error | null
}
```

**Example:**
```tsx
import { useDecrypt } from '@astral/fhevm-sdk/react';

function MyComponent() {
  const { requestDecryption, decrypting } = useDecrypt();
  const [value, setValue] = useState(null);

  const handleDecrypt = async () => {
    const result = await requestDecryption(handle, contractAddr);
    setValue(result);
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={decrypting}>
        {decrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {value && <p>Value: {value}</p>}
    </div>
  );
}
```

---

## Vue API

### `useFHEVM()`

Vue 3 composable to access FHEVM instance.

**Returns:** `Ref<FHEVMInstance>`

**Example:**
```vue
<script setup>
import { useFHEVM } from '@astral/fhevm-sdk/vue';

const fhevm = useFHEVM();

const handleEncrypt = async () => {
  const encrypted = await fhevm.value.encrypt.uint8(42);
};
</script>
```

### `useEncrypt()`

Vue 3 composable with encryption utilities and reactive states.

**Returns:**
```typescript
{
  encrypt: (value: any, type: string) => Promise<EncryptedData>,
  encrypting: Ref<boolean>,
  error: Ref<Error | null>
}
```

**Example:**
```vue
<script setup>
import { useEncrypt } from '@astral/fhevm-sdk/vue';

const { encrypt, encrypting, error } = useEncrypt();

const handleClick = async () => {
  await encrypt(42, 'uint8');
};
</script>

<template>
  <button @click="handleClick" :disabled="encrypting">
    {{ encrypting ? 'Encrypting...' : 'Encrypt' }}
  </button>
  <p v-if="error">Error: {{ error.message }}</p>
</template>
```

### `useContract()`

Vue 3 composable for contract integration.

**Returns:**
```typescript
{
  createInput: (contractAddr: string, userAddr: string) => EncryptedInput,
  generatePermission: (contractAddr: string, signer: Signer) => Promise<Permission>
}
```

**Example:**
```vue
<script setup>
import { useContract } from '@astral/fhevm-sdk/vue';

const { createInput } = useContract();

const submitValue = async () => {
  const input = createInput(contractAddr, userAddr);
  input.add8(42);
  const { handles, inputProof } = await input.encrypt();
  await contract.submit(handles, inputProof);
};
</script>
```

### `useDecrypt()`

Vue 3 composable for decryption with reactive states.

**Returns:**
```typescript
{
  requestDecryption: (handle: string, contractAddr: string) => Promise<any>,
  decrypting: Ref<boolean>,
  error: Ref<Error | null>
}
```

**Example:**
```vue
<script setup>
import { ref } from 'vue';
import { useDecrypt } from '@astral/fhevm-sdk/vue';

const { requestDecryption, decrypting } = useDecrypt();
const value = ref(null);

const handleDecrypt = async () => {
  value.value = await requestDecryption(handle, contractAddr);
};
</script>

<template>
  <button @click="handleDecrypt" :disabled="decrypting">
    {{ decrypting ? 'Decrypting...' : 'Decrypt' }}
  </button>
  <p v-if="value">Value: {{ value }}</p>
</template>
```

---

## Node.js API

### Basic Usage

```javascript
const { createFHEVM } = require('@astral/fhevm-sdk');

async function main() {
  const fhevm = await createFHEVM({ chainId: 11155111 });

  // Encrypt
  const encrypted = await fhevm.encrypt.uint8(42);

  // Contract interaction
  const input = fhevm.contract.createInput(contractAddr, userAddr);
  input.add8(42).add16(1000);
  const { handles, inputProof } = await input.encrypt();

  // Submit to contract
  await contract.myFunction(handles, inputProof);
}
```

---

## Type Definitions

### `FHEVMConfig`

```typescript
interface FHEVMConfig {
  chainId: number;
  provider?: any;
  gatewayUrl?: string;
  publicKey?: string;
}
```

### `FHEVMInstance`

```typescript
interface FHEVMInstance {
  encrypt: EncryptionAPI;
  decrypt: DecryptionAPI;
  contract: ContractAPI;
}
```

### `EncryptionAPI`

```typescript
interface EncryptionAPI {
  uint8(value: number): Promise<EncryptedData>;
  uint16(value: number): Promise<EncryptedData>;
  uint32(value: number): Promise<EncryptedData>;
  uint64(value: bigint): Promise<EncryptedData>;
  address(value: string): Promise<EncryptedData>;
  bool(value: boolean): Promise<EncryptedData>;
  bytes(value: Uint8Array): Promise<EncryptedData>;
}
```

### `EncryptedData`

```typescript
interface EncryptedData {
  data: Uint8Array;
  handles: string[];
}
```

### `ContractAPI`

```typescript
interface ContractAPI {
  createInput(contractAddress: string, userAddress: string): EncryptedInput;
  generatePermission(contractAddress: string, signer: Signer): Promise<Permission>;
}
```

### `EncryptedInput`

```typescript
interface EncryptedInput {
  add8(value: number): EncryptedInput;
  add16(value: number): EncryptedInput;
  add32(value: number): EncryptedInput;
  add64(value: bigint): EncryptedInput;
  addAddress(value: string): EncryptedInput;
  addBool(value: boolean): EncryptedInput;
  encrypt(): Promise<{ handles: string[], inputProof: string }>;
}
```

### `Permission`

```typescript
interface Permission {
  signature: string;
  publicKey: string;
}
```

### `DecryptionAPI`

```typescript
interface DecryptionAPI {
  request(handle: string, contractAddress: string): Promise<any>;
}
```

---

## Error Handling

All SDK methods throw typed errors for better error handling:

```typescript
try {
  const encrypted = await fhevm.encrypt.uint8(42);
} catch (error) {
  if (error instanceof FHEVMError) {
    console.error('FHEVM Error:', error.message);
  }
}
```

### Error Types

- `FHEVMInitializationError` - Failed to initialize SDK
- `FHEVMEncryptionError` - Encryption failed
- `FHEVMDecryptionError` - Decryption failed
- `FHEVMContractError` - Contract interaction failed

---

## Advanced Usage

### Custom Gateway Configuration

```typescript
const fhevm = await createFHEVM({
  chainId: 11155111,
  gatewayUrl: 'https://custom-gateway.example.com',
  publicKey: '0x...'
});
```

### Batch Encryption

```typescript
const input = fhevm.contract.createInput(contractAddr, userAddr);

// Chain multiple values
input
  .add8(42)
  .add16(1000)
  .add32(1000000)
  .addBool(true)
  .addAddress('0x...');

const { handles, inputProof } = await input.encrypt();
```

### Permission Management

```typescript
// Generate permission
const permission = await fhevm.contract.generatePermission(
  contractAddr,
  signer
);

// Grant access on contract
await contract.allowAccess(permission.signature, permission.publicKey);

// Now can decrypt
const decrypted = await fhevm.decrypt.request(handle, contractAddr);
```

---

## Best Practices

1. **Initialize Once**: Create FHEVM instance once and reuse it
2. **Error Handling**: Always wrap SDK calls in try-catch
3. **Loading States**: Use React/Vue hooks for loading states
4. **Type Safety**: Use TypeScript for better development experience
5. **Batch Operations**: Use `createInput()` for multiple encrypted values

---

## Migration Guide

### From fhevmjs v0.4 to Universal SDK

**Before:**
```typescript
await initFhevm();
const publicKey = await fetchPublicKey(...);
const instance = await createInstance({...});
const encrypted = instance.encrypt8(42);
```

**After:**
```typescript
const fhevm = await createFHEVM({ chainId: 11155111 });
const encrypted = await fhevm.encrypt.uint8(42);
```

---

## Support

- 📚 [Full Documentation](./README.md)
- 🚀 [Quick Start Guide](./QUICKSTART.md)
- 🎨 [Examples](./EXAMPLES.md)
- 💬 [Discord Community](https://discord.gg/zama)
- 🐛 [Report Issues](https://github.com/OliverHauck/fheAstralCompatibility/issues)

---

**Last Updated**: October 2025
**SDK Version**: 1.0.0
