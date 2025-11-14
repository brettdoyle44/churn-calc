import type {
  CalculatorInputs,
  CalculatorResults,
  UserInfo,
  StoreProfile,
} from "../types";

/**
 * Helper: Calculate potential savings from a percentage reduction in churn
 */
function calculatePotentialSavings(
  annualRevenueLost: number,
  savingsPercentage: number
): string {
  const savings = annualRevenueLost * (savingsPercentage / 100);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(savings);
}

/**
 * Helper: Format currency with proper US formatting
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Helper: Format number with proper comma separators
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Helper: Calculate target churn rate (15% improvement)
 */
function calculateTargetChurnRate(currentRate: number): number {
  return Math.round(currentRate * 0.85 * 10) / 10;
}

/**
 * Helper: Calculate monthly savings from 15% churn reduction
 */
function calculateMonthlySavings(annualRevenueLost: number): string {
  const savings = (annualRevenueLost * 0.15) / 12;
  return formatCurrency(savings);
}

/**
 * Helper: Calculate customer lifetime value
 */
function calculateCLV(
  averageOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number
): string {
  const clv = averageOrderValue * purchaseFrequency * customerLifespan;
  return formatCurrency(clv);
}

/**
 * Helper: Calculate improved CLV (15-20% increase)
 */
function calculateImprovedCLV(
  averageOrderValue: number,
  purchaseFrequency: number,
  currentLifespan: number
): string {
  const targetLifespan = currentLifespan * 1.175; // 17.5% average increase
  const clv = averageOrderValue * purchaseFrequency * targetLifespan;
  return formatCurrency(clv);
}

/**
 * Generates a professional, data-driven fallback analysis when AI is unavailable.
 * Creates markdown-formatted content with personalized recommendations based on store metrics.
 */
