/**
 * Key Manager Component
 * Manages FHE keys (generation, storage, rotation)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { KeyManager as KeyManagerLib } from '../../lib/fhe/keys';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function KeyManager() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [hasStoredKeys, setHasStoredKeys] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    checkStoredKeys();
    loadPublicKey();
  }, []);

  const checkStoredKeys = () => {
    const keys = KeyManagerLib.getStoredKeys();
    setHasStoredKeys(!!keys);
  };

  const loadPublicKey = async () => {
    try {
      const key = await KeyManagerLib.getPublicKey();
      setPublicKey(key);
    } catch (err) {
      console.error('Failed to load public key:', err);
    }
  };

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const keyPair = await KeyManagerLib.generateKeyPair();
      KeyManagerLib.storeKeys(keyPair);
      setHasStoredKeys(true);
      setPublicKey(keyPair.publicKey);
      setSuccess('Keys generated and stored successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate keys';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRotateKeys = async () => {
    setIsRotating(true);
    setError(null);
    setSuccess(null);

    try {
      const newKeyPair = await KeyManagerLib.rotateKeys();
      setPublicKey(newKeyPair.publicKey);
      setSuccess('Keys rotated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rotate keys';
      setError(errorMessage);
    } finally {
      setIsRotating(false);
    }
  };

  const handleClearKeys = () => {
    KeyManagerLib.clearKeys();
    setHasStoredKeys(false);
    setSuccess('Keys cleared successfully!');
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Key Management</h3>

      <div className="space-y-4">
        {publicKey && (
          <div>
            <label className="block text-sm font-medium mb-2">Public Key:</label>
            <div className="bg-gray-800 p-3 rounded font-mono text-xs break-all">
              {publicKey.substring(0, 40)}...
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleGenerateKeys}
            disabled={isGenerating || hasStoredKeys}
            className="flex-1"
          >
            {isGenerating ? 'Generating...' : 'Generate Keys'}
          </Button>

          <Button
            onClick={handleRotateKeys}
            disabled={isRotating || !hasStoredKeys}
            variant="secondary"
            className="flex-1"
          >
            {isRotating ? 'Rotating...' : 'Rotate Keys'}
          </Button>

          <Button
            onClick={handleClearKeys}
            disabled={!hasStoredKeys}
            variant="secondary"
            className="flex-1"
          >
            Clear Keys
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded">
            {success}
          </div>
        )}

        <div className="text-sm text-gray-400">
          <p>Status: {hasStoredKeys ? '✓ Keys stored' : '⚠ No keys stored'}</p>
        </div>
      </div>
    </Card>
  );
}

export default KeyManager;
