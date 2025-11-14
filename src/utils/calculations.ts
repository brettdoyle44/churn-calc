import type { CalculatorInputs, CalculatorResults, ChurnScenario, StoreProfile } from '../types';

/**
 * Calculates the annual revenue lost due to customer churn.
 * 
 * This function computes the total revenue impact when customers churn (leave)
 * by multiplying the number of churned customers by their annual spending.
 * 
 * @param inputs - Calculator input values from the user
 * @returns Annual revenue lost, rounded to 2 decimal places
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 1000,
 *   churnRate: 75,
 *   averageOrderValue: 100,
 *   purchaseFrequency: 2
 * };
 * const loss = calculateAnnualRevenueLost(inputs);
 * // Returns: 150000.00 (750 customers lost * $200 annual value)
 * ```
 * 
 * @remarks
 * Formula: (numberOfCustomers * (churnRate/100)) * (averageOrderValue * purchaseFrequency)
 * - Handles edge cases: returns 0 if any input is 0 or negative
 * - Result is rounded to 2 decimal places for currency precision
 */
export function calculateAnnualRevenueLost(inputs: CalculatorInputs): number {
  const { numberOfCustomers, churnRate, averageOrderValue, purchaseFrequency } = inputs;
  
  // Handle edge cases: negative or zero values
  if (numberOfCustomers <= 0 || churnRate <= 0 || averageOrderValue <= 0 || purchaseFrequency <= 0) {
    return 0;
  }
  
  // Handle extremely high values (sanity check)
  if (churnRate > 100) {
    return 0;
  }
  
  const customersLost = numberOfCustomers * (churnRate / 100);
  const annualValuePerCustomer = averageOrderValue * purchaseFrequency;
  const annualLoss = customersLost * annualValuePerCustomer;
  
  return Math.round(annualLoss * 100) / 100;
}

/**
 * Calculates the monthly revenue lost due to customer churn.
 * 
 * Divides the annual revenue loss by 12 to provide a monthly perspective
 * on the financial impact of churn.
 * 
 * @param annualLoss - Total annual revenue lost (from calculateAnnualRevenueLost)
 * @returns Monthly revenue lost, rounded to 2 decimal places
 * 
 * @example
 * ```typescript
 * const monthlyLoss = calculateMonthlyRevenueLost(150000);
 * // Returns: 12500.00
 * ```
 * 
 * @remarks
 * Formula: annualLoss / 12
 * - Handles edge cases: returns 0 if annualLoss is 0 or negative
 * - Result is rounded to 2 decimal places for currency precision
 */
export function calculateMonthlyRevenueLost(annualLoss: number): number {
  if (annualLoss <= 0) {
    return 0;
  }
  
  const monthlyLoss = annualLoss / 12;
  return Math.round(monthlyLoss * 100) / 100;
}

/**
 * Calculates the compounded lifetime value lost over a specified number of years.
 * 
 * This function projects the cumulative revenue impact of churn over multiple years,
 * accounting for the compounding effect of customer loss on future revenue.
 * Uses a conservative estimate (0% growth) to avoid overestimating impact.
 * 
 * @param inputs - Calculator input values from the user
 * @param years - Number of years to project (typically 3 or 5)
 * @returns Compounded lifetime value lost, rounded to 2 decimal places
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 1000,
 *   churnRate: 75,
 *   averageOrderValue: 100,
 *   purchaseFrequency: 2
 * };
 * const threeYearLoss = calculateLifetimeValueLost(inputs, 3);
 * // Returns cumulative loss over 3 years
 * ```
 * 
 * @remarks
 * - Uses a conservative 0% growth assumption to avoid overestimating
 * - Accounts for compounding effect: each year's churned customers reduce the base
 * - Result is rounded to 2 decimal places for currency precision
 * - Returns 0 for invalid inputs (years <= 0, invalid churn rate)
 */
