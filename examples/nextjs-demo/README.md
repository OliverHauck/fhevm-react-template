# FHEVM SDK - Next.js Demo

A complete demonstration of the Universal FHEVM SDK integrated with Next.js 14 App Router.

## Features

- **🔒 Encryption Demo** - Encrypt values using FHE (uint8, uint16, uint32, bool)
- **📝 Contract Interaction** - Create encrypted inputs and generate proofs
- **🔓 Decryption Demo** - Request decryption of encrypted values
- **🎨 Modern UI** - Beautiful gradient design with responsive layout
- **⚡ React Hooks** - Simple API using `useEncrypt()`, `useDecrypt()`, `useContract()`

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (for transactions)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

## Project Structure

```
nextjs-demo/
├── app/
│   ├── components/
│   │   ├── EncryptionDemo.tsx      # Encryption component
│   │   ├── ContractDemo.tsx        # Contract interaction
│   │   └── DecryptionDemo.tsx      # Decryption component
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   └── globals.css                 # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Usage

### 1. Encryption Demo

The encryption demo shows how to encrypt different data types:

```tsx
import { useEncrypt } from '@astral/fhevm-sdk/react';

function EncryptionDemo() {
  const { encrypt, encrypting, error } = useEncrypt();

  const handleEncrypt = async () => {
    await encrypt(42, 'uint8');
  };

  return (
    <button onClick={handleEncrypt} disabled={encrypting}>
      {encrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

**Supported Types:**
- `uint8` - 0 to 255
- `uint16` - 0 to 65,535
- `uint32` - 0 to 4,294,967,295
- `bool` - true/false

### 2. Contract Interaction Demo

Shows how to create encrypted inputs for smart contracts:

```tsx
import { useContract } from '@astral/fhevm-sdk/react';

function ContractDemo() {
  const { createInput } = useContract();

  const handleSubmit = async () => {
    // Create encrypted input
    const input = createInput(contractAddress, userAddress);
    input.add8(42);

    // Generate proof
    const { handles, inputProof } = await input.encrypt();

    // Use handles and inputProof in your contract call
  };
}
```

**Input Methods:**
- `input.add8(value)` - Add uint8
- `input.add16(value)` - Add uint16
- `input.add32(value)` - Add uint32
- `input.add64(value)` - Add uint64
- `input.addBool(value)` - Add boolean
- `input.addAddress(value)` - Add address

### 3. Decryption Demo

Request decryption of encrypted values:

```tsx
import { useDecrypt } from '@astral/fhevm-sdk/react';

function DecryptionDemo() {
  const { requestDecryption, decrypting, error } = useDecrypt();

  const handleDecrypt = async () => {
    const decrypted = await requestDecryption(handle, contractAddress);
    console.log('Decrypted value:', decrypted);
  };
}
```

## Configuration

### FHEVM Provider

Wrap your application with `FHEVMProvider`:

```tsx
import { FHEVMProvider } from '@astral/fhevm-sdk/react';

export default function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      {/* Your components */}
    </FHEVMProvider>
  );
}
```

**Configuration Options:**
- `chainId` - Network chain ID (11155111 for Sepolia)
- `gatewayUrl` - Custom gateway URL (optional)
- `aclAddress` - Custom ACL contract address (optional)

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Environment Variables

Create a `.env.local` file for custom configuration:

```env
# Network Configuration
NEXT_PUBLIC_CHAIN_ID=11155111

# Contract Addresses (optional)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3897f97Cdfa21926450B05329B55AC7F85F7F066
```

## Testing

### Manual Testing

1. **Test Encryption:**
   - Enter a value (e.g., 42)
   - Select a type (e.g., uint8)
   - Click "Encrypt"
   - Check for success message

2. **Test Contract Interaction:**
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Enter contract address and value
   - Click "Create Encrypted Input"
   - Verify proof generation

3. **Test Decryption:**
   - Enter an encrypted handle
   - Enter contract address
   - Click "Decrypt"
   - Verify decrypted value

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Other Platforms

```bash
# Build for production
npm run build

# The .next folder contains the production build
# Deploy the entire project directory
```

## Common Issues

### MetaMask Not Detected

**Solution:** Install MetaMask browser extension and refresh the page.

### Wrong Network

**Solution:** Switch MetaMask to Sepolia testnet.

### Decryption Permission Denied

**Solution:** Ensure you have permission from the contract owner to decrypt values.

### Build Errors

**Solution:** Clear cache and reinstall:
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## Learn More

- **FHEVM SDK Documentation** - [../../lib/fhevm-sdk/docs/API.md](../../lib/fhevm-sdk/docs/API.md)
- **Quick Start Guide** - [../../lib/fhevm-sdk/docs/QUICKSTART.md](../../lib/fhevm-sdk/docs/QUICKSTART.md)
- **Framework Integration** - [../../lib/fhevm-sdk/docs/FRAMEWORKS.md](../../lib/fhevm-sdk/docs/FRAMEWORKS.md)
- **Next.js Documentation** - https://nextjs.org/docs
- **Zama fhEVM** - https://docs.zama.ai/fhevm

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Universal FHEVM SDK** - Encryption/decryption
- **Ethers.js v5** - Ethereum interactions
- **CSS3** - Styling with gradients

## License

MIT License - See LICENSE file for details

## Support

- **GitHub Issues** - https://github.com/OliverHauck/fheAstralCompatibility/issues
- **Zama Discord** - https://discord.fhe.org
- **Documentation** - Check the docs folder

---

Built with ❤️ using [Universal FHEVM SDK](https://github.com/OliverHauck/fheAstralCompatibility)
