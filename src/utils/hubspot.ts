import type { UserInfo, CalculatorInputs, CalculatorResults } from '../types';

/**
 * HubSpot contact property structure
 */
interface HubSpotProperty {
  property: string;
  value: string | number;
}

/**
 * HubSpot contact data structure for createOrUpdate endpoint
 */
interface HubSpotContactData {
  properties: HubSpotProperty[];
}

/**
 * Store size categorization result
 */
interface StoreCategorization {
  sizeCategory: 'small' | 'medium' | 'large' | 'enterprise';
  description: string;
}

/**
 * Calculate a lead score based on annual revenue lost
 * Higher revenue loss indicates a more valuable lead
 * 
 * @param results - Calculator results containing financial metrics
 * @returns Lead score from 0-100
 */
function calculateLeadScore(results: CalculatorResults): number {
  // Simple scoring based on annual loss
  if (results.annualRevenueLost > 100000) return 90;
  if (results.annualRevenueLost > 50000) return 75;
  if (results.annualRevenueLost > 25000) return 60;
  if (results.annualRevenueLost > 10000) return 40;
  return 20;
}

/**
 * Categorize store size based on customer count and revenue metrics
 * 
 * @param inputs - Calculator inputs with business metrics
 * @param results - Calculator results with financial metrics
 * @returns Store categorization with size and description
 */
function categorizeStore(
  inputs: CalculatorInputs,
  results: CalculatorResults
): StoreCategorization {
  const { numberOfCustomers } = inputs;
  const { annualRevenueLost } = results;

  if (numberOfCustomers >= 10000 || annualRevenueLost >= 100000) {
    return {
      sizeCategory: 'enterprise',
      description: 'Enterprise-level business with significant customer base',
    };
  }

  if (numberOfCustomers >= 5000 || annualRevenueLost >= 50000) {
    return {
      sizeCategory: 'large',
      description: 'Large business with substantial revenue',
    };
  }

  if (numberOfCustomers >= 1000 || annualRevenueLost >= 10000) {
    return {
      sizeCategory: 'medium',
      description: 'Medium-sized business with growth potential',
    };
  }

  return {
    sizeCategory: 'small',
    description: 'Small business or startup',
  };
}

/**
 * Make an HTTP request with automatic retry logic
 * Retries once after a 1-second delay if the initial request fails
 * 
 * @param url - The URL to send the request to
 * @param options - Fetch options (method, headers, body, etc.)
 * @param maxRetries - Maximum number of retry attempts (default: 1)
 * @returns Response from the successful request
 * @throws Error if all retry attempts fail
 */
async function makeRequestWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 1
): Promise<Response> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (i === maxRetries) throw error;
      console.log(`Request failed, retrying in 1 second... (attempt ${i + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
    }
  }
  // TypeScript guard - should never reach here
  throw new Error('Retry logic failed unexpectedly');
}

/**
 * Add a contact to a HubSpot list
 * 
 * @param email - Contact email address
 * @param listId - HubSpot list ID to add the contact to
 * @param accessToken - HubSpot API access token
 * @returns True if successful, false otherwise
 */
async function addContactToList(
  email: string,
  listId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const url = `https://api.hubapi.com/contacts/v1/lists/${listId}/add`;
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emails: [email],
      }),
    };

    await makeRequestWithRetry(url, options);
    console.log(`Successfully added contact to list ${listId}`);
    return true;
  } catch (error) {
    console.error('Error adding contact to list:', error);
    return false;
  }
}

/**
 * Submit lead data to HubSpot
 * Creates or updates a contact with calculator results and business metrics
 * Non-blocking: will not throw errors or break user experience if HubSpot is unavailable
 * 
 * @param userInfo - User contact information (email, store name, URL)
 * @param inputs - Calculator input values (customers, AOV, churn rate, etc.)
 * @param results - Calculated results (revenue lost, customer lifespan, etc.)
 * @returns Promise that resolves when submission is complete (or silently fails)
 * 
 * @example
 * ```typescript
 * await submitToHubSpot(
 *   { email: 'john@example.com', storeName: 'John\'s Store', storeUrl: 'https://example.com' },
 *   { averageOrderValue: 100, numberOfCustomers: 1000, purchaseFrequency: 2, churnRate: 75 },
 *   { annualRevenueLost: 50000, monthlyRevenueLost: 4166, ... }
 * );
 * ```
 */
