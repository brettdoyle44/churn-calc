import type { CalculatorInputs, CalculationResults } from '../types';

export function generateAnalysisPrompt(
  inputs: CalculatorInputs,
  results: CalculationResults
): string {
  return `You are a Shopify retention and churn analysis expert. Analyze the following business metrics and provide actionable insights.

Business Context:
- Industry: ${inputs.industry}
- Business Model: ${inputs.businessModel}
- Average Order Value: $${inputs.averageOrderValue}
- Monthly Active Customers: ${inputs.customersPerMonth}
- Churn Rate: ${inputs.churnRate}%

Calculated Metrics:
- Monthly Churn Cost: $${results.monthlyChurnCost.toFixed(2)}
- Annual Churn Cost: $${results.annualChurnCost.toFixed(2)}
- Customer Lifetime Value: $${results.averageCustomerLifetimeValue.toFixed(2)}
- Retention Rate: ${results.retentionRate}%
- Customers Lost Per Month: ${results.customersLostPerMonth.toFixed(0)}
- Potential Monthly Recovery: $${results.potentialRecovery.toFixed(2)}

Please provide:

1. A brief executive summary (2-3 sentences) explaining the severity of this churn rate
2. 3-5 key insights about their churn situation
3. 5-7 specific, actionable recommendations to reduce churn (prioritized by impact)
4. How this compares to industry benchmarks for ${inputs.industry}
5. An urgency level: low, medium, high, or critical

Format your response as JSON with this structure:
{
  "summary": "executive summary here",
  "keyInsights": ["insight 1", "insight 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "industryComparison": "comparison text here",
  "urgencyLevel": "low|medium|high|critical"
}

Be specific to Shopify stores and e-commerce best practices. Focus on practical, implementable solutions.`;
}

