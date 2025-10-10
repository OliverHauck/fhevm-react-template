# @astral/fhevm-sdk

> **Universal FHEVM SDK** - Build confidential dApps with ease

[![npm version](https://img.shields.io/npm/v/@astral/fhevm-sdk.svg)](https://www.npmjs.com/package/@astral/fhevm-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A framework-agnostic SDK for building encrypted applications with [Zama's fhEVM](https://www.zama.ai/fhevm). Inspired by [wagmi](https://wagmi.sh/), designed for simplicity and developer experience.

## ✨ Features

🚀 **Quick Setup** - Less than 10 lines of code to get started
🎯 **Framework Agnostic** - Works with React, Vue, Next.js, Node.js, and more
📦 **All-in-One** - Bundles all required dependencies
🔒 **Type Safe** - Full TypeScript support
🎨 **Intuitive API** - Similar to popular web3 libraries
📚 **Well Documented** - Clear examples and guides

## 📦 Installation

```bash
npm install @astral/fhevm-sdk
# or
pnpm add @astral/fhevm-sdk
# or
yarn add @astral/fhevm-sdk
```

## 🚀 Quick Start

### React / Next.js

```tsx
import { FHEVMProvider, useFHEVM } from '@astral/fhevm-sdk/react';

// 1. Wrap your app
function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <YourApp />
    </FHEVMProvider>
  );
}

// 2. Use in components
function EncryptButton() {
  const fhevm = useFHEVM();

  const handleClick = async () => {
    const encrypted = await fhevm.encrypt.uint8(42);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleClick}>Encrypt</button>;
}
```

### Node.js

```typescript
import { createFHEVM } from '@astral/fhevm-sdk';

// Initialize
const fhevm = await createFHEVM({
  chainId: 11155111,
  provider: yourEthersProvider,
});

// Encrypt
const encrypted = await fhevm.encrypt.uint8(42);

// Use in contract
const input = fhevm.contract.createInput(contractAddr, userAddr);
input.add8(42);
const { handles, inputProof } = await input.encrypt();
```

### Vue 3

```vue
<script setup>
import { useFHEVM } from '@astral/fhevm-sdk/vue';

const fhevm = useFHEVM();

async function encrypt() {
  const encrypted = await fhevm.encrypt.uint8(42);
  console.log(encrypted);
}
</script>

<template>
  <button @click="encrypt">Encrypt</button>
</template>
```

## 📖 Core API

### createFHEVM

Create and initialize an FHEVM instance:

```typescript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({
  chainId: 11155111,              // Required: Network chain ID
  provider?: ethersProvider,      // Optional: Ethers provider
  gatewayUrl?: string,            // Optional: Custom gateway URL
  publicKey?: string,             // Optional: Explicit public key
  aclAddress?: string,            // Optional: ACL contract address
});
```

### Encryption

Encrypt values for use in FHE contracts:

```typescript
// Numbers
await fhevm.encrypt.uint8(42);        // 0-255
await fhevm.encrypt.uint16(1000);     // 0-65535
await fhevm.encrypt.uint32(1000000);  // 0-2^32-1
await fhevm.encrypt.uint64(1000000n); // BigInt

// Other types
await fhevm.encrypt.address('0x...');
await fhevm.encrypt.bool(true);
await fhevm.encrypt.bytes(new Uint8Array([1, 2, 3]));
```

### Contract Integration

Create encrypted inputs for contract calls:

```typescript
const input = fhevm.contract.createInput(contractAddress, userAddress);

// Add encrypted values
input
  .add8(42)
  .add16(1000)
  .add32(1000000)
  .addAddress('0x...')
  .addBool(true);

// Encrypt and get proof
const { handles, inputProof } = await input.encrypt();

// Use in contract call
await contract.myFunction(handles, inputProof);
```

### Decryption

Request decryption through KMS:

```typescript
const decrypted = await fhevm.decrypt.request({
  contractAddress,
  handle: encryptedValueHandle,
  userAddress,
});
```

## ⚛️ React Hooks

### useFHEVM

Access the FHEVM instance:

```typescript
const fhevm = useFHEVM();

// fhevm.encrypt.*
// fhevm.decrypt.*
// fhevm.contract.*
```

### useEncrypt

Simplified encryption with loading states:

```typescript
const { encrypt, encrypting, error } = useEncrypt();

const handleEncrypt = async () => {
  const encrypted = await encrypt(42, 'uint8');
};
```

### useContract

Contract interaction helpers:

```typescript
const { createInput, generatePermission, loading } = useContract();

const input = createInput(contractAddress, userAddress);
const permission = await generatePermission(contractAddress, userAddress);
```

### useDecrypt

Decryption with state management:

```typescript
const { requestDecryption, decrypting, error } = useDecrypt();

const decrypted = await requestDecryption({
  contractAddress,
  handle,
  userAddress,
});
```

## 🎨 Complete Example

```tsx
import { FHEVMProvider, useFHEVM, useEncrypt } from '@astral/fhevm-sdk/react';
import { useState } from 'react';

// Setup Provider
function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <CreateProfile />
    </FHEVMProvider>
  );
}

// Component
function CreateProfile() {
  const fhevm = useFHEVM();
  const { encrypt, encrypting } = useEncrypt();
  const [zodiac, setZodiac] = useState(0);

  const handleSubmit = async () => {
    // 1. Encrypt user input
    const encryptedZodiac = await encrypt(zodiac, 'uint8');

    // 2. Create contract input
    const input = fhevm.contract.createInput(
      CONTRACT_ADDRESS,
      userAddress
    );
    input.add8(zodiac);

    // 3. Get encrypted handles and proof
    const { handles, inputProof } = await input.encrypt();

    // 4. Call contract
    await contract.createProfile(handles[0], inputProof);
  };

  return (
    <div>
      <select value={zodiac} onChange={(e) => setZodiac(+e.target.value)}>
        <option value={0}>Aries</option>
        <option value={1}>Taurus</option>
        {/* ... */}
      </select>

      <button onClick={handleSubmit} disabled={encrypting}>
        {encrypting ? 'Encrypting...' : 'Create Profile'}
      </button>
    </div>
  );
}
```

## 📚 Documentation

- [API Reference](./docs/API.md)
- [Quick Start Guide](./docs/QUICKSTART.md)
- [Framework Guides](./docs/FRAMEWORKS.md)
- [Examples](../../examples/)

## 🎯 Examples

Check out complete working examples:

- **[Next.js App](../../examples/nextjs/)** ⭐ Main showcase
- **[React App](../../examples/react/)**
- **[Vue App](../../examples/vue/)**
- **[Node.js Scripts](../../examples/nodejs/)**

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT © Astral Compatibility Team

## 🙏 Acknowledgments

Built with [fhevmjs](https://github.com/zama-ai/fhevmjs) by [Zama](https://www.zama.ai/).

---

**Made with ❤️ for the FHEVM community**
