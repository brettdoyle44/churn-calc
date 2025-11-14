import type {
  CalculatorInputs,
  CalculatorResults,
  UserInfo,
  StoreProfile,
} from "../types";
import { formatCurrency, formatPercentage } from "./calculations";

/**
 * Builds a comprehensive prompt for Claude AI to generate personalized churn analysis.
 *
 * This function constructs a detailed prompt that includes:
 * - Role definition for the AI as a customer retention strategist
 * - Complete store profile with all key metrics
 * - Financial impact analysis
 * - Specific task requirements and output structure
 * - Style guidelines for professional analysis
 * - Conditional guidance based on store characteristics
 *
 * @param inputs - The calculator input values from the user
 * @param results - The calculated churn metrics and financial impact
 * @param userInfo - User contact information and store details
 * @param storeProfile - Store categorization (size, AOV, churn severity)
 * @returns A complete prompt string ready to send to the Claude API
 *
 * @example
 * ```typescript
 * const prompt = buildChurnAnalysisPrompt(inputs, results, userInfo, profile);
 * // Returns a comprehensive multi-section prompt string
 * ```
 */
export function buildChurnAnalysisPrompt(
  inputs: CalculatorInputs,
  results: CalculatorResults,
  userInfo: UserInfo,
  storeProfile: StoreProfile
): string {
  // Build conditional guidance based on store profile
  let storeGuidance = "";

  // Size-based guidance
  if (storeProfile.sizeCategory === "small") {
    storeGuidance +=
      "This is a small store. Keep recommendations simple and actionable. Suggest tools and templates that don't require extensive technical resources. ";
  } else if (storeProfile.sizeCategory === "enterprise") {
    storeGuidance +=
      "This is an enterprise-level store. Assume they have technical resources available. You can suggest API integrations, custom solutions, and sophisticated automation. ";
  }

  // AOV-based guidance
  if (storeProfile.aovCategory === "low") {
    storeGuidance +=
      "With a low AOV, recommend low-cost tactics and be cautious about suggesting expensive loyalty programs that may not provide ROI. ";
  } else if (storeProfile.aovCategory === "luxury") {
    storeGuidance +=
      "With a luxury AOV, emphasize personalization and VIP treatment over discounts. Focus on high-touch customer experiences. ";
  }

  return `You are a customer retention strategist specializing in e-commerce lifecycle marketing with 15+ years of experience. You're analyzing churn data for a Shopify merchant and providing a personalized retention strategy.

## STORE PROFILE

**Store Name:** ${userInfo.storeName}
${userInfo.storeUrl ? `**Store URL:** ${userInfo.storeUrl}` : ""}
${
  userInfo.biggestChallenge
    ? `**Biggest Challenge:** ${userInfo.biggestChallenge}`
    : ""
}

**Key Metrics:**
- Average Order Value: ${formatCurrency(inputs.averageOrderValue)}
- Total Customers: ${inputs.numberOfCustomers.toLocaleString()}
- Purchase Frequency: ${inputs.purchaseFrequency}x per year
- Current Churn Rate: ${formatPercentage(inputs.churnRate)}
- Average Customer Lifespan: ${results.customerLifespan} years
${
  inputs.customerAcquisitionCost
    ? `- Customer Acquisition Cost: ${formatCurrency(
        inputs.customerAcquisitionCost
      )}`
    : ""
}
${
  inputs.grossMargin
    ? `- Gross Margin: ${formatPercentage(inputs.grossMargin)}`
    : ""
}

**Store Category:**
- Business Size: ${storeProfile.sizeCategory}
- AOV Category: ${storeProfile.aovCategory}
- Churn Severity: ${storeProfile.churnSeverity}

## FINANCIAL IMPACT

**Current Churn Cost:**
- Annual Revenue Lost: ${formatCurrency(results.annualRevenueLost)}
- Monthly Revenue Lost: ${formatCurrency(results.monthlyRevenueLost)}
- 3-Year Projected Loss: ${formatCurrency(results.threeYearImpact)}

**Customer Loss:**
- Customers Lost Per Year: ${Math.round(
    results.customersLostPerYear
  ).toLocaleString()}
- Customers Lost Per Month: ${Math.round(
    results.customersLostPerMonth
  ).toLocaleString()}

## YOUR TASK

Provide a comprehensive churn analysis and retention strategy with the following sections:

### SITUATION ASSESSMENT
Write 3-4 sentences that:
- Compare their churn rate (${formatPercentage(
    inputs.churnRate
  )}) to industry benchmarks (60-75% is typical for e-commerce)
- Identify the severity level based on their specific situation
- Highlight the most concerning metric in their profile
- Frame the business impact in concrete terms they can understand

### ROOT CAUSE ANALYSIS
Identify 3-4 likely drivers of their churn based on:
- Their AOV of ${formatCurrency(inputs.averageOrderValue)} (${
    storeProfile.aovCategory
  } category)
- Their purchase frequency of ${inputs.purchaseFrequency}x per year
- Their customer base of ${inputs.numberOfCustomers.toLocaleString()} (${
    storeProfile.sizeCategory
  } business)
- Provide evidence-based reasoning for each driver
- Reference their specific metrics to make it personalized

### IMMEDIATE ACTION PLAN - TOP 3 PRIORITIES
For each priority action, include:
1. **What to do** - Specific tactics they can implement immediately
2. **Why it works** - Connect it directly to their situation and metrics
3. **Expected impact** - Estimate revenue saved based on their ${formatCurrency(
    results.annualRevenueLost
  )} annual loss
4. **Implementation time** - Realistic timeline (days/weeks)

### 90-DAY IMPLEMENTATION ROADMAP

**Month 1: Foundation**
- Specific milestones and deliverables
- Quick wins they can achieve

**Month 2: Optimization**
- Building on Month 1 success
- Testing and refinement activities

**Month 3: Scaling**
- Expand successful initiatives
- Advanced strategies and automation

### SUCCESS METRICS TO TRACK
List 4-5 specific metrics with:
- Current baseline (use their actual numbers)
- Target improvement
- How to measure it

## STYLE GUIDELINES

${storeGuidance}

**Tone & Approach:**
- Professional consultant tone, NOT salesperson
- Be specific and reference their actual numbers throughout
- Avoid generic advice - make everything tailored to their situation
- Use data and metrics to support recommendations
- Write in clear, actionable language

**Length & Format:**
- Total length: 500-700 words
- Use markdown formatting for headers and lists
- Use **bold** for emphasis on key metrics and actions
- Keep paragraphs concise and scannable

Begin your analysis now:`;
}
