import { createApp } from 'vue';
import App from './App.vue';
import { createFHEVM } from '@astral/fhevm-sdk';

async function bootstrap() {
  // Initialize FHEVM SDK
  await createFHEVM({ chainId: 11155111 });

  // Create and mount Vue app
  const app = createApp(App);
  app.mount('#app');

  console.log('✅ FHEVM SDK initialized');
  console.log('✅ Vue app mounted');
}

bootstrap().catch(console.error);
