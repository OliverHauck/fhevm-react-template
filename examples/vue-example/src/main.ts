import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createFHEVM } from '@astral/fhevm-sdk'

// Initialize FHEVM SDK
async function initApp() {
  try {
    await createFHEVM({ chainId: 11155111 })
    createApp(App).mount('#app')
  } catch (error) {
    console.error('Failed to initialize FHEVM:', error)
  }
}

initApp()
