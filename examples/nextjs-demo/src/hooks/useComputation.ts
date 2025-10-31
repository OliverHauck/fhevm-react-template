/**
 * useComputation Hook
 * Specialized hook for FHE computations
 */

'use client';

import { useState, useCallback } from 'react';
import { useFHE } from './useFHE';

export interface UseComputationReturn {
  compute: (operation: string, operands: number[]) => Promise<string | null>;
  isComputing: boolean;
  result: string | null;
  error: string | null;
  clearResult: () => void;
}

export function useComputation(): UseComputationReturn {
  const { compute: fheCompute, isInitialized } = useFHE();
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(
    async (operation: string, operands: number[]): Promise<string | null> => {
      if (!isInitialized) {
        setError('FHE client not initialized');
        return null;
      }

      if (!operands || operands.length === 0) {
        setError('No operands provided');
        return null;
      }

      setIsComputing(true);
      setError(null);

      try {
        const computedResult = await fheCompute(operation, operands);
        setResult(computedResult);
        return computedResult;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed';
        setError(errorMessage);
        console.error('Computation error:', err);
        return null;
      } finally {
        setIsComputing(false);
      }
    },
    [fheCompute, isInitialized]
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    isComputing,
    result,
    error,
    clearResult,
  };
}

export default useComputation;
