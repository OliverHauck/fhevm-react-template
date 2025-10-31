'use client';

import { FHEProvider } from '@/components/fhe/FHEProvider';
import EncryptionDemo from '@/components/fhe/EncryptionDemo';
import ComputationDemo from '@/components/fhe/ComputationDemo';
import KeyManager from '@/components/fhe/KeyManager';
import BankingExample from '@/components/examples/BankingExample';
import MedicalExample from '@/components/examples/MedicalExample';

export default function Home() {
  return (
    <FHEProvider config={{ chainId: 11155111 }}>
      <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              FHEVM SDK - Next.js Demo
            </h1>
            <p className="text-xl text-gray-300">
              Fully Homomorphic Encryption for Web3 Applications
            </p>
          </header>

          <div className="space-y-8">
            {/* Key Management Section */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Key Management</h2>
              <KeyManager />
            </section>

            {/* Core FHE Operations */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Core FHE Operations</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <EncryptionDemo />
                <ComputationDemo />
              </div>
            </section>

            {/* Real-World Examples */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Real-World Use Cases</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <BankingExample />
                <MedicalExample />
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-bold text-white mb-2">Encryption</h3>
                  <p className="text-gray-300 text-sm">
                    Client-side encryption of sensitive data using FHE
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-bold text-white mb-2">Computation</h3>
                  <p className="text-gray-300 text-sm">
                    Perform operations on encrypted data without decryption
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-bold text-white mb-2">Privacy</h3>
                  <p className="text-gray-300 text-sm">
                    Keep data private while still being able to use it
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </FHEProvider>
  );
}
