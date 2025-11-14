import type { 
  CalculatorInputs, 
  CalculatorResults, 
  ChurnScenario, 
  StoreProfile 
} from '../types';

/**
 * Calculates the total annual revenue lost due to customer churn.
 * 
 * This function determines how much revenue is lost per year when customers churn.
 * It multiplies the number of churned customers by their annual purchase value.
 * 
 * @param inputs - The calculator input values including customer count, churn rate, AOV, and purchase frequency
 * @returns The total annual revenue lost, rounded to 2 decimal places
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 1000,
 *   churnRate: 75,
 *   averageOrderValue: 100,
 *   purchaseFrequency: 2
 * };
 * const annualLoss = calculateAnnualRevenueLost(inputs);
 * // Returns: 150000.00 (750 customers * $100 * 2 purchases)
 * ```
 */
export function calculateAnnualRevenueLost(inputs: CalculatorInputs): number {
  const { numberOfCustomers, churnRate, averageOrderValue, purchaseFrequency } = inputs;
  
  // Handle edge cases
  if (numberOfCustomers <= 0 || churnRate <= 0) {
    return 0;
  }
  
  // Calculate number of customers lost
  const customersLost = numberOfCustomers * (churnRate / 100);
  
  // Calculate annual revenue per customer
  const annualRevenuePerCustomer = averageOrderValue * purchaseFrequency;
  
  // Calculate total annual revenue lost
  const annualLoss = customersLost * annualRevenuePerCustomer;
  
  // Round to 2 decimal places (cents precision)
  return Math.round(annualLoss * 100) / 100;
}

/**
 * Calculates the monthly revenue lost from the annual loss figure.
 * 
 * Simply divides annual loss by 12 to get average monthly impact.
 * 
 * @param annualLoss - The total annual revenue lost due to churn
 * @returns The average monthly revenue lost, rounded to 2 decimal places
 * 
 * @example
 * ```typescript
 * const monthlyLoss = calculateMonthlyRevenueLost(150000);
 * // Returns: 12500.00
 * ```
 */
export function calculateMonthlyRevenueLost(annualLoss: number): number {
  if (annualLoss <= 0) {
    return 0;
  }
  
  const monthlyLoss = annualLoss / 12;
  
  // Round to 2 decimal places (cents precision)
  return Math.round(monthlyLoss * 100) / 100;
}

/**
 * Calculates the compounded lifetime value lost over a specified number of years.
 * 
 * This function accounts for the compounding effect of losing customers each year.
 * Uses a conservative estimate with 0% customer base growth.
 * 
 * @param inputs - The calculator input values
 * @param years - The number of years to project the loss over
 * @returns The total lifetime value lost over the specified years, rounded to 2 decimal places
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 1000,
 *   churnRate: 75,
 *   averageOrderValue: 100,
 *   purchaseFrequency: 2
 * };
 * const lifetimeLoss = calculateLifetimeValueLost(inputs, 3);
 * // Returns: 450000.00 (150000 * 3 years)
 * ```
 */
export function calculateLifetimeValueLost(inputs: CalculatorInputs, years: number): number {
  if (years <= 0) {
    return 0;
  }
  
  // Get annual loss
  const annualLoss = calculateAnnualRevenueLost(inputs);
  
  // For conservative estimate with 0% growth, multiply annual loss by years
  // In a more complex model, we could account for:
  // - Customer base growth
  // - Compounding effect of retained customers
  // - Changes in churn rate over time
  const lifetimeLoss = annualLoss * years;
  
  // Round to 2 decimal places (cents precision)
  return Math.round(lifetimeLoss * 100) / 100;
}

/**
 * Calculates the average customer lifespan in years based on churn rate.
 * 
 * Uses the formula: 1 / (churnRate / 100)
 * For example, a 75% churn rate means customers stay for an average of 1.33 years.
 * 
 * @param churnRate - The annual churn rate as a percentage (0-100)
 * @returns The average customer lifespan in years, rounded to 1 decimal place
 * 
 * @example
 * ```typescript
 * const lifespan = calculateCustomerLifespan(75);
 * // Returns: 1.3 years
 * 
 * const lifespanLowChurn = calculateCustomerLifespan(20);
 * // Returns: 5.0 years
 * ```
 */
