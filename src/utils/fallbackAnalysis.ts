import type { CalculatorInputs, CalculationResults, AIAnalysis } from '../types';

export function getFallbackAnalysis(
  inputs: CalculatorInputs,
  results: CalculationResults
): AIAnalysis {
  const { churnRate } = inputs;
  const { annualChurnCost } = results;

  // Determine urgency level based on churn rate
  let urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  if (churnRate < 3) urgencyLevel = 'low';
  else if (churnRate < 5) urgencyLevel = 'medium';
  else if (churnRate < 10) urgencyLevel = 'high';
  else urgencyLevel = 'critical';

  // Generate summary based on urgency
  const summaries = {
    low: `Your churn rate of ${churnRate}% is relatively healthy for e-commerce. However, with an annual cost of $${annualChurnCost.toFixed(0)}, there's still significant opportunity to improve retention and recover revenue.`,
    medium: `Your churn rate of ${churnRate}% is moderate but concerning. At an annual cost of $${annualChurnCost.toFixed(0)}, implementing retention strategies should be a priority to protect your revenue base.`,
    high: `Your churn rate of ${churnRate}% is significantly above industry benchmarks. With an annual loss of $${annualChurnCost.toFixed(0)}, immediate action is needed to stem customer losses and stabilize your business.`,
    critical: `Your churn rate of ${churnRate}% is at critical levels. Losing $${annualChurnCost.toFixed(0)} annually to churn requires urgent intervention. Customer retention must become your top priority.`,
  };

  const keyInsights = [
    `You're losing ${results.customersLostPerMonth.toFixed(0)} customers every month, which translates to ${results.monthlyChurnCost.toFixed(0)} in monthly revenue loss.`,
    `Your average customer lifetime value is $${results.averageCustomerLifetimeValue.toFixed(0)}, meaning each retained customer represents significant long-term value.`,
    `With effective retention strategies, you could potentially recover $${results.potentialRecovery.toFixed(0)} per month (25% of churned revenue).`,
    `Reducing your churn rate by just 1% would save approximately $${(annualChurnCost * 0.01).toFixed(0)} annually.`,
  ];

  const recommendations = [
    'Implement a post-purchase email sequence to engage customers immediately after their first order',
    'Create a loyalty program to incentivize repeat purchases and build long-term relationships',
    'Set up win-back campaigns for customers who haven\'t purchased in 60-90 days',
    'Analyze your product quality and shipping times - these are common churn drivers',
    'Offer subscription options for frequently purchased items to increase predictability',
    'Collect and act on customer feedback through surveys and reviews',
    'Personalize your marketing based on purchase history and browsing behavior',
  ];

  const industryComparison = `For ${inputs.industry} businesses with a ${inputs.businessModel} model, typical churn rates range from 3-7% monthly. ${
    churnRate < 3
      ? 'Your rate is better than average, positioning you well against competitors.'
      : churnRate < 7
      ? 'Your rate is in line with industry averages, but there\'s room for improvement.'
      : 'Your rate exceeds typical benchmarks, indicating a need for immediate retention focus.'
  }`;

  return {
    summary: summaries[urgencyLevel],
    keyInsights,
    recommendations,
    industryComparison,
    urgencyLevel,
  };
}