export function generateFallbackAnalysis(
  inputs: CalculatorInputs,
  results: CalculatorResults,
  userInfo: UserInfo,
  storeProfile: StoreProfile
): string {
  const {
    averageOrderValue,
    numberOfCustomers,
    purchaseFrequency,
    churnRate,
  } = inputs;

  const {
    annualRevenueLost,
    customersLostPerMonth,
    customerLifespan,
  } = results;

  const { storeName } = userInfo;
  const { churnSeverity, aovCategory, sizeCategory } = storeProfile;

  // Calculate key metrics for the analysis
  const currentCLV = calculateCLV(averageOrderValue, purchaseFrequency, customerLifespan);
  const targetChurnRate = calculateTargetChurnRate(churnRate);
  const targetCLV = calculateImprovedCLV(averageOrderValue, purchaseFrequency, customerLifespan);

  // Generate the markdown analysis
  return `# Churn Analysis & Strategic Retention Plan for ${storeName}

## SITUATION ASSESSMENT

${generateSituationAssessment(churnRate, churnSeverity, annualRevenueLost, customersLostPerMonth, storeName)}

## PRIMARY CHURN DRIVERS

Based on ${storeName}'s metrics and common e-commerce patterns, here are the four most likely causes of your customer attrition:

### 1. Post-Purchase Engagement Gaps
${generateEngagementGapAnalysis(purchaseFrequency, averageOrderValue, aovCategory)}

### 2. Lack of Proactive At-Risk Detection
Most e-commerce stores operate reactively, only noticing churn after it happens. Without a system to identify behavioral signals—such as declining engagement, abandoned carts from existing customers, or extended time since last purchase—you can't intervene before customers leave. You're losing **${formatNumber(customersLostPerMonth)} customers per month** without visibility into who's at risk.

### 3. Generic vs. Personalized Communication
${generatePersonalizationAnalysis(aovCategory, averageOrderValue, sizeCategory)}

### 4. Insufficient Win-Back Automation
With **${formatNumber(customersLostPerMonth)} customers** churning monthly, you're losing substantial recoverable revenue. Most churned customers can be won back within the first 90 days, but without an automated, progressive win-back system, this opportunity is missed. Each churned customer represents **${formatCurrency(averageOrderValue * purchaseFrequency)}** in lost annual revenue.

## IMMEDIATE ACTION PLAN - TOP 3 PRIORITIES

### Priority 1: Implement At-Risk Customer Identification
**What to do:** Deploy a monitoring system that tracks behavioral signals indicating churn risk—declining email engagement, time since last purchase exceeding your average cycle, cart abandonment from existing customers, and support ticket patterns.

**Why it works:** ${generateAtRiskRationale(sizeCategory, numberOfCustomers)} Early intervention before churn occurs is 3-5x more cost-effective than win-back campaigns.

**Expected impact:** Recovering 20% of at-risk customers could save approximately **${calculatePotentialSavings(annualRevenueLost, 20)}** annually.

**Implementation timeline:** 2-3 weeks

---

### Priority 2: Build Post-Purchase Engagement Sequence
**What to do:** Create a 90-day automated email sequence that activates after each purchase. Include order confirmation, shipping updates, usage tips, complementary product recommendations, review requests, and educational content that reinforces purchase value.

**Why it works:** ${generateEngagementSequenceRationale(purchaseFrequency)} Consistent engagement during this critical period builds habits and emotional connection to your brand.

**Expected impact:** Improving repeat purchase rate by just 5-7% could save approximately **${calculatePotentialSavings(annualRevenueLost, 12.5)}** annually.

**Implementation timeline:** 1-2 weeks

---

### Priority 3: Deploy Intelligent Win-Back Campaigns
**What to do:** Launch a progressive win-back sequence triggered when customers exceed 1.5x your average purchase cycle. Start with value-focused messaging, escalate to incentives (10% → 15% → 20%), and include personalized product recommendations based on purchase history.

**Why it works:** With **${formatNumber(customersLostPerMonth)} customers** leaving monthly, even a 15-20% win-back rate delivers significant revenue recovery. The first 90 days post-churn offer the highest success rates.

**Expected impact:** Recovering 15% of churned customers represents approximately **${calculatePotentialSavings(annualRevenueLost, 15)}** in annual revenue.

**Implementation timeline:** 1 week

## 90-DAY IMPLEMENTATION ROADMAP

### Month 1 - Foundation (Weeks 1-4)
**Week 1:** Set up customer segmentation by purchase recency, frequency, and value. Establish baseline metrics.

**Week 2:** Deploy win-back campaign for customers inactive 60+ days. A/B test subject lines and offers.

**Week 3:** Implement basic at-risk monitoring. Flag customers exceeding 1.5x average purchase cycle.

**Week 4:** Launch post-purchase email sequence (days 1, 3, 7, 14, 30).

**Milestone:** At least **50 customers** re-engaged through win-back campaigns.

### Month 2 - Optimization (Weeks 5-8)
**Week 5-6:** Analyze campaign performance. Identify top-performing messaging and optimize underperforming segments.

**Week 7:** Expand post-purchase sequence to 90 days with behavioral triggers.

**Week 8:** Implement A/B testing on at-risk interventions (offers vs. content-only).

**Milestone:** Achieve **20-25% open rates** on engagement sequences; **10-15% win-back conversion**.

### Month 3 - Scaling (Weeks 9-12)
**Week 9:** Layer in personalized product recommendations based on purchase history.

**Week 10:** Add SMS touchpoints for high-value customers at critical juncture points.

**Week 11:** Implement predictive scoring to prioritize at-risk customers by save probability.

**Week 12:** Full review and optimization. Refine segments and messaging.

**Target outcome:** Reduce churn from **${churnRate}%** to **${targetChurnRate}%** (15% improvement), saving approximately **${calculatePotentialSavings(annualRevenueLost, 15)}** annually.

## SUCCESS METRICS TO TRACK

Track these five KPIs weekly to measure retention program effectiveness:

1. **Churn Rate:** Current **${churnRate}%** → Target **${targetChurnRate}%** (15% reduction)
2. **At-Risk Customer Recovery Rate:** Target **20-30%** of flagged customers retained
3. **Post-Purchase Engagement Rate:** Target **30%+ open rate**, **5%+ click rate** on sequences
4. **Win-Back Campaign ROI:** Target **5:1** return (every $1 spent returns $5)
5. **Customer Lifetime Value:** Current **${currentCLV}** → Target **${targetCLV}** (+15-20%)

## NEXT STEPS

This analysis provides a clear roadmap, but execution requires the right infrastructure. **ChurnGuard** specializes in automated retention systems for e-commerce brands like ${storeName}, providing:

✓ **Predictive at-risk identification** using behavioral AI  
✓ **Automated engagement sequences** that adapt to customer behavior  
✓ **Intelligent win-back campaigns** with progressive incentive logic  
✓ **Real-time dashboards** tracking all retention metrics  
✓ **ROI-positive results** within 60 days

**Ready to stop the revenue leak?** [Book a 15-minute demo](https://churnguard.com/demo) to see how ${storeName} can implement this exact plan with ChurnGuard's platform.

---

*This analysis was generated based on your submitted data. Actual results depend on implementation quality, product-market fit, and consistent execution of retention strategies.*`;
}

