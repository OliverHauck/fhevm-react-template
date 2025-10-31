# 🚀 Quick Start Guide - Universal FHEVM SDK

Get started with the Universal FHEVM SDK in 5 minutes!

---

## ⚡ 5-Minute Setup

### 1. Installation

```bash
npm install @astral/fhevm-sdk
# or
pnpm add @astral/fhevm-sdk
# or
yarn add @astral/fhevm-sdk
```

### 2. Choose Your Framework

<details>
<summary><strong>Node.js</strong> (3 lines!)</summary>

```javascript
const { createFHEVM } = require('@astral/fhevm-sdk');

async function main() {
  const fhevm = await createFHEVM({ chainId: 11155111 });
  const encrypted = await fhevm.encrypt.uint8(42);
  console.log('Encrypted:', encrypted);
}

main();
```

</details>

<details>
<summary><strong>React / Next.js</strong> (5 lines!)</summary>

```tsx
import { FHEVMProvider, useFHEVM } from '@astral/fhevm-sdk/react';

// 1. Wrap your app
export default function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <MyComponent />
    </FHEVMProvider>
  );
}

// 2. Use in components
function MyComponent() {
  const fhevm = useFHEVM();

  const handleEncrypt = async () => {
    const encrypted = await fhevm.encrypt.uint8(42);
    console.log('Encrypted:', encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

</details>

<details>
<summary><strong>Vue 3</strong> (4 lines!)</summary>

```vue
<script setup>
import { useFHEVM } from '@astral/fhevm-sdk/vue';

const fhevm = useFHEVM();

const handleEncrypt = async () => {
  const encrypted = await fhevm.value.encrypt.uint8(42);
  console.log('Encrypted:', encrypted);
};
</script>

<template>
  <button @click="handleEncrypt">Encrypt</button>
</template>
```

</details>

### 3. That's It! 🎉

You're now ready to build confidential dApps with FHE!

---

## 📖 Common Use Cases

### Encrypt User Input

```typescript
// Simple encryption
const age = await fhevm.encrypt.uint8(25);
const salary = await fhevm.encrypt.uint32(50000);
const approved = await fhevm.encrypt.bool(true);
```

### Submit to Smart Contract

```typescript
// Create encrypted input
const input = fhevm.contract.createInput(
  '0x1234...', // contract address
  '0xabcd...'  // user address
);

// Add multiple encrypted values
input
  .add8(25)      // age
  .add32(50000)  // salary
  .addBool(true); // approved

// Generate proof and submit
const { handles, inputProof } = await input.encrypt();
await contract.submitData(handles, inputProof);
```

### Request Decryption

```typescript
// Generate permission signature
const permission = await fhevm.contract.generatePermission(
  contractAddress,
  signer
);

// Grant access on contract
await contract.allowAccess(permission.signature, permission.publicKey);

// Decrypt value
const decrypted = await fhevm.decrypt.request(handle, contractAddress);
console.log('Decrypted value:', decrypted);
```

---

## 🎨 Framework-Specific Guides

### React with Loading States

```tsx
import { useEncrypt, useDecrypt } from '@astral/fhevm-sdk/react';

function MyComponent() {
  const { encrypt, encrypting } = useEncrypt();
  const { requestDecryption, decrypting } = useDecrypt();
  const [encrypted, setEncrypted] = useState(null);
  const [decrypted, setDecrypted] = useState(null);

  const handleEncrypt = async () => {
    const result = await encrypt(42, 'uint8');
    setEncrypted(result);
  };

  const handleDecrypt = async () => {
    const result = await requestDecryption(handle, contractAddr);
    setDecrypted(result);
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={encrypting}>
        {encrypting ? 'Encrypting...' : 'Encrypt'}
      </button>

      <button onClick={handleDecrypt} disabled={decrypting}>
        {decrypting ? 'Decrypting...' : 'Decrypt'}
      </button>

      {decrypted && <p>Value: {decrypted}</p>}
    </div>
  );
}
```

### Vue with Reactive States

```vue
<script setup>
import { ref } from 'vue';
import { useEncrypt, useDecrypt } from '@astral/fhevm-sdk/vue';