export function calculateLifetimeValueLost(inputs: CalculatorInputs, years: number): number {
  if (years <= 0 || inputs.churnRate <= 0 || inputs.churnRate > 100) {
    return 0;
  }
  
  const { numberOfCustomers, churnRate, averageOrderValue, purchaseFrequency } = inputs;
  
  if (numberOfCustomers <= 0 || averageOrderValue <= 0 || purchaseFrequency <= 0) {
    return 0;
  }
  
  let cumulativeLoss = 0;
  let currentCustomerBase = numberOfCustomers;
  const churnRateDecimal = churnRate / 100;
  const annualValuePerCustomer = averageOrderValue * purchaseFrequency;
  
  // Calculate compounded loss over the specified years
  for (let year = 0; year < years; year++) {
    const customersLostThisYear = currentCustomerBase * churnRateDecimal;
    const revenueLostThisYear = customersLostThisYear * annualValuePerCustomer;
    cumulativeLoss += revenueLostThisYear;
    
    // Update customer base for next year (conservative: no new customer acquisition)
    currentCustomerBase -= customersLostThisYear;
    
    // If customer base drops to near zero, stop calculating
    if (currentCustomerBase < 1) {
      break;
    }
  }
  
  return Math.round(cumulativeLoss * 100) / 100;
}

/**
 * Calculates the average customer lifespan based on churn rate.
 * 
 * This inverse relationship shows how long, on average, a customer stays
 * with the business before churning. Lower churn rates result in longer lifespans.
 * 
 * @param churnRate - Annual churn rate as a percentage (e.g., 75 for 75%)
 * @returns Average customer lifespan in years, rounded to 1 decimal place
 * 
 * @example
 * ```typescript
 * const lifespan = calculateCustomerLifespan(75);
 * // Returns: 1.3 years
 * 
 * const lifespan2 = calculateCustomerLifespan(20);
 * // Returns: 5.0 years
 * ```
 * 
 * @remarks
 * Formula: 1 / (churnRate / 100)
 * - A 75% churn rate means customers stay ~1.3 years on average
 * - A 20% churn rate means customers stay 5 years on average
 * - Returns 0 for invalid churn rates (0, negative, or > 100)
 * - Result is rounded to 1 decimal place for readability
 */
export function calculateCustomerLifespan(churnRate: number): number {
  if (churnRate <= 0 || churnRate > 100) {
    return 0;
  }
  
  const lifespan = 1 / (churnRate / 100);
  return Math.round(lifespan * 10) / 10;
}

/**
 * Generates multiple scenarios showing the financial impact of reducing churn.
 * 
 * Creates three scenarios (10%, 25%, and 50% churn reduction) to help businesses
 * understand the potential ROI of retention initiatives.
 * 
 * @param inputs - Calculator input values from the user
 * @param annualLoss - Current annual revenue lost (from calculateAnnualRevenueLost)
 * @returns Array of three ChurnScenario objects
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
 * // Returns:
 * // [
 * //   { reductionPercentage: 10, newChurnRate: 67.5, annualSavings: 15000, threeYearSavings: 45000 },
 * //   { reductionPercentage: 25, newChurnRate: 56.25, annualSavings: 37500, threeYearSavings: 112500 },
 * //   { reductionPercentage: 50, newChurnRate: 37.5, annualSavings: 75000, threeYearSavings: 225000 }
 * // ]
 * ```
 * 
 * @remarks
 * - Generates scenarios for 10%, 25%, and 50% churn reduction
 * - Annual savings = current loss - new loss with reduced churn
 * - Three-year savings = annual savings * 3 (simple projection)
 * - All values rounded to 2 decimal places for currency precision
 * - Returns empty array if inputs are invalid
 */
export function calculateChurnReductionScenarios(
  inputs: CalculatorInputs,
  annualLoss: number
): ChurnScenario[] {
  if (annualLoss <= 0 || inputs.churnRate <= 0 || inputs.churnRate > 100) {
    return [];
  }
  
  const reductionPercentages = [10, 25, 50];
  const scenarios: ChurnScenario[] = [];
  
  for (const reduction of reductionPercentages) {
    // Calculate new churn rate after reduction
    const newChurnRate = inputs.churnRate * (1 - reduction / 100);
    
    // Calculate new annual loss with reduced churn
    const newInputs = { ...inputs, churnRate: newChurnRate };
    const newAnnualLoss = calculateAnnualRevenueLost(newInputs);
    
    // Calculate savings
    const annualSavings = annualLoss - newAnnualLoss;
    const threeYearSavings = annualSavings * 3;
    
    scenarios.push({
      reductionPercentage: reduction,
      newChurnRate: Math.round(newChurnRate * 100) / 100,
      annualSavings: Math.round(annualSavings * 100) / 100,
      threeYearSavings: Math.round(threeYearSavings * 100) / 100,
    });
  }
  
  return scenarios;
}