export function calculateCustomerLifespan(churnRate: number): number {
  // Handle edge cases
  if (churnRate <= 0) {
    // If no churn, customer lifespan is theoretically infinite
    // Return a practical maximum of 100 years
    return 100;
  }
  
  if (churnRate > 100) {
    // Cap at 100% churn rate
    churnRate = 100;
  }
  
  // Calculate average customer lifespan in years
  const lifespan = 1 / (churnRate / 100);
  
  // Round to 1 decimal place
  return Math.round(lifespan * 10) / 10;
}

/**
 * Generates scenarios showing the financial impact of reducing churn by various percentages.
 * 
 * Creates three scenarios: 10%, 25%, and 50% churn reduction.
 * For each scenario, calculates the new churn rate, annual savings, and 3-year savings.
 * 
 * @param inputs - The calculator input values
 * @param annualLoss - The current annual revenue lost due to churn
 * @returns An array of three ChurnScenario objects with reduction projections
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 1000,
 *   churnRate: 75,
 *   averageOrderValue: 100,
 *   purchaseFrequency: 2
 * };
 * const scenarios = calculateChurnReductionScenarios(inputs, 150000);
 * // Returns: [
 * //   { reductionPercentage: 10, newChurnRate: 67.5, annualSavings: 15000, threeYearSavings: 45000 },
 * //   { reductionPercentage: 25, newChurnRate: 56.25, annualSavings: 37500, threeYearSavings: 112500 },
 * //   { reductionPercentage: 50, newChurnRate: 37.5, annualSavings: 75000, threeYearSavings: 225000 }
 * // ]
 * ```
 */
export function calculateChurnReductionScenarios(
  inputs: CalculatorInputs, 
  annualLoss: number
): ChurnScenario[] {
  const reductionPercentages = [10, 25, 50];
  const scenarios: ChurnScenario[] = [];
  
  for (const reduction of reductionPercentages) {
    // Calculate new churn rate after reduction
    const newChurnRate = inputs.churnRate * (1 - reduction / 100);
    
    // Create modified inputs with new churn rate
    const modifiedInputs: CalculatorInputs = {
      ...inputs,
      churnRate: newChurnRate
    };
    
    // Calculate new annual loss with reduced churn
    const newAnnualLoss = calculateAnnualRevenueLost(modifiedInputs);
    
    // Calculate savings
    const annualSavings = annualLoss - newAnnualLoss;
    const threeYearSavings = annualSavings * 3;
    
    scenarios.push({
      reductionPercentage: reduction,
      newChurnRate: Math.round(newChurnRate * 100) / 100, // Round to 2 decimal places
      annualSavings: Math.round(annualSavings * 100) / 100,
      threeYearSavings: Math.round(threeYearSavings * 100) / 100
    });
  }
  
  return scenarios;
}

/**
 * Main calculation function that computes all churn metrics and returns complete results.
 * 
 * This is the primary entry point for calculating all churn-related metrics.
 * It calls all other calculation functions and returns a comprehensive CalculatorResults object.
 * 
 * @param inputs - The calculator input values from the user
 * @returns Complete CalculatorResults object with all calculated metrics
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 1000,
 *   churnRate: 75,
 *   averageOrderValue: 100,
 *   purchaseFrequency: 2
 * };
 * const results = calculateAllResults(inputs);
 * // Returns: {
 * //   annualRevenueLost: 150000,
 * //   monthlyRevenueLost: 12500,
 * //   threeYearImpact: 450000,
 * //   fiveYearImpact: 750000,
 * //   customerLifespan: 1.3,
 * //   customersLostPerYear: 750,
 * //   customersLostPerMonth: 62.5,
 * //   churnReductionScenarios: [...]
 * // }
 * ```
 */
