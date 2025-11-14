import type { CalculatorInputs, CalculationResults } from '../types';

export function calculateChurnMetrics(inputs: CalculatorInputs): CalculationResults {
  const { averageOrderValue, customersPerMonth, churnRate } = inputs;

  // Convert percentage to decimal
  const churnRateDecimal = churnRate / 100;

  // Calculate customers lost per month
  const customersLostPerMonth = customersPerMonth * churnRateDecimal;

  // Calculate monthly churn cost
  const monthlyChurnCost = customersLostPerMonth * averageOrderValue;

  // Calculate annual churn cost
  const annualChurnCost = monthlyChurnCost * 12;

  // Calculate retention rate
  const retentionRate = 100 - churnRate;

  // Calculate average customer lifetime (in months)
  const averageLifetimeMonths = churnRateDecimal > 0 ? 1 / churnRateDecimal : 0;

  // Calculate customer lifetime value
  const averageCustomerLifetimeValue = averageOrderValue * averageLifetimeMonths;

  // Calculate potential recovery (assuming 20-30% of churned customers could be retained)
  const potentialRecovery = monthlyChurnCost * 0.25;

  return {
    monthlyChurnCost,
    annualChurnCost,
    averageCustomerLifetimeValue,
    retentionRate,
    customersLostPerMonth,
    potentialRecovery,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

