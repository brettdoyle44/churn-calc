import React, { createContext, useContext, useState } from 'react';
import type {
  CalculatorInputs,
  CalculationResults,
  AIAnalysis,
  CalculatorContextType,
} from '../types';
import { calculateChurnMetrics } from '../utils/calculations';
import { generateAIAnalysis } from '../utils/aiAnalysis';

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = async () => {
    if (!inputs) {
      setError('No inputs provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate metrics
      const calculatedResults = calculateChurnMetrics(inputs);
      setResults(calculatedResults);

      // Generate AI analysis
      const aiAnalysis = await generateAIAnalysis(inputs, calculatedResults);
      setAnalysis(aiAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalculatorContext.Provider
      value={{
        inputs,
        results,
        analysis,
        loading,
        error,
        setInputs,
        calculateResults,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