export function calculateAllResults(inputs: CalculatorInputs): CalculatorResults {
  // Validate inputs
  if (!inputs || inputs.numberOfCustomers <= 0) {
    throw new Error('Invalid calculator inputs: numberOfCustomers must be greater than 0');
  }
  
  // Calculate annual revenue lost
  const annualRevenueLost = calculateAnnualRevenueLost(inputs);
  
  // Calculate monthly revenue lost
  const monthlyRevenueLost = calculateMonthlyRevenueLost(annualRevenueLost);
  
  // Calculate lifetime value impacts
  const threeYearImpact = calculateLifetimeValueLost(inputs, 3);
  const fiveYearImpact = calculateLifetimeValueLost(inputs, 5);
  
  // Calculate customer lifespan
  const customerLifespan = calculateCustomerLifespan(inputs.churnRate);
  
  // Calculate customers lost
  const customersLostPerYear = inputs.numberOfCustomers * (inputs.churnRate / 100);
  const customersLostPerMonth = customersLostPerYear / 12;
  
  // Generate churn reduction scenarios
  const churnReductionScenarios = calculateChurnReductionScenarios(inputs, annualRevenueLost);
  
  return {
    annualRevenueLost: Math.round(annualRevenueLost * 100) / 100,
    monthlyRevenueLost: Math.round(monthlyRevenueLost * 100) / 100,
    threeYearImpact: Math.round(threeYearImpact * 100) / 100,
    fiveYearImpact: Math.round(fiveYearImpact * 100) / 100,
    customerLifespan: Math.round(customerLifespan * 10) / 10,
    customersLostPerYear: Math.round(customersLostPerYear * 100) / 100,
    customersLostPerMonth: Math.round(customersLostPerMonth * 100) / 100,
    churnReductionScenarios
  };
}

/**
 * Categorizes a store based on its size, average order value, and churn severity.
 * 
 * This function analyzes the store's metrics to create a profile that can be used
 * for personalized AI analysis and recommendations.
 * 
 * Size Categories:
 * - small: < 1,000 customers
 * - medium: 1,000 - 10,000 customers
 * - large: 10,000 - 50,000 customers
 * - enterprise: > 50,000 customers
 * 
 * AOV Categories:
 * - low: < $50
 * - medium: $50 - $150
 * - high: $150 - $500
 * - luxury: > $500
 * 
 * Churn Severity:
 * - critical: > 75%
 * - concerning: 60-75%
 * - moderate: 45-60%
 * - good: < 45%
 * 
 * @param inputs - The calculator input values
 * @param results - The calculated results
 * @returns StoreProfile object with categorization
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 5000,
 *   churnRate: 75,
 *   averageOrderValue: 200,
 *   purchaseFrequency: 2
 * };
 * const results = calculateAllResults(inputs);
 * const profile = categorizeStore(inputs, results);
 * // Returns: {
 * //   sizeCategory: 'medium',
 * //   aovCategory: 'high',
 * //   churnSeverity: 'critical'
 * // }
 * ```
 */
export function categorizeStore(
  inputs: CalculatorInputs, 
  results: CalculatorResults
): StoreProfile {
  // Determine size category based on customer count
  let sizeCategory: StoreProfile['sizeCategory'];
  if (inputs.numberOfCustomers < 1000) {
    sizeCategory = 'small';
  } else if (inputs.numberOfCustomers < 10000) {
    sizeCategory = 'medium';
  } else if (inputs.numberOfCustomers < 50000) {
    sizeCategory = 'large';
  } else {
    sizeCategory = 'enterprise';
  }
  
  // Determine AOV category
  let aovCategory: StoreProfile['aovCategory'];
  if (inputs.averageOrderValue < 50) {
    aovCategory = 'low';
  } else if (inputs.averageOrderValue < 150) {
    aovCategory = 'medium';
  } else if (inputs.averageOrderValue < 500) {
    aovCategory = 'high';
  } else {
    aovCategory = 'luxury';
  }
  
  // Determine churn severity
  let churnSeverity: StoreProfile['churnSeverity'];
  if (inputs.churnRate > 75) {
    churnSeverity = 'critical';
  } else if (inputs.churnRate > 60) {
    churnSeverity = 'concerning';
  } else if (inputs.churnRate > 45) {
    churnSeverity = 'moderate';
  } else {
    churnSeverity = 'good';
  }
  
  return {
    sizeCategory,
    aovCategory,
    churnSeverity
  };
}

/**
 * Formats a number as a currency string.
 * 
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$150,000")
 * 
 * @example
 * ```typescript
 * formatCurrency(150000); // Returns: "$150,000"
 * formatCurrency(1234.56); // Returns: "$1,235"
 * ```
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number as a percentage string.
 * 
 * @param value - The percentage value to format
 * @returns Formatted percentage string (e.g., "75.0%")
 * 
 * @example
 * ```typescript
 * formatPercentage(75); // Returns: "75.0%"
 * formatPercentage(33.333); // Returns: "33.3%"
 * ```
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