export async function submitToHubSpot(
  userInfo: UserInfo,
  inputs: CalculatorInputs,
  results: CalculatorResults
): Promise<void> {
  // Wrap entire function in try-catch to ensure non-blocking behavior
  try {
    // 1. Get environment variables
    const accessToken = import.meta.env.VITE_HUBSPOT_ACCESS_TOKEN;
    const portalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
    const listId = import.meta.env.VITE_HUBSPOT_LIST_ID; // Optional: List ID for "Calculator Leads"

    // If missing credentials, log warning and return (don't throw)
    if (!accessToken || !portalId) {
      console.warn('HubSpot credentials not configured. Set VITE_HUBSPOT_ACCESS_TOKEN and VITE_HUBSPOT_PORTAL_ID in .env');
      return;
    }

    // Test mode: log data instead of sending in development
    const TEST_MODE = import.meta.env.DEV;

    // 2. Prepare contact data
    const storeCategorization = categorizeStore(inputs, results);
    const leadScore = calculateLeadScore(results);
    const isHighValueLead = results.annualRevenueLost > 50000;

    // Extract first name from store name (first word)
    const firstname = userInfo.storeName.split(' ')[0];

    const contactData: HubSpotContactData = {
      properties: [
        { property: 'email', value: userInfo.email },
        { property: 'firstname', value: firstname },
        { property: 'company', value: userInfo.storeName },
        { property: 'website', value: userInfo.storeUrl || '' },
        
        // Custom properties (create these in HubSpot first)
        { property: 'annual_revenue_lost', value: results.annualRevenueLost },
        { property: 'churn_rate', value: inputs.churnRate },
        { property: 'total_customers', value: inputs.numberOfCustomers },
        { property: 'average_order_value', value: inputs.averageOrderValue },
        { property: 'purchase_frequency', value: inputs.purchaseFrequency },
        { property: 'calculator_completed_date', value: new Date().toISOString() },
        
        // Calculated fields
        { property: 'lead_score', value: leadScore },
        { property: 'store_size', value: storeCategorization.sizeCategory },
        { property: 'monthly_revenue_lost', value: results.monthlyRevenueLost },
        { property: 'three_year_impact', value: results.threeYearImpact },
        { property: 'customer_lifespan', value: results.customerLifespan },
        { property: 'customers_lost_per_year', value: results.customersLostPerYear },
      ],
    };

    // Add optional properties if available
    if (userInfo.biggestChallenge) {
      contactData.properties.push({
        property: 'biggest_challenge',
        value: userInfo.biggestChallenge,
      });
    }

    if (inputs.customerAcquisitionCost) {
      contactData.properties.push({
        property: 'customer_acquisition_cost',
        value: inputs.customerAcquisitionCost,
      });
    }

    if (inputs.grossMargin) {
      contactData.properties.push({
        property: 'gross_margin',
        value: inputs.grossMargin,
      });
    }

    // High-value lead detection
    if (isHighValueLead) {
      contactData.properties.push({
        property: 'high_value_lead',
        value: 'true',
      });
    }

    // Test mode: log and return early
    if (TEST_MODE) {
      console.log('🧪 HubSpot submission (TEST MODE):', {
        email: userInfo.email,
        storeName: userInfo.storeName,
        leadScore,
        storeSize: storeCategorization.sizeCategory,
        annualRevenueLost: results.annualRevenueLost,
        isHighValueLead,
        contactData,
      });
      return;
    }

    // 3. Make API call to HubSpot (createOrUpdate endpoint)
    const email = encodeURIComponent(userInfo.email);
    const url = `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${email}`;
    
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    };

    console.log('📤 Submitting contact to HubSpot...');
    const response = await makeRequestWithRetry(url, options);
    const responseData = await response.json();
    
    console.log('✅ Successfully submitted to HubSpot:', {
      email: userInfo.email,
      contactId: responseData.vid,
      isNew: responseData.isNew,
    });

    // 4. Add contact to list (if list ID is configured)
    if (listId) {
      await addContactToList(userInfo.email, listId, accessToken);
    } else {
      console.log('ℹ️ No HubSpot list ID configured. Set VITE_HUBSPOT_LIST_ID to add contacts to a list.');
    }

    // 5. High-value lead detection logging
    if (isHighValueLead) {
      console.log('⭐ High-value lead detected!', {
        email: userInfo.email,
        annualRevenueLost: results.annualRevenueLost,
        leadScore,
      });
      // Future enhancement: Trigger webhook to Slack or other notification service
    }

  } catch (error) {
    // Log errors but don't throw - this should never break user experience
    console.error('❌ Error submitting to HubSpot (non-blocking):', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    // Silently fail - user experience continues unaffected
  }
}

/**
 * Export helper functions for testing and reuse
 */
export { calculateLeadScore, categorizeStore };
