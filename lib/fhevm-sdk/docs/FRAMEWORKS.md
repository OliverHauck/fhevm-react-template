# 🎨 Framework Integration Guide

Complete guide for using Universal FHEVM SDK with different frameworks.

---

## Table of Contents

- [React / Next.js](#react--nextjs)
- [Vue 3](#vue-3)
- [Node.js](#nodejs)
- [Express.js](#expressjs)
- [Vanilla JavaScript](#vanilla-javascript)
- [TypeScript](#typescript)

---

## React / Next.js

### Installation

```bash
npm install @astral/fhevm-sdk
```

### Basic Setup

#### 1. Create Provider Component

```tsx
// app/providers.tsx
'use client';

import { FHEVMProvider } from '@astral/fhevm-sdk/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      {children}
    </FHEVMProvider>
  );
}
```

#### 2. Wrap Your App

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 3. Use in Components

```tsx
// app/encrypt/page.tsx
'use client';

import { useFHEVM, useEncrypt } from '@astral/fhevm-sdk/react';
import { useState } from 'react';

export default function EncryptPage() {
  const fhevm = useFHEVM();
  const { encrypt, encrypting, error } = useEncrypt();
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const handleEncrypt = async () => {
    try {
      const encrypted = await encrypt(parseInt(value), 'uint8');
      setResult('Encrypted successfully!');
    } catch (err) {
      setResult('Error: ' + (err as Error).message);
    }
  };

  return (
    <div>
      <h1>Encrypt Data</h1>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value (0-255)"
      />
      <button onClick={handleEncrypt} disabled={encrypting}>
        {encrypting ? 'Encrypting...' : 'Encrypt'}
      </button>
      {error && <p className="error">{error.message}</p>}
      {result && <p className="success">{result}</p>}
    </div>
  );
}
```

### Advanced React Patterns

#### Custom Hook with Contract

```tsx
// hooks/useContractSubmit.ts
import { useContract, useFHEVM } from '@astral/fhevm-sdk/react';
import { useState } from 'react';
import { ethers } from 'ethers';

export function useContractSubmit(contractAddress: string, abi: any[]) {
  const fhevm = useFHEVM();
  const { createInput } = useContract();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitValue = async (value: number) => {
    try {
      setSubmitting(true);
      setError(null);

      // Get contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Create encrypted input
      const userAddress = await signer.getAddress();
      const input = createInput(contractAddress, userAddress);
      input.add8(value);

      // Generate proof
      const { handles, inputProof } = await input.encrypt();

      // Submit transaction
      const tx = await contract.submitValue(handles[0], inputProof);
      await tx.wait();

      return tx.hash;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitValue, submitting, error };
}
```

#### Usage in Component

```tsx
// components/SubmitForm.tsx
import { useContractSubmit } from '../hooks/useContractSubmit';
import { useState } from 'react';

export function SubmitForm() {
  const [value, setValue] = useState('');
  const { submitValue, submitting, error } = useContractSubmit(
    '0x1234...',
    contractABI
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const txHash = await submitValue(parseInt(value));
      alert('Success! TX: ' + txHash);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
```

#### Context Composition

```tsx
// contexts/AppContext.tsx
import { FHEVMProvider } from '@astral/fhevm-sdk/react';
import { WagmiConfig } from 'wagmi';
import { config } from '../wagmi.config';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <FHEVMProvider config={{ chainId: 11155111 }}>
        {children}
      </FHEVMProvider>
    </WagmiConfig>
  );
}
```

---

## Vue 3

### Installation

```bash
npm install @astral/fhevm-sdk
```

### Basic Setup

#### 1. Initialize in main.ts

```typescript
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createFHEVM } from '@astral/fhevm-sdk';

const app = createApp(App);

// Initialize FHEVM
createFHEVM({ chainId: 11155111 }).then(() => {
  app.mount('#app');
});
```

#### 2. Use in Components

```vue
<!-- src/components/EncryptForm.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useEncrypt } from '@astral/fhevm-sdk/vue';

const { encrypt, encrypting, error } = useEncrypt();
const value = ref('');
const result = ref('');

const handleEncrypt = async () => {
  try {
    await encrypt(parseInt(value.value), 'uint8');
    result.value = 'Encrypted successfully!';
  } catch (err) {
    result.value = 'Error: ' + (err as Error).message;
  }
};
</script>

<template>
  <div class="encrypt-form">
    <h1>Encrypt Data</h1>
    <input
      v-model="value"
      type="number"
      placeholder="Enter value (0-255)"
    />
    <button @click="handleEncrypt" :disabled="encrypting">
      {{ encrypting ? 'Encrypting...' : 'Encrypt' }}
    </button>
    <p v-if="error" class="error">{{ error.message }}</p>
    <p v-if="result" class="success">{{ result }}</p>
  </div>
</template>
```

### Advanced Vue Patterns

#### Composable for Contract Interaction

```typescript
// src/composables/useContract.ts
import { ref } from 'vue';
import { useFHEVM, useContract } from '@astral/fhevm-sdk/vue';
import { ethers } from 'ethers';

export function useContractSubmit(contractAddress: string, abi: any[]) {
  const fhevm = useFHEVM();
  const { createInput } = useContract();
  const submitting = ref(false);
  const error = ref<Error | null>(null);

  const submitValue = async (value: number) => {
    try {
      submitting.value = true;
      error.value = null;

      // Get contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Create encrypted input
      const userAddress = await signer.getAddress();
      const input = createInput(contractAddress, userAddress);
      input.add8(value);

      // Generate proof
      const { handles, inputProof } = await input.encrypt();

      // Submit transaction
      const tx = await contract.submitValue(handles[0], inputProof);
      await tx.wait();

      return tx.hash;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      submitting.value = false;
    }
  };

  return { submitValue, submitting, error };
}
```

#### Usage in Component

```vue
<!-- src/components/SubmitForm.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useContractSubmit } from '../composables/useContract';
import contractABI from '../abi/Contract.json';

const value = ref('');
const { submitValue, submitting, error } = useContractSubmit(
  '0x1234...',
  contractABI
);

const handleSubmit = async () => {
  try {
    const txHash = await submitValue(parseInt(value.value));
    alert('Success! TX: ' + txHash);
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="value"
      type="number"
      placeholder="Enter value"
    />
    <button type="submit" :disabled="submitting">
      {{ submitting ? 'Submitting...' : 'Submit' }}
    </button>
    <p v-if="error" class="error">{{ error.message }}</p>
  </form>
</template>
```

#### Plugin Pattern

```typescript
// src/plugins/fhevm.ts
import type { App } from 'vue';
import { createFHEVM } from '@astral/fhevm-sdk';

export default {
  async install(app: App) {
    const fhevm = await createFHEVM({ chainId: 11155111 });
    app.config.globalProperties.$fhevm = fhevm;
    app.provide('fhevm', fhevm);
  }
};

// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import fhevmPlugin from './plugins/fhevm';

const app = createApp(App);
app.use(fhevmPlugin);
app.mount('#app');
```

---

## Node.js

### Installation

```bash
npm install @astral/fhevm-sdk
```

### Basic Usage

```javascript
const { createFHEVM } = require('@astral/fhevm-sdk');

async function main() {
  // Initialize SDK
  const fhevm = await createFHEVM({ chainId: 11155111 });

  // Encrypt data
  const encrypted = await fhevm.encrypt.uint8(42);
  console.log('Encrypted:', encrypted);

  // Contract interaction
  const input = fhevm.contract.createInput(
    '0x1234...', // contract address
    '0xabcd...'  // user address
  );

  input.add8(42).add16(1000);
  const { handles, inputProof } = await input.encrypt();

  console.log('Handles:', handles);
  console.log('Proof:', inputProof);
}

main().catch(console.error);
```

### With TypeScript

```typescript
import { createFHEVM, FHEVMInstance } from '@astral/fhevm-sdk';

async function main(): Promise<void> {
  const fhevm: FHEVMInstance = await createFHEVM({ chainId: 11155111 });

  const encrypted = await fhevm.encrypt.uint8(42);
  console.log('Encrypted:', encrypted);
}

main().catch(console.error);
```

---

## Express.js

### Complete Server Setup

```javascript
const express = require('express');
const { createFHEVM } = require('@astral/fhevm-sdk');
const { ethers } = require('ethers');

const app = express();
app.use(express.json());

let fhevm;

// Initialize FHEVM on server start
async function initialize() {
  fhevm = await createFHEVM({ chainId: 11155111 });
  console.log('FHEVM SDK initialized');
}

// Encryption endpoint
app.post('/api/encrypt', async (req, res) => {
  try {
    const { value, type } = req.body;

    let encrypted;
    switch (type) {
      case 'uint8':
        encrypted = await fhevm.encrypt.uint8(value);
        break;
      case 'uint16':
        encrypted = await fhevm.encrypt.uint16(value);
        break;
      case 'bool':
        encrypted = await fhevm.encrypt.bool(value);
        break;
      default:
        throw new Error('Unsupported type');
    }

    res.json({ success: true, encrypted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contract submission endpoint
app.post('/api/submit', async (req, res) => {
  try {
    const { contractAddress, userAddress, value } = req.body;

    // Create encrypted input
    const input = fhevm.contract.createInput(contractAddress, userAddress);
    input.add8(value);

    // Generate proof
    const { handles, inputProof } = await input.encrypt();

    res.json({ success: true, handles, inputProof });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decryption endpoint
app.post('/api/decrypt', async (req, res) => {
  try {
    const { handle, contractAddress } = req.body;

    const decrypted = await fhevm.decrypt.request(handle, contractAddress);

    res.json({ success: true, value: decrypted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
initialize().then(() => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});
```

---

## Vanilla JavaScript

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>FHEVM SDK Demo</title>
</head>
<body>
  <h1>Encrypt Data</h1>
  <input id="value" type="number" placeholder="Enter value (0-255)" />
  <button onclick="encryptValue()">Encrypt</button>
  <div id="result"></div>

  <script type="module">
    import { createFHEVM } from 'https://unpkg.com/@astral/fhevm-sdk@latest/dist/index.esm.js';

    let fhevm;

    // Initialize
    async function init() {
      fhevm = await createFHEVM({ chainId: 11155111 });
      console.log('FHEVM initialized');
    }

    // Encrypt value
    window.encryptValue = async function() {
      const value = parseInt(document.getElementById('value').value);
      const result = document.getElementById('result');

      try {
        result.textContent = 'Encrypting...';
        const encrypted = await fhevm.encrypt.uint8(value);
        result.textContent = 'Encrypted successfully!';
        console.log('Encrypted:', encrypted);
      } catch (error) {
        result.textContent = 'Error: ' + error.message;
      }
    };

    // Initialize on load
    init();
  </script>
</body>
</html>
```

### With CDN

```html
<!DOCTYPE html>
<html>
<head>
  <title>FHEVM SDK Demo</title>
</head>
<body>
  <div id="app">
    <h1>FHEVM Encryption Demo</h1>
    <input id="input-value" type="number" placeholder="Enter value" />
    <button id="encrypt-btn">Encrypt</button>
    <div id="status"></div>
  </div>

  <script src="https://unpkg.com/@astral/fhevm-sdk@latest/dist/index.js"></script>
  <script>
    const { createFHEVM } = window.FHEVMSDK;

    (async function() {
      // Initialize
      const fhevm = await createFHEVM({ chainId: 11155111 });
      const status = document.getElementById('status');

      // Setup button
      document.getElementById('encrypt-btn').addEventListener('click', async () => {
        const value = parseInt(document.getElementById('input-value').value);

        try {
          status.textContent = 'Encrypting...';
          const encrypted = await fhevm.encrypt.uint8(value);
          status.textContent = 'Success!';
          console.log(encrypted);
        } catch (error) {
          status.textContent = 'Error: ' + error.message;
        }
      });
    })();
  </script>
</body>
</html>
```

---

## TypeScript

### Full TypeScript Project Setup

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Type-Safe Implementation

```typescript
// src/fhevm.ts
import { createFHEVM, FHEVMInstance, FHEVMConfig } from '@astral/fhevm-sdk';

export class FHEVMService {
  private instance: FHEVMInstance | null = null;

  async initialize(config: FHEVMConfig): Promise<void> {
    this.instance = await createFHEVM(config);
  }

  async encryptUint8(value: number): Promise<{ data: Uint8Array; handles: string[] }> {
    if (!this.instance) {
      throw new Error('FHEVM not initialized');
    }
    return await this.instance.encrypt.uint8(value);
  }

  async encryptUint16(value: number): Promise<{ data: Uint8Array; handles: string[] }> {
    if (!this.instance) {
      throw new Error('FHEVM not initialized');
    }
    return await this.instance.encrypt.uint16(value);
  }

  async createContractInput(
    contractAddress: string,
    userAddress: string
  ) {
    if (!this.instance) {
      throw new Error('FHEVM not initialized');
    }
    return this.instance.contract.createInput(contractAddress, userAddress);
  }
}

// Usage
const fhevmService = new FHEVMService();
await fhevmService.initialize({ chainId: 11155111 });
const encrypted = await fhevmService.encryptUint8(42);
```

---

## Framework Comparison

| Feature | React | Vue 3 | Node.js | Express | Vanilla JS |
|---------|-------|-------|---------|---------|------------|
| **Setup Complexity** | Medium | Medium | Easy | Medium | Easy |
| **Loading States** | ✅ Hooks | ✅ Composables | ❌ Manual | ❌ Manual | ❌ Manual |
| **Type Safety** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ⚠️ Partial |
| **Context/Provider** | ✅ Yes | ⚠️ Plugin | ❌ No | ❌ No | ❌ No |
| **Reactivity** | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Server-Side** | ⚠️ SSR | ⚠️ SSR | ✅ Yes | ✅ Yes | ❌ No |

---

## Best Practices by Framework

### React
- Use Context Provider for global access
- Leverage hooks for loading states
- Memoize expensive operations
- Handle errors with error boundaries

### Vue 3
- Use composables for reusable logic
- Leverage reactive refs
- Use plugins for global setup
- Handle errors with error handlers

### Node.js
- Initialize once at startup
- Reuse SDK instance
- Handle async errors properly
- Use TypeScript for type safety

### Express.js
- Initialize before server starts
- Cache SDK instance globally
- Validate inputs thoroughly
- Use proper error middleware

### Vanilla JS
- Initialize on page load
- Store instance globally
- Handle errors visibly
- Use modules when possible

---

## Next Steps

- 📚 [API Reference](./API.md)
- 🚀 [Quick Start Guide](./QUICKSTART.md)
- 📝 [Example Projects](./EXAMPLES.md)
- 💬 [Join Discord](https://discord.gg/zama)

---

**Last Updated**: October 2025
