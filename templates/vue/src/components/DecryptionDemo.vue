<template>
  <div class="card">
    <h2>🔓 Decryption Demo</h2>
    <p class="description">Request decryption of encrypted values</p>

    <div class="form-group">
      <label>Encrypted Handle:</label>
      <input
        v-model="handle"
        type="text"
        placeholder="0x..."
      />
    </div>

    <div class="form-group">
      <label>Contract Address:</label>
      <input
        v-model="contractAddress"
        type="text"
        placeholder="0x..."
      />
    </div>

    <button
      @click="handleDecrypt"
      :disabled="decrypting"
      class="btn-primary"
    >
      {{ decrypting ? '⏳ Decrypting...' : '🔓 Decrypt' }}
    </button>

    <div v-if="error" class="error-box">
      ❌ {{ error.message }}
    </div>

    <div v-if="decryptedValue !== null" class="success-box">
      ✅ Decrypted Value: <strong>{{ decryptedValue }}</strong>
    </div>

    <div class="info-box">
      ℹ️ Note: Decryption requires permission from the contract owner
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDecrypt } from '@astral/fhevm-sdk/vue';

const { requestDecryption, decrypting, error } = useDecrypt();

const handle = ref('');
const contractAddress = ref('0x3897f97Cdfa21926450B05329B55AC7F85F7F066');
const decryptedValue = ref<number | null>(null);

const handleDecrypt = async () => {
  try {
    decryptedValue.value = null;

    const result = await requestDecryption(
      handle.value,
      contractAddress.value
    );

    decryptedValue.value = result;
  } catch (err) {
    console.error('Decryption error:', err);
  }
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
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
  color: #e65100;
  font-size: 0.9rem;
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

.success-box strong {
  font-size: 1.2rem;
  color: #040;
}
</style>
