# Node.js + FHEVM SDK Example

Complete Node.js examples using the Universal FHEVM SDK.

## Features

- ✅ **Basic Encryption** - Encrypt all data types
- ✅ **Contract Integration** - Create encrypted contract inputs
- ✅ **Express.js Server** - REST API for encryption
- ✅ **Batch Operations** - Process multiple encryptions
- ✅ **TypeScript Support** - Full type safety
- ✅ **Error Handling** - Proper error management

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Examples

#### Basic Example
```bash
npm start
```

#### Express Server
```bash
npm run server
```

Then make requests:

```bash
# Encrypt a value
curl -X POST http://localhost:3000/api/encrypt \
  -H "Content-Type: application/json" \
  -d '{"value": 42, "type": "uint8"}'

# Create contract input
curl -X POST http://localhost:3000/api/contract/input \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x3897f97Cdfa21926450B05329B55AC7F85F7F066",
    "userAddress": "0x1234567890123456789012345678901234567890",
    "values": [
      {"type": "uint8", "value": 42},
      {"type": "uint16", "value": 1000}
    ]
  }'

# Batch encryption
curl -X POST http://localhost:3000/api/encrypt/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"type": "uint8", "value": 42},
      {"type": "uint16", "value": 1000},
      {"type": "bool", "value": true}
    ]
  }'
```

## Project Structure

```
nodejs-example/
├── examples/
│   └── server.js         # Express API server
├── index.js              # Basic examples
├── package.json
└── README.md
```

## SDK Usage Examples

### Basic Initialization

```javascript
import { createFHEVM } from '@astral/fhevm-sdk';

const fhevm = await createFHEVM({ chainId: 11155111 });
```

### Encrypt Data

```javascript
// Encrypt uint8
const encrypted = await fhevm.encrypt.uint8(42);
console.log('Data length:', encrypted.data.length);
console.log('Handles:', encrypted.handles);

// Encrypt uint16
const encrypted16 = await fhevm.encrypt.uint16(1000);

// Encrypt boolean
const encryptedBool = await fhevm.encrypt.bool(true);

// Encrypt address
const encryptedAddr = await fhevm.encrypt.address('0x...');
```

### Contract Integration

```javascript
// Create encrypted input
const input = fhevm.contract.createInput(
  '0x3897f97Cdfa21926450B05329B55AC7F85F7F066',
  '0x1234567890123456789012345678901234567890'
);

// Add multiple values
input
  .add8(42)
  .add16(1000)
  .addBool(true);

// Generate proof
const { handles, inputProof } = await input.encrypt();

// Submit to contract
await contract.submitData(handles, inputProof);
```

### Express Server

```javascript
import express from 'express';
import { createFHEVM } from '@astral/fhevm-sdk';

const app = express();
app.use(express.json());

let fhevm;

async function initialize() {
  fhevm = await createFHEVM({ chainId: 11155111 });
}

app.post('/api/encrypt', async (req, res) => {
  const { value, type } = req.body;
  const encrypted = await fhevm.encrypt[type](value);
  res.json({ success: true, encrypted });
});

initialize().then(() => {
  app.listen(3000, () => console.log('Server running'));
});
```

### Error Handling

```javascript
try {
  const encrypted = await fhevm.encrypt.uint8(value);
  console.log('Success:', encrypted);
} catch (error) {
  console.error('Encryption failed:', error.message);
}
```

### Batch Operations

```javascript
const items = [
  { type: 'uint8', value: 42 },
  { type: 'uint16', value: 1000 },
  { type: 'bool', value: true }
];

const results = [];
for (const { type, value } of items) {
  const encrypted = await fhevm.encrypt[type](value);
  results.push(encrypted);
}

console.log('Encrypted', results.length, 'items');
```

## API Endpoints

When running the Express server (`npm run server`):

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "fhevm": "ready"
}
```

### POST /api/encrypt
Encrypt a single value.

**Request:**
```json
{
  "value": 42,
  "type": "uint8"
}
```

**Response:**
```json
{
  "success": true,
  "encrypted": {
    "dataLength": 128,
    "handlesCount": 1
  }
}
```

### POST /api/contract/input
Create encrypted contract input.

**Request:**
```json
{
  "contractAddress": "0x...",
  "userAddress": "0x...",
  "values": [
    {"type": "uint8", "value": 42},
    {"type": "uint16", "value": 1000}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "handles": ["0x...", "0x..."],
  "inputProof": "0x...",
  "valuesCount": 2
}
```

### POST /api/encrypt/batch
Encrypt multiple values at once.

**Request:**
```json
{
  "items": [
    {"type": "uint8", "value": 42},
    {"type": "bool", "value": true}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {"type": "uint8", "value": 42, "dataLength": 128, "handlesCount": 1},
    {"type": "bool", "value": true, "dataLength": 128, "handlesCount": 1}
  ],
  "count": 2
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **FHEVM SDK** - Fully Homomorphic Encryption
- **ES Modules** - Modern JavaScript modules

## Learn More

- [FHEVM SDK Documentation](../../lib/fhevm-sdk/README.md)
- [API Reference](../../lib/fhevm-sdk/docs/API.md)
- [Express Documentation](https://expressjs.com/)

## Support

- 💬 [Discord Community](https://discord.gg/zama)
- 🐛 [Report Issues](https://github.com/OliverHauck/fheAstralCompatibility/issues)
- 📚 [Full Documentation](https://github.com/OliverHauck/fheAstralCompatibility)

---

**Built with ❤️ using Universal FHEVM SDK**
