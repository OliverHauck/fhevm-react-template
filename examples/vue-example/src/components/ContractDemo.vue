<template>
  <div class="card">
    <h2>📝 Contract Interaction</h2>
    <p class="description">Submit encrypted data to smart contract</p>

    <div class="form-group">
      <label>Contract Address:</label>
      <input
        v-model="contractAddress"
        type="text"
        placeholder="0x..."
      />
    </div>

    <div class="form-group">
      <label>Value to Submit:</label>
      <input
        v-model.number="submitValue"
        type="number"
        placeholder="Enter value"
      />
    </div>

    <button
      v-if="!wallet"
      @click="connectWallet"
      class="btn-primary"
    >
      🔗 Connect Wallet
    </button>

    <button
      v-else
      @click="handleSubmit"
      :disabled="submitting"
      class="btn-primary"
    >
      {{ submitting ? '⏳ Submitting...' : '📤 Submit to Contract' }}
    </button>

    <div v-if="wallet" class="info-box">
      🔗 Connected: {{ shortenAddress(wallet) }}
    </div>

    <div v-if="error" class="error-box">
      ❌ {{ error }}
    </div>

    <div v-if="txHash" class="success-box">
      ✅ Transaction sent!<br>
      <a :href="`https://sepolia.etherscan.io/tx/${txHash}`" target="_blank" rel="noopener">
        View on Etherscan
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useContract } from '@astral/fhevm-sdk/vue';
import { ethers } from 'ethers';

const { createInput } = useContract();

const contractAddress = ref('0x3897f97Cdfa21926450B05329B55AC7F85F7F066');
const submitValue = ref(42);
const wallet = ref('');
const submitting = ref(false);
const error = ref('');
const txHash = ref('');

const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      error.value = 'Please install MetaMask!';
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    wallet.value = await signer.getAddress();
    error.value = '';
  } catch (err) {
    error.value = (err as Error).message;
  }
};

const handleSubmit = async () => {
  try {
    submitting.value = true;
    error.value = '';
    txHash.value = '';

    // Create encrypted input
    const input = createInput(contractAddress.value, wallet.value);
    input.add8(submitValue.value);

    // Generate proof
    const { handles, inputProof } = await input.encrypt();

    // Submit to contract (mock for demo)
    console.log('Handles:', handles);
    console.log('Proof:', inputProof);

    // Simulate transaction
    txHash.value = '0x' + Math.random().toString(16).substring(2, 66);

  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    submitting.value = false;
  }
};

const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(38)}`;
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 8px;
}

.description {
  color: #666;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: monospace;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-box {
  margin-top: 16px;
  padding: 12px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  color: #1976d2;
  font-family: monospace;
}

.error-box {
  margin-top: 16px;
  padding: 12px;
  background: #fee;
  border-left: 4px solid #f44;
  border-radius: 4px;
  color: #c00;
}

.success-box {
  margin-top: 16px;
  padding: 12px;
  background: #efe;
  border-left: 4px solid #4c4;
  border-radius: 4px;
  color: #060;
}

.success-box a {
  color: #060;
  text-decoration: underline;
}
</style>
