<template>
  <div class="card">
    <h2>🔒 Encryption Demo</h2>
    <p class="description">Encrypt data using FHE technology</p>

    <div class="form-group">
      <label>Value (0-255):</label>
      <input
        v-model.number="value"
        type="number"
        min="0"
        max="255"
        placeholder="Enter a value"
      />
    </div>

    <div class="form-group">
      <label>Type:</label>
      <select v-model="selectedType">
        <option value="uint8">uint8 (0-255)</option>
        <option value="uint16">uint16 (0-65535)</option>
        <option value="uint32">uint32</option>
        <option value="bool">boolean</option>
      </select>
    </div>

    <button
      @click="handleEncrypt"
      :disabled="encrypting"
      class="btn-primary"
    >
      {{ encrypting ? '⏳ Encrypting...' : '🔒 Encrypt' }}
    </button>

    <div v-if="error" class="error-box">
      ❌ {{ error.message }}
    </div>

    <div v-if="result" class="success-box">
      ✅ {{ result }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEncrypt } from '@astral/fhevm-sdk/vue';

const { encrypt, encrypting, error } = useEncrypt();

const value = ref(42);
const selectedType = ref('uint8');
const result = ref('');

const handleEncrypt = async () => {
  try {
    result.value = '';

    let encryptValue = value.value;
    if (selectedType.value === 'bool') {
      encryptValue = value.value > 0;
    }

    await encrypt(encryptValue, selectedType.value);
    result.value = `Successfully encrypted ${encryptValue} as ${selectedType.value}!`;
  } catch (err) {
    console.error('Encryption error:', err);
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

input, select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus, select:focus {
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
</style>