/**
 * Generate situation assessment section based on churn severity
 */
function generateSituationAssessment(
  churnRate: number,
  churnSeverity: StoreProfile["churnSeverity"],
  annualRevenueLost: number,
  customersLostPerMonth: number,
  storeName: string
): string {
  const industryBenchmark = "60-75%";
  const formattedLoss = formatCurrency(annualRevenueLost);
  const formattedCustomersLost = formatNumber(customersLostPerMonth);

  switch (churnSeverity) {
    case "critical":
      return `Your current churn rate of **${churnRate}%** is at critical levels and demands immediate attention. This significantly exceeds the typical e-commerce benchmark of ${industryBenchmark}, indicating systemic retention issues. At this rate, ${storeName} is losing **${formattedCustomersLost} customers every month**, translating to **${formattedLoss}** in annual revenue loss. This isn't just a metric to improve—it's an urgent business priority that's actively destabilizing your revenue base. The good news: churn at this level means there's substantial low-hanging fruit, and strategic retention efforts typically yield fast, measurable ROI.`;

    case "concerning":
      return `Your churn rate of **${churnRate}%** falls within the concerning range, sitting at or above the typical e-commerce benchmark of ${industryBenchmark}. ${storeName} is currently losing **${formattedCustomersLost} customers monthly**, which adds up to **${formattedLoss}** in annual revenue loss. While not yet critical, this level of attrition is unsustainable for long-term growth. You're spending resources to acquire customers, only to lose them before capturing their full lifetime value. Addressing retention now—before it becomes critical—will protect your revenue base and improve unit economics.`;

    case "moderate":
      return `Your churn rate of **${churnRate}%** is moderate—better than many e-commerce businesses but still representing a significant optimization opportunity. ${storeName} is losing **${formattedCustomersLost} customers per month**, totaling **${formattedLoss}** annually. While you're performing better than the typical ${industryBenchmark} benchmark, this still means you're not capturing the full lifetime value of your customer base. Strategic retention improvements can unlock substantial revenue growth without increasing acquisition spend.`;

    case "good":
      return `Your churn rate of **${churnRate}%** is notably better than the typical e-commerce benchmark of ${industryBenchmark}—well done. However, ${storeName} is still losing **${formattedCustomersLost} customers monthly**, representing **${formattedLoss}** in annual revenue opportunity. Even with healthy retention, there's room to optimize and capture additional lifetime value. Small improvements at your scale can yield disproportionate returns, and proactive retention strategies will help you maintain this competitive advantage.`;
  }
}

/**
 * Generate engagement gap analysis based on purchase frequency
 */
