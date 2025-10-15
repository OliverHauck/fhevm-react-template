import express from 'express';
import { createFHEVM } from '@astral/fhevm-sdk';

const app = express();
app.use(express.json());

let fhevm;

// Initialize FHEVM on server start
async function initialize() {
  console.log('🚀 Initializing FHEVM SDK...');
  fhevm = await createFHEVM({ chainId: 11155111 });
  console.log('✅ FHEVM SDK initialized\n');
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', fhevm: fhevm ? 'ready' : 'not initialized' });
});

// Encryption endpoint
app.post('/api/encrypt', async (req, res) => {
  try {
    const { value, type } = req.body;

    if (!value && value !== 0 && value !== false) {
      return res.status(400).json({ error: 'Value is required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    let encrypted;
    switch (type) {
      case 'uint8':
        encrypted = await fhevm.encrypt.uint8(value);
        break;
      case 'uint16':
        encrypted = await fhevm.encrypt.uint16(value);
        break;
      case 'uint32':
        encrypted = await fhevm.encrypt.uint32(value);
        break;
      case 'uint64':
        encrypted = await fhevm.encrypt.uint64(BigInt(value));
        break;
      case 'bool':
        encrypted = await fhevm.encrypt.bool(value);
        break;
      case 'address':
        encrypted = await fhevm.encrypt.address(value);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported type' });
    }

    res.json({
      success: true,
      encrypted: {
        dataLength: encrypted.data.length,
        handlesCount: encrypted.handles.length,
      }
    });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Contract input endpoint
app.post('/api/contract/input', async (req, res) => {
  try {
    const { contractAddress, userAddress, values } = req.body;

    if (!contractAddress || !userAddress || !values || !Array.isArray(values)) {
      return res.status(400).json({
        error: 'contractAddress, userAddress, and values array are required'
      });
    }

    // Create encrypted input
    const input = fhevm.contract.createInput(contractAddress, userAddress);

    // Add all values
    for (const { type, value } of values) {
      switch (type) {
        case 'uint8':
          input.add8(value);
          break;
        case 'uint16':
          input.add16(value);
          break;
        case 'uint32':
          input.add32(value);
          break;
        case 'uint64':
          input.add64(BigInt(value));
          break;
        case 'bool':
          input.addBool(value);
          break;
        case 'address':
          input.addAddress(value);
          break;
        default:
          return res.status(400).json({ error: `Unsupported type: ${type}` });
      }
    }

    // Generate proof
    const { handles, inputProof } = await input.encrypt();

    res.json({
      success: true,
      handles,
      inputProof,
      valuesCount: values.length
    });
  } catch (error) {
    console.error('Contract input error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Batch encryption endpoint
app.post('/api/encrypt/batch', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'items array is required' });
    }

    const results = [];

    for (const { type, value } of items) {
      let encrypted;

      switch (type) {
        case 'uint8':
          encrypted = await fhevm.encrypt.uint8(value);
          break;
        case 'uint16':
          encrypted = await fhevm.encrypt.uint16(value);
          break;
        case 'uint32':
          encrypted = await fhevm.encrypt.uint32(value);
          break;
        case 'bool':
          encrypted = await fhevm.encrypt.bool(value);
          break;
        default:
          results.push({ type, value, error: 'Unsupported type' });
          continue;
      }

      results.push({
        type,
        value,
        dataLength: encrypted.data.length,
        handlesCount: encrypted.handles.length
      });
    }

    res.json({
      success: true,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Batch encryption error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;

initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🌟 FHEVM API Server running on http://localhost:${PORT}`);
    console.log('\n📋 Available endpoints:');
    console.log(`   GET  /health`);
    console.log(`   POST /api/encrypt`);
    console.log(`   POST /api/encrypt/batch`);
    console.log(`   POST /api/contract/input`);
    console.log('\n📚 Example requests:');
    console.log(`
curl -X POST http://localhost:${PORT}/api/encrypt \\
  -H "Content-Type: application/json" \\
  -d '{"value": 42, "type": "uint8"}'

curl -X POST http://localhost:${PORT}/api/contract/input \\
  -H "Content-Type: application/json" \\
  -d '{
    "contractAddress": "0x3897f97Cdfa21926450B05329B55AC7F85F7F066",
    "userAddress": "0x1234567890123456789012345678901234567890",
    "values": [
      {"type": "uint8", "value": 42},
      {"type": "uint16", "value": 1000}
    ]
  }'
    `);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
