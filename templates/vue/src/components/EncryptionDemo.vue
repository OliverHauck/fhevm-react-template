<script setup lang="ts">
import { ref } from 'vue'
import { createFHEVM } from '@astral/fhevm-sdk'

const value = ref('')
const encrypted = ref('')
const encrypting = ref(false)
const error = ref('')

async function handleEncrypt() {
  if (!value.value) return
  
  encrypting.value = true
  error.value = ''
  
  try {
    const fhevm = await createFHEVM({ chainId: 11155111 })
    const result = await fhevm.encrypt.uint8(parseInt(value.value))
    encrypted.value = Buffer.from(result).toString('hex').substring(0, 32) + '...'
  } catch (err: any) {
    error.value = err.message || 'Encryption failed'
    console.error('Encryption failed:', err)
  } finally {
    encrypting.value = false
  }
}
</script>

<template>
  <div class="card">
    <h2>Encryption Demo</h2>
    <div class="demo-content">
      <input
        v-model="value"
        type="number"
        placeholder="Enter a number (0-255)"
        :disabled="encrypting"
      />
      
      <button
        @click="handleEncrypt"
        :disabled="encrypting || !value"
      >
        {{ encrypting ? 'Encrypting...' : 'Encrypt Value' }}
      </button>
      
      <div v-if="encrypted" class="result success">
        <p class="label">Encrypted:</p>
        <p class="value">{{ encrypted }}</p>
      </div>
      
      <div v-if="error" class="result error">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 1.5rem;
  color: white;
  font-size: 1.5rem;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result {
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: left;
}

.result.success {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.result.error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.value {
  font-family: monospace;
  font-size: 0.75rem;
  color: #86efac;
  word-break: break-all;
}
</style>