function generateEngagementGapAnalysis(
  purchaseFrequency: number,
  averageOrderValue: number,
  aovCategory: StoreProfile["aovCategory"]
): string {
  const daysBetweenPurchases = Math.round(365 / purchaseFrequency);

  if (purchaseFrequency < 3) {
    return `With customers purchasing approximately **${purchaseFrequency} times per year** (roughly every **${daysBetweenPurchases} days**), there are extended periods where they're not interacting with your brand. This creates vulnerability: competitors can fill that engagement void, and without regular touchpoints, customers forget the value you provide. ${aovCategory === "high" || aovCategory === "luxury" ? "At your price point, customers expect ongoing value beyond the transaction itself." : "Even for everyday products, consistent engagement builds loyalty that transcends price competition."}`;
  } else {
    return `While your customers purchase relatively frequently (**${purchaseFrequency} times per year**, or roughly every **${daysBetweenPurchases} days**), the periods between purchases still represent engagement gaps. Without strategic touchpoints during these windows, you're missing opportunities to deepen relationships, cross-sell relevant products, and build switching costs that insulate you from competitors.`;
  }
}

/**
 * Generate personalization analysis based on AOV and size
 */
function generatePersonalizationAnalysis(
  aovCategory: StoreProfile["aovCategory"],
  averageOrderValue: number,
  sizeCategory: StoreProfile["sizeCategory"]
): string {
  const formattedAOV = formatCurrency(averageOrderValue);

  if (aovCategory === "high" || aovCategory === "luxury") {
    return `With an average order value of **${formattedAOV}**, your customers expect personalized experiences that reflect their investment. Generic mass emails and one-size-fits-all promotions create cognitive dissonance—if they're spending premium prices, they expect premium treatment. Segmented messaging based on purchase history, preferences, and behavior isn't just nice to have; it's table stakes for retention at this price point.`;
  } else {
    return `Even at an average order value of **${formattedAOV}**, personalization significantly impacts retention. ${sizeCategory === "small" || sizeCategory === "medium" ? "The good news: with your customer base size, targeted segmentation is highly achievable with automated tools." : "While personalizing at scale is challenging, modern automation platforms make behaviorally-triggered, segment-specific campaigns accessible."} Generic batch-and-blast emails underperform by 50-70% compared to personalized messaging based on purchase behavior and preferences.`;
  }
}

/**
 * Generate at-risk customer rationale based on store size
 */
function generateAtRiskRationale(
  sizeCategory: StoreProfile["sizeCategory"],
  numberOfCustomers: number
): string {
  const formattedCustomers = formatNumber(numberOfCustomers);

  if (sizeCategory === "small") {
    return `With **${formattedCustomers} customers**, you have the advantage of being able to identify and personally reach at-risk segments quickly. Even manual review of customer cohorts can catch high-value customers before they churn.`;
  } else if (sizeCategory === "medium") {
    return `With **${formattedCustomers} customers**, manual monitoring isn't scalable, but automated systems can flag at-risk segments efficiently. Prioritizing the top 20% by LTV ensures you're focusing efforts where they matter most.`;
  } else {
    return `At **${formattedCustomers} customers**, scale requires automation. Predictive scoring models can identify at-risk customers based on behavioral patterns, allowing you to intervene proactively with the highest-value segments.`;
  }
}

/**
 * Generate engagement sequence rationale based on purchase frequency
 */
function generateEngagementSequenceRationale(purchaseFrequency: number): string {
  const daysBetweenPurchases = Math.round(365 / purchaseFrequency);

  if (purchaseFrequency < 2) {
    return `With customers purchasing roughly every **${daysBetweenPurchases} days**, you have a long window where they might disengage. A well-crafted sequence keeps your brand top-of-mind and provides ongoing value between purchases.`;
  } else if (purchaseFrequency < 4) {
    return `Your customers purchase approximately every **${daysBetweenPurchases} days**. A strategic email sequence fills these gaps, providing value, building brand affinity, and priming them for their next purchase.`;
  } else {
    return `With relatively high purchase frequency (every **${daysBetweenPurchases} days**), engagement sequences help establish your brand as a regular part of their routine, making competitors less relevant.`;
  }
}