/**
 * Main calculation function that computes all results at once.
 * 
 * This is the primary entry point for the calculator. It calls all individual
 * calculation functions and assembles a complete CalculatorResults object.
 * 
 * @param inputs - Calculator input values from the user
 * @returns Complete CalculatorResults object with all metrics
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
 * // Returns complete results object with all calculated metrics
 * ```
 * 
 * @remarks
 * - Calculates annual and monthly revenue loss
 * - Projects 3-year and 5-year impact
 * - Computes customer lifespan and churn counts
 * - Generates churn reduction scenarios
 * - All currency values rounded to 2 decimal places
 * - All percentages and counts properly formatted
 */
export function calculateAllResults(inputs: CalculatorInputs): CalculatorResults {
  // Calculate annual revenue lost
  const annualRevenueLost = calculateAnnualRevenueLost(inputs);
  
  // Calculate monthly revenue lost
  const monthlyRevenueLost = calculateMonthlyRevenueLost(annualRevenueLost);
  
  // Calculate lifetime value lost over 3 and 5 years
  const threeYearImpact = calculateLifetimeValueLost(inputs, 3);
  const fiveYearImpact = calculateLifetimeValueLost(inputs, 5);
  
  // Calculate customer lifespan
  const customerLifespan = calculateCustomerLifespan(inputs.churnRate);
  
  // Calculate number of customers lost
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
    churnReductionScenarios,
  };
}

/**
 * Categorizes a store based on its characteristics for AI analysis context.
 * 
 * Analyzes the store's customer base, order value, and churn rate to provide
 * categorization that can be used for more relevant AI-generated insights.
 * 
 * @param inputs - Calculator input values from the user
 * @param results - Calculated results from calculateAllResults
 * @returns StoreProfile object with categorization
 * 
 * @example
 * ```typescript
 * const inputs = {
 *   numberOfCustomers: 5000,
 *   churnRate: 65,
 *   averageOrderValue: 120,
 *   purchaseFrequency: 2
 * };
 * const results = calculateAllResults(inputs);
 * const profile = categorizeStore(inputs, results);
 * // Returns:
 * // {
 * //   sizeCategory: 'medium',
 * //   aovCategory: 'medium',
 * //   churnSeverity: 'concerning'
 * // }
 * ```
 * 
 * @remarks
 * Size categories:
 * - small: < 1,000 customers
 * - medium: 1,000 - 10,000 customers
 * - large: 10,000 - 50,000 customers
 * - enterprise: > 50,000 customers
 * 
 * AOV categories:
 * - low: < $50
 * - medium: $50 - $150
 * - high: $150 - $500
 * - luxury: > $500
 * 
 * Churn severity:
 * - critical: > 75%
 * - concerning: 60-75%
 * - moderate: 45-60%
 * - good: < 45%
 */
export function categorizeStore(inputs: CalculatorInputs, results: CalculatorResults): StoreProfile {
  const { numberOfCustomers, averageOrderValue, churnRate } = inputs;
  
  // Determine size category
  let sizeCategory: StoreProfile['sizeCategory'];
  if (numberOfCustomers < 1000) {
    sizeCategory = 'small';
  } else if (numberOfCustomers < 10000) {
    sizeCategory = 'medium';
  } else if (numberOfCustomers < 50000) {
    sizeCategory = 'large';
  } else {
    sizeCategory = 'enterprise';
  }
  
  // Determine AOV category
  let aovCategory: StoreProfile['aovCategory'];
  if (averageOrderValue < 50) {
    aovCategory = 'low';
  } else if (averageOrderValue < 150) {
    aovCategory = 'medium';
  } else if (averageOrderValue < 500) {
    aovCategory = 'high';
  } else {
    aovCategory = 'luxury';
  }
  
  // Determine churn severity
  let churnSeverity: StoreProfile['churnSeverity'];
  if (churnRate > 75) {
    churnSeverity = 'critical';
  } else if (churnRate >= 60) {
    churnSeverity = 'concerning';
  } else if (churnRate >= 45) {
    churnSeverity = 'moderate';
  } else {
    churnSeverity = 'good';
  }
  
  return {
    sizeCategory,
    aovCategory,
    churnSeverity,
  };
}
