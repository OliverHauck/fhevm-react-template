<script setup lang="ts">
import { ref } from 'vue'
import { createFHEVM } from '@astral/fhevm-sdk'

const address = ref('')
const value1 = ref('')
const value2 = ref('')
const result = ref('')
const computing = ref(false)

async function handleCompute() {
  if (!value1.value || !value2.value) return
  
  computing.value = true
  result.value = ''
  
  try {
    const fhevm = await createFHEVM({ chainId: 11155111 })
    const input = fhevm.contract.createInput(
      '0x0000000000000000000000000000000000000000',
      address.value || '0x0000000000000000000000000000000000000000'
    )
    
    input.add8(parseInt(value1.value))
    input.add8(parseInt(value2.value))
    
    const { handles } = await input.encrypt()
    result.value = `Created encrypted inputs: ${handles.length} handles`
  } catch (err: any) {
    result.value = `Computation failed: ${err.message}`
    console.error('Computation failed:', err)
  } finally {
    computing.value = false
  }
}
</script>

<template>
  <div class="card">
    <h2>Computation Demo</h2>
    <div class="demo-content">
      <input
        v-model="address"
        type="text"
        placeholder="Wallet address (optional)"
        :disabled="computing"
      />
      
      <div class="input-row">
        <input
          v-model="value1"
          type="number"
          placeholder="Value 1"
          :disabled="computing"
        />
        <input
          v-model="value2"
          type="number"
          placeholder="Value 2"
          :disabled="computing"
        />
      </div>
      
      <button
        @click="handleCompute"
        :disabled="computing || !value1 || !value2"
      >
        {{ computing ? 'Computing...' : 'Create Encrypted Input' }}
      </button>
      
      <div v-if="result" class="result">
        <p>{{ result }}</p>
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

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.result {
  padding: 1rem;
  border-radius: 0.5rem;
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #86efac;
}
</style>
