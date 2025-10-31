import React from 'react';
import { FHEVMProvider } from '@astral/fhevm-sdk/react';
import EncryptionDemo from './components/EncryptionDemo';
import './App.css';

function App() {
  return (
    <FHEVMProvider config={{ chainId: 11155111 }}>
      <div className="App">
        <header className="App-header">
          <h1>FHEVM React Template</h1>
          <p>Build confidential dApps with Fully Homomorphic Encryption</p>
        </header>
        <main>
          <EncryptionDemo />
        </main>
      </div>
    </FHEVMProvider>
  );
}

export default App;
