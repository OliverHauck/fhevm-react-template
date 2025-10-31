# 🌟 FHEVM SDK - Next.js Demo

Complete demonstration of Fully Homomorphic Encryption (FHE) in Next.js 14 using the Universal FHEVM SDK.

## 📋 Features

### Core SDK Features
- ✅ **Encryption Demo** - Encrypt multiple data types (uint8, uint16, uint32, bool)
- ✅ **Contract Integration** - Create encrypted contract inputs with proofs
- ✅ **Decryption Workflow** - Request and process decryption with permissions
- ✅ **Homomorphic Computation** - Perform operations on encrypted data

### System Management
- ✅ **Key Management** - Handle public/private encryption keys
- ✅ **API Routes** - Server-side FHE operations

### Real-World Examples
- ✅ **Confidential Banking** - Private financial transactions
- ✅ **Health Records** - HIPAA-compliant medical data processing

## 🏗️ Project Structure

```
nextjs-demo/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   ├── globals.css             # Global styles
│   ├── components/             # Original demo components
│   │   ├── EncryptionDemo.tsx
│   │   ├── ContractDemo.tsx
│   │   └── DecryptionDemo.tsx
│   └── api/                    # API routes
│       ├── fhe/
│       │   ├── route.ts         # Main FHE endpoint
│       │   ├── encrypt/route.ts # Encryption API
│       │   ├── decrypt/route.ts # Decryption API
│       │   └── compute/route.ts # Computation API
│       └── keys/route.ts       # Key management API
│
├── components/                 # React components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                    # FHE feature components
│   │   ├── FHEProvider.tsx     # FHE context provider
│   │   ├── ComputationDemo.tsx # Computation demo
│   │   └── KeyManager.tsx      # Key management UI
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Banking use case
│       └── MedicalExample.tsx  # Medical use case
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE integration
│   │   ├── client.ts           # Client-side FHE ops
│   │   └── server.ts           # Server-side FHE ops
│   └── utils/                  # Helper functions
│       ├── security.ts         # Security utilities
│       └── validation.ts       # Input validation
│
├── hooks/                      # Custom React hooks
│   ├── useFHE.ts               # Main FHE hook
│   ├── useEncryption.ts        # Encryption hook
│   └── useComputation.ts       # Computation hook
│
└── types/                      # TypeScript types
    ├── fhe.ts                  # FHE type definitions
    └── api.ts                  # API types
```

## 🚀 Quick Start

### Installation

```bash
cd examples/nextjs-demo
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Build for Production

```bash
npm run build
npm start
```

## 📚 API Endpoints

### FHE Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/fhe` | Check FHE service status |
| `POST` | `/api/fhe/encrypt` | Encrypt values server-side |
| `POST` | `/api/fhe/decrypt` | Request decryption |
| `POST` | `/api/fhe/compute` | Perform homomorphic computation |

### Key Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/keys` | Get public encryption keys |
| `POST` | `/api/keys` | Manage encryption keys |

### Example API Requests

**Encrypt a value:**
```bash
curl -X POST http://localhost:3000/api/fhe/encrypt \
  -H "Content-Type: application/json" \
  -d '{"value": 42, "type": "uint8"}'
```

**Batch encryption:**
```bash
curl -X POST http://localhost:3000/api/fhe/encrypt \
  -H "Content-Type: application/json" \
  -d '{
    "batch": true,
    "items": [
      {"value": 42, "type": "uint8"},
      {"value": 1000, "type": "uint16"}
    ]
  }'
```

**Homomorphic computation:**
```bash
curl -X POST http://localhost:3000/api/fhe/compute \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "add",
    "operand1": "0x...",
    "operand2": "0x..."
  }'
```

## 🎯 SDK Integration Examples

### Client-Side Encryption

```typescript
import { encryptValue } from '@/lib/fhe/client';

// Initialize FHE (done automatically by FHEProvider)
const encrypted = await encryptValue(42, 'uint8');
```

### Using React Hooks

```typescript
import { useEncryption } from '@/hooks/useEncryption';

function MyComponent() {
  const { encrypt, encrypting, error } = useEncryption();

  const handleEncrypt = async () => {
    try {
      const result = await encrypt(42, 'uint8');
      console.log('Encrypted:', result);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <button onClick={handleEncrypt} disabled={encrypting}>
      {encrypting ? 'Encrypting...' : 'Encrypt'}
    </button>
  );
}
```

### Server-Side Operations

```typescript
import { serverEncrypt, batchEncrypt } from '@/lib/fhe/server';

// Single encryption
const encrypted = await serverEncrypt(42, 'uint8');

// Batch encryption
const results = await batchEncrypt([
  { value: 42, type: 'uint8' },
  { value: 1000, type: 'uint16' }
]);
```

## 💼 Use Case Examples

### Confidential Banking

Process financial transactions without revealing balances:

```typescript
import { BankingExample } from '@/components/examples/BankingExample';

// Encrypt account balance and transaction amount
// Verify sufficient funds on encrypted data
// Process transfer without decryption
```

### Health Records

HIPAA-compliant medical data analysis:

```typescript
import { MedicalExample } from '@/components/examples/MedicalExample';

// Encrypt health metrics (heart rate, blood pressure, glucose)
// Analyze medical conditions on encrypted data
// Maintain patient privacy and compliance
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### TypeScript Configuration

The project uses path aliases for clean imports:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@astral/fhevm-sdk": ["../../lib/fhevm-sdk/src"],
      "@astral/fhevm-sdk/react": ["../../lib/fhevm-sdk/src/react"]
    }
  }
}
```

## 📖 Documentation

- **SDK Documentation**: `../../lib/fhevm-sdk/README.md`
- **API Reference**: `../../lib/fhevm-sdk/docs/API.md`
- **Framework Guide**: `../../lib/fhevm-sdk/docs/FRAMEWORKS.md`

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **FHE SDK**: Universal FHEVM SDK
- **Encryption**: Zama's fhEVM v0.5

## 🎨 Features Showcase

### Interactive Demos
- Real-time encryption with loading states
- Error handling and validation
- Responsive design for all screen sizes

### Code Quality
- Full TypeScript type safety
- ESLint and Prettier configured
- Modular component architecture
- Reusable hooks and utilities

### Production Ready
- Server-side rendering (SSR)
- API route handlers
- Environment configuration
- Build optimization

## 🚦 Testing

Test the application functionality:

```bash
# Test encryption endpoint
curl http://localhost:3000/api/fhe

# Test all features in browser
npm run dev
# Open http://localhost:3000
```

## 📝 License

MIT © 2024 Universal FHEVM SDK

## 🙏 Acknowledgments

- **[Zama](https://www.zama.ai/)** - fhEVM technology
- **[Next.js](https://nextjs.org/)** - React framework
- **[Vercel](https://vercel.com/)** - Deployment platform

---

**Built for FHEVM Season 2 Bounty** 🏆
