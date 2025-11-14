export interface CalculatorInputs {
  averageOrderValue: number;
  customersPerMonth: number;
  churnRate: number;
  industry: string;
  businessModel: string;
}

export interface CalculationResults {
  monthlyChurnCost: number;
  annualChurnCost: number;
  averageCustomerLifetimeValue: number;
  retentionRate: number;
  customersLostPerMonth: number;
  potentialRecovery: number;
}

export interface AIAnalysis {
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  industryComparison?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface CalculatorContextType {
  inputs: CalculatorInputs | null;
  results: CalculationResults | null;
  analysis: AIAnalysis | null;
  loading: boolean;
  error: string | null;
  setInputs: (inputs: CalculatorInputs) => void;
  calculateResults: () => Promise<void>;
}

export interface EmailFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