const { encrypt, encrypting } = useEncrypt();
const { requestDecryption, decrypting } = useDecrypt();
const value = ref(42);
const encrypted = ref(null);
const decrypted = ref(null);

const handleEncrypt = async () => {
  encrypted.value = await encrypt(value.value, 'uint8');
};

const handleDecrypt = async () => {
  decrypted.value = await requestDecryption(handle, contractAddr);
};
</script>

<template>
  <div>
    <input v-model.number="value" type="number" />

    <button @click="handleEncrypt" :disabled="encrypting">
      {{ encrypting ? 'Encrypting...' : 'Encrypt' }}
    </button>

    <button @click="handleDecrypt" :disabled="decrypting">
      {{ decrypting ? 'Decrypting...' : 'Decrypt' }}
    </button>

    <p v-if="decrypted">Value: {{ decrypted }}</p>
  </div>
</template>
```

### Node.js with Express

```javascript
const express = require('express');
const { createFHEVM } = require('@astral/fhevm-sdk');

const app = express();
let fhevm;

// Initialize on server start
async function init() {
  fhevm = await createFHEVM({ chainId: 11155111 });
  console.log('FHEVM SDK initialized');
}

// API endpoint
app.post('/encrypt', async (req, res) => {
  try {
    const { value } = req.body;
    const encrypted = await fhevm.encrypt.uint8(value);
    res.json({ encrypted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
init().then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});
```

---

## 🔧 Configuration Options

### Basic Configuration

```typescript
const fhevm = await createFHEVM({
  chainId: 11155111  // Required: Network ID
});
```

### Advanced Configuration

```typescript
const fhevm = await createFHEVM({
  chainId: 11155111,
  provider: window.ethereum,              // Custom provider
  gatewayUrl: 'https://gateway.zama.ai',  // Custom gateway
  publicKey: '0x...'                      // Custom public key
});
```

### With Web3 Provider

```typescript
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const fhevm = await createFHEVM({
  chainId: 11155111,
  provider
});
```

---

## 📦 Complete Example

Here's a complete example combining everything:

```tsx
import { useState } from 'react';
import { FHEVMProvider, useFHEVM, useEncrypt } from '@astral/fhevm-sdk/react';
import { ethers } from 'ethers';

// 1. Setup Provider
function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <EncryptionDemo />
    </FHEVMProvider>
  );
}

// 2. Use in Component
function EncryptionDemo() {
  const fhevm = useFHEVM();
  const { encrypt, encrypting } = useEncrypt();
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  // Connect wallet
  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      '0x1234...', // Your contract address
      contractABI,
      signer
    );
    setContract(contractInstance);
  };

  // Encrypt and submit
  const handleSubmit = async () => {
    try {
      // 1. Create encrypted input
      const userAddress = await contract.signer.getAddress();
      const input = fhevm.contract.createInput(
        contract.address,
        userAddress
      );

      // 2. Add encrypted value
      input.add8(parseInt(value));

      // 3. Generate proof
      const { handles, inputProof } = await input.encrypt();

      // 4. Submit to contract
      const tx = await contract.submitValue(handles[0], inputProof);
      await tx.wait();

      setResult('Success! Transaction: ' + tx.hash);
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>FHE Encryption Demo</h1>

      {!contract && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      {contract && (
        <>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a value (0-255)"
          />

          <button onClick={handleSubmit} disabled={encrypting}>
            {encrypting ? 'Encrypting...' : 'Encrypt & Submit'}
          </button>

          {result && <p>{result}</p>}
        </>
      )}
    </div>
  );
}

export default App;
```

---

## 🎯 Next Steps

### Learn More
- 📚 [Complete API Reference](./API.md)
- 🔧 [Framework Integration Guide](./FRAMEWORKS.md)
- 📝 [Example Templates](./EXAMPLES.md)
- 🔐 [Smart Contract Integration](./CONTRACTS.md)

### Build Something!
- 🎨 Private voting system
- 💰 Confidential auction platform
- 🏥 Healthcare data management
- 🎮 Privacy-preserving gaming
- 💳 Secret credit scoring

### Get Help
- 💬 [Discord Community](https://discord.gg/zama)
- 🐛 [Report Issues](https://github.com/OliverHauck/fheAstralCompatibility/issues)
- 📧 [Contact Support](mailto:support@example.com)

---

## 🔍 Troubleshooting

### Common Issues

<details>
<summary><strong>SDK initialization fails</strong></summary>

**Problem**: `createFHEVM()` throws an error

**Solution**:
- Check your `chainId` is correct (11155111 for Sepolia)
- Ensure you have internet connection
- Verify network is supported

```typescript
// Correct
const fhevm = await createFHEVM({ chainId: 11155111 });

// Wrong - missing chainId
const fhevm = await createFHEVM();
```

</details>

<details>
<summary><strong>Encryption fails</strong></summary>

**Problem**: `encrypt.uint8()` throws an error

**Solution**:
- Check value is in valid range (0-255 for uint8)
- Ensure SDK is initialized
- Verify public key is loaded

```typescript
// Correct
await fhevm.encrypt.uint8(42);

// Wrong - out of range
await fhevm.encrypt.uint8(300); // > 255
```

</details>

<details>
<summary><strong>Contract interaction fails</strong></summary>

**Problem**: Transaction reverts or fails

**Solution**:
- Verify contract address is correct
- Check user has permission
- Ensure proper ABI is used
- Verify input proof is generated

```typescript
// Correct workflow
const input = fhevm.contract.createInput(contractAddr, userAddr);
input.add8(42);
const { handles, inputProof } = await input.encrypt();
await contract.submit(handles[0], inputProof);
```

</details>

<details>
<summary><strong>Decryption returns null</strong></summary>

**Problem**: `decrypt.request()` returns null or fails

**Solution**:
- Generate permission signature first
- Grant access on contract
- Wait for gateway processing

```typescript
// Step 1: Generate permission
const permission = await fhevm.contract.generatePermission(
  contractAddr,
  signer
);

// Step 2: Grant access
await contract.allowAccess(permission.signature, permission.publicKey);

// Step 3: Request decryption
const value = await fhevm.decrypt.request(handle, contractAddr);
```

</details>

---

## 💡 Tips & Best Practices

1. **Initialize Once**: Create FHEVM instance once and reuse
   ```typescript
   // Good
   const fhevm = await createFHEVM({ chainId: 11155111 });

   // Bad - creating multiple times
   const fhevm1 = await createFHEVM({ chainId: 11155111 });
   const fhevm2 = await createFHEVM({ chainId: 11155111 });
   ```

2. **Use TypeScript**: Get better autocomplete and type safety
   ```typescript
   import { FHEVMInstance } from '@astral/fhevm-sdk';

   const fhevm: FHEVMInstance = await createFHEVM({ chainId: 11155111 });
   ```

3. **Handle Errors**: Always wrap in try-catch
   ```typescript
   try {
     const encrypted = await fhevm.encrypt.uint8(value);
   } catch (error) {
     console.error('Encryption failed:', error);
   }
   ```

4. **Batch Operations**: Use `createInput()` for multiple values
   ```typescript
   // Good - batch multiple values
   const input = fhevm.contract.createInput(addr1, addr2);
   input.add8(42).add16(1000).addBool(true);
   const result = await input.encrypt();

   // Less efficient - multiple separate operations
   const enc1 = await fhevm.encrypt.uint8(42);
   const enc2 = await fhevm.encrypt.uint16(1000);
   const enc3 = await fhevm.encrypt.bool(true);
   ```

5. **Loading States**: Use hooks for better UX
   ```tsx
   const { encrypt, encrypting } = useEncrypt();

   <button disabled={encrypting}>
     {encrypting ? 'Processing...' : 'Submit'}
   </button>
   ```

---

## 🚀 You're Ready!

Congratulations! You now know how to:
- ✅ Install and initialize the SDK
- ✅ Encrypt data of different types
- ✅ Submit encrypted data to contracts
- ✅ Request and handle decryption
- ✅ Use framework-specific features

Start building your confidential dApp today! 🎉

---

**Need Help?**
- 📚 [Full Documentation](./README.md)
- 💬 [Join Discord](https://discord.gg/zama)
- 🐛 [Report Issues](https://github.com/OliverHauck/fheAstralCompatibility/issues)
