<script setup lang="ts">
import { ref } from 'vue'
import EncryptionDemo from './components/EncryptionDemo.vue'
import ComputationDemo from './components/ComputationDemo.vue'
</script>

<template>
  <div>
    <h1>FHEVM SDK - Vue 3 Demo</h1>
    <p class="subtitle">Vue Composition API with FHEVM SDK Integration</p>
    
    <div class="demos">
      <EncryptionDemo />
      <ComputationDemo />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #fff, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.demos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
</style>
