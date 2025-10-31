/**
 * Medical Example Component
 * Demonstrates FHE usage in a healthcare/medical context
 */

'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useEncryption } from '../../hooks/useEncryption';

interface MedicalRecord {
  bloodPressure: string;
  heartRate: string;
  bloodSugar: string;
  encrypted: boolean;
}

export function MedicalExample() {
  const [record, setRecord] = useState<MedicalRecord>({
    bloodPressure: '',
    heartRate: '',
    bloodSugar: '',
    encrypted: false,
  });

  const [encryptedData, setEncryptedData] = useState<{
    bloodPressure?: string;
    heartRate?: string;
    bloodSugar?: string;
  }>({});

  const { encrypt, isEncrypting } = useEncryption();

  const handleInputChange = (field: keyof MedicalRecord, value: string) => {
    setRecord((prev) => ({ ...prev, [field]: value }));
  };

  const handleEncryptRecord = async () => {
    try {
      const encrypted: any = {};

      if (record.bloodPressure) {
        encrypted.bloodPressure = await encrypt(Number(record.bloodPressure), 'uint32');
      }

      if (record.heartRate) {
        encrypted.heartRate = await encrypt(Number(record.heartRate), 'uint32');
      }

      if (record.bloodSugar) {
        encrypted.bloodSugar = await encrypt(Number(record.bloodSugar), 'uint32');
      }

      setEncryptedData(encrypted);
      setRecord((prev) => ({ ...prev, encrypted: true }));
      alert('Medical record encrypted successfully!');
    } catch (error) {
      console.error('Encryption error:', error);
      alert('Failed to encrypt medical record');
    }
  };

  const handleClearRecord = () => {
    setRecord({
      bloodPressure: '',
      heartRate: '',
      bloodSugar: '',
      encrypted: false,
    });
    setEncryptedData({});
  };

  const isRecordValid =
    record.bloodPressure || record.heartRate || record.bloodSugar;

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Medical Records Example</h3>
      <p className="text-gray-400 text-sm mb-4">
        Secure medical data storage using FHE encryption
      </p>

      <div className="space-y-4">
        <Input
          type="number"
          value={record.bloodPressure}
          onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
          placeholder="e.g., 120"
          label="Blood Pressure (Systolic)"
          disabled={record.encrypted}
        />

        <Input
          type="number"
          value={record.heartRate}
          onChange={(e) => handleInputChange('heartRate', e.target.value)}
          placeholder="e.g., 75"
          label="Heart Rate (BPM)"
          disabled={record.encrypted}
        />

        <Input
          type="number"
          value={record.bloodSugar}
          onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
          placeholder="e.g., 100"
          label="Blood Sugar (mg/dL)"
          disabled={record.encrypted}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleEncryptRecord}
            disabled={isEncrypting || !isRecordValid || record.encrypted}
            className="flex-1"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt Record'}
          </Button>

          <Button
            onClick={handleClearRecord}
            variant="secondary"
            className="flex-1"
          >
            Clear
          </Button>
        </div>

        {record.encrypted && (
          <div className="space-y-2">
            <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded">
              <strong>Status:</strong> Record encrypted and secured
            </div>

            {encryptedData.bloodPressure && (
              <div className="text-xs">
                <strong>Blood Pressure (Encrypted):</strong>
                <div className="bg-gray-800 p-2 rounded font-mono break-all mt-1">
                  {encryptedData.bloodPressure.substring(0, 40)}...
                </div>
              </div>
            )}

            {encryptedData.heartRate && (
              <div className="text-xs">
                <strong>Heart Rate (Encrypted):</strong>
                <div className="bg-gray-800 p-2 rounded font-mono break-all mt-1">
                  {encryptedData.heartRate.substring(0, 40)}...
                </div>
              </div>
            )}

            {encryptedData.bloodSugar && (
              <div className="text-xs">
                <strong>Blood Sugar (Encrypted):</strong>
                <div className="bg-gray-800 p-2 rounded font-mono break-all mt-1">
                  {encryptedData.bloodSugar.substring(0, 40)}...
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-500/20 border border-blue-500 text-blue-200 p-3 rounded text-sm">
          <strong>Privacy:</strong> All medical data is encrypted end-to-end.
          Even the server cannot read your sensitive health information.
        </div>
      </div>
    </Card>
  );
}

export default MedicalExample;
