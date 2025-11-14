/**
 * Calculator input values from the user
 * Represents the data entered in the calculator form
 */
export interface CalculatorInputs {
  /** Average value of a single customer order */
  averageOrderValue: number;
  /** Total number of customers in the business */
  numberOfCustomers: number;
  /** Average number of purchases per customer per year (defaults to 2) */
  purchaseFrequency: number;
  /** Percentage of customers lost annually (defaults to 75) */
  churnRate: number;
  /** Optional: Cost to acquire a new customer */
  customerAcquisitionCost?: number;
  /** Optional: Gross profit margin as a percentage */
  grossMargin?: number;
}

/**
 * Calculated results from the churn calculator
 * Represents the financial impact of customer churn
 */
export interface CalculatorResults {
  /** Total revenue lost annually due to churn */
  annualRevenueLost: number;
  /** Total revenue lost monthly due to churn */
  monthlyRevenueLost: number;
  /** Projected revenue impact over three years */
  threeYearImpact: number;
  /** Projected revenue impact over five years */
  fiveYearImpact: number;
  /** Average lifespan of a customer in years */
  customerLifespan: number;
  /** Number of customers lost annually */
  customersLostPerYear: number;
  /** Number of customers lost monthly */
  customersLostPerMonth: number;
  /** Array of scenarios showing impact of churn reduction */
  churnReductionScenarios: ChurnScenario[];
}

/**
 * Scenario showing the financial impact of reducing churn by a specific percentage
 */
export interface ChurnScenario {
  /** Percentage reduction in churn rate (e.g., 10, 25, 50) */
  reductionPercentage: number;
  /** New churn rate after reduction */
  newChurnRate: number;
  /** Annual revenue savings from churn reduction */
  annualSavings: number;
  /** Three-year revenue savings from churn reduction */
  threeYearSavings: number;
}

/**
 * User contact information collected before showing results
 */
export interface UserInfo {
  /** User's email address */
  email: string;
  /** Name of the user's store/business */
  storeName: string;
  /** Optional: URL of the user's store */
  storeUrl?: string;
  /** Optional: User's biggest business challenge */
  biggestChallenge?: string;
}

/**
 * Email capture form data
 * Collected during the email capture step
 */
export interface EmailFormData {
  /** User's first name */
  firstName?: string;
  /** User's last name */
  lastName?: string;
  /** User's email address */
  email: string;
  /** User's company name */
  company?: string;
}

/**
 * AI-generated analysis and recommendations
 * Contains personalized insights based on calculator inputs
 */
export interface AIAnalysis {
  /** Markdown-formatted analysis content */
  content: string;
  /** ISO timestamp when the analysis was generated */
  generatedAt: string;
  /** AI model used to generate the analysis */
  model: string;
  /** Whether fallback analysis was used (if AI failed) */
  fallbackUsed: boolean;
}

/**
 * Context type for the Calculator Context Provider
 * Manages all calculator state and operations
 */
export interface CalculatorContextType {
  /** Current calculator input values */
  calculatorInputs: CalculatorInputs | null;
  /** Current calculated results */
  calculatorResults: CalculatorResults | null;
  /** User contact information */
  userInfo: UserInfo | null;
  /** AI-generated analysis */
  aiAnalysis: AIAnalysis | null;
  /** Update calculator inputs */
  setCalculatorInputs: (inputs: CalculatorInputs) => void;
  /** Update calculator results */
  setCalculatorResults: (results: CalculatorResults) => void;
  /** Update user information */
  setUserInfo: (info: UserInfo) => void;
  /** Update AI analysis */
  setAiAnalysis: (analysis: AIAnalysis) => void;
  /** Clear all calculator data */
  clearCalculator: () => void;
  /** Whether the calculator flow is complete */
  isComplete: boolean;
}

/**
 * Store profile categorization for AI context
 * Used to provide more relevant AI analysis and recommendations
 */
export interface StoreProfile {
  /** Business size category based on customer count */
  sizeCategory: 'small' | 'medium' | 'large' | 'enterprise';
  /** Average order value category */
  aovCategory: 'low' | 'medium' | 'high' | 'luxury';
  /** Churn severity assessment */
  churnSeverity: 'critical' | 'concerning' | 'moderate' | 'good';
}
