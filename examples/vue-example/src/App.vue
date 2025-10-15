<template>
  <div id="app">
    <header>
      <h1>🌟 FHEVM SDK - Vue 3 Example</h1>
      <p>Privacy-preserving encryption with Zama's FHE technology</p>
    </header>

    <main>
      <EncryptionDemo />
      <ContractDemo />
      <DecryptionDemo />
    </main>

    <footer>
      <p>Built with Universal FHEVM SDK | <a href="https://github.com/OliverHauck/fheAstralCompatibility">GitHub</a></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import EncryptionDemo from './components/EncryptionDemo.vue';
import ContractDemo from './components/ContractDemo.vue';
import DecryptionDemo from './components/DecryptionDemo.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

main {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

footer {
  text-align: center;
  color: white;
  margin-top: 40px;
  opacity: 0.8;
}

footer a {
  color: white;
  text-decoration: underline;
}
</style>
