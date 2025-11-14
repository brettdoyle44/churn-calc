import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
  CalculatorContextType,
  CalculatorInputs,
  CalculatorResults,
  UserInfo,
  AIAnalysis,
} from '../types';

/**
 * Storage key for sessionStorage persistence
 */
const STORAGE_KEY = 'churnguard_calculator';

/**
 * Interface representing the complete calculator state stored in sessionStorage
 */
interface CalculatorState {
  calculatorInputs: CalculatorInputs | null;
  calculatorResults: CalculatorResults | null;
  userInfo: UserInfo | null;
  aiAnalysis: AIAnalysis | null;
}

/**
 * Calculator Context - manages calculator state across the application
 * Provides state management for the entire calculator flow with sessionStorage persistence
 */
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

/**
 * Props for the CalculatorProvider component
 */
interface CalculatorProviderProps {
  children: ReactNode;
}

/**
 * CalculatorProvider - wraps the application to provide calculator state
 * 
 * Features:
 * - Manages calculator inputs, results, user info, and AI analysis
 * - Persists state to sessionStorage for page refresh survival
 * - Provides type-safe access via useCalculator hook
 * - Handles sessionStorage errors gracefully
 * 
 * @example
 * ```tsx
 * <CalculatorProvider>
 *   <App />
 * </CalculatorProvider>
 * ```
 */
export function CalculatorProvider({ children }: CalculatorProviderProps) {
  // Initialize state from sessionStorage or default to null values
  const [state, setState] = useState<CalculatorState>(() => {
    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData) as CalculatorState;
        if (process.env.NODE_ENV === 'development') {
          console.log('Restored calculator state from sessionStorage:', parsed);
        }
        return parsed;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to restore calculator state from sessionStorage:', error);
      }
    }
    
    return {
      calculatorInputs: null,
      calculatorResults: null,
      userInfo: null,
      aiAnalysis: null,
    };
  });

  /**
   * Persist state to sessionStorage whenever it changes
   */
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (process.env.NODE_ENV === 'development') {
        console.log('Saved calculator state to sessionStorage:', state);
      }
    } catch (error) {
      // Handle private browsing mode or storage quota errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to save calculator state to sessionStorage:', error);
      }
      // Continue without persistence if sessionStorage fails
    }
  }, [state]);

  /**
   * Update calculator inputs
   */
  const setCalculatorInputs = (inputs: CalculatorInputs) => {
    setState((prev) => ({
      ...prev,
      calculatorInputs: inputs,
    }));
  };

  /**
   * Update calculator results
   */
  const setCalculatorResults = (results: CalculatorResults) => {
    setState((prev) => ({
      ...prev,
      calculatorResults: results,
    }));
  };

  /**
   * Update user information
   */
  const setUserInfo = (info: UserInfo) => {
    setState((prev) => ({
      ...prev,
      userInfo: info,
    }));
  };

  /**
   * Update AI analysis
   */
  const setAiAnalysis = (analysis: AIAnalysis) => {
    setState((prev) => ({
      ...prev,
      aiAnalysis: analysis,
    }));
  };

  /**
   * Clear all calculator data and remove from sessionStorage
   * Use this when user wants to start over with a new calculation
   */
  const clearCalculator = () => {
    setState({
      calculatorInputs: null,
      calculatorResults: null,
      userInfo: null,
      aiAnalysis: null,
    });

    try {
      sessionStorage.removeItem(STORAGE_KEY);
      if (process.env.NODE_ENV === 'development') {
        console.log('Cleared calculator state from sessionStorage');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to clear calculator state from sessionStorage:', error);
      }
    }
  };

  /**
   * Computed property: determines if all required data exists
   * Returns true when calculator flow is complete
   */
  const isComplete =
    state.calculatorInputs !== null &&
    state.calculatorResults !== null &&
    state.userInfo !== null &&
    state.aiAnalysis !== null;

  const contextValue: CalculatorContextType = {
    calculatorInputs: state.calculatorInputs,
    calculatorResults: state.calculatorResults,
    userInfo: state.userInfo,
    aiAnalysis: state.aiAnalysis,
    setCalculatorInputs,
    setCalculatorResults,
    setUserInfo,
    setAiAnalysis,
    clearCalculator,
    isComplete,
  };

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
}

/**
 * useCalculator - custom hook for accessing calculator context
 * 
 * @throws {Error} If used outside of CalculatorProvider
 * 
 * @example
 * ```typescript
 * // In any component:
 * const { calculatorInputs, setCalculatorInputs, isComplete } = useCalculator();
 * 
 * // Update inputs
 * setCalculatorInputs({
 *   averageOrderValue: 100,
 *   numberOfCustomers: 1000,
 *   purchaseFrequency: 2,
 *   churnRate: 75,
 * });
 * 
 * // Check if flow is complete
 * if (isComplete) {
 *   console.log('Calculator flow is complete!');
 * }
 * 
 * // Start over
 * clearCalculator();
 * ```
 */
export function useCalculator(): CalculatorContextType {
  const context = useContext(CalculatorContext);
  
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  
  return context;
}
