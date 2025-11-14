import Anthropic from "@anthropic-ai/sdk";
import type {
  CalculatorInputs,
  CalculatorResults,
  UserInfo,
  AIAnalysis,
} from "../types";
import { categorizeStore } from "./calculations";
import { buildChurnAnalysisPrompt } from "./prompts";

/**
 * Generates AI-powered churn analysis using Claude AI.
 *
 * This function orchestrates the complete AI analysis generation process:
 * 1. Categorizes the store based on its metrics
 * 2. Builds a comprehensive prompt with all relevant data
 * 3. Calls the Anthropic Claude API to generate personalized analysis
 * 4. Returns formatted analysis with metadata
 *
 * The analysis includes:
 * - Situation assessment comparing to industry benchmarks
 * - Root cause analysis of churn drivers
 * - Immediate action plan with 3 prioritized tactics
 * - 90-day implementation roadmap
 * - Success metrics to track
 *
 * @param inputs - The calculator input values from the user
 * @param results - The calculated churn metrics and financial impact
 * @param userInfo - User contact information and store details
 * @returns Promise resolving to AIAnalysis object with markdown content
 * @throws Error if API key is missing or API call fails
 *
 * @example
 * ```typescript
 * const analysis = await generateChurnAnalysis(inputs, results, userInfo);
 * console.log(analysis.content); // Markdown-formatted analysis
 * console.log(analysis.model); // "claude-sonnet-4-20250514"
 * ```
 */
export async function generateChurnAnalysis(
  inputs: CalculatorInputs,
  results: CalculatorResults,
  userInfo: UserInfo
): Promise<AIAnalysis> {
  try {
    // Validate API key exists
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your environment variables."
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });

    // Step 1: Calculate store profile for contextual analysis
    const storeProfile = categorizeStore(inputs, results);

    // Step 2: Build comprehensive prompt with all context
    const prompt = buildChurnAnalysisPrompt(
      inputs,
      results,
      userInfo,
      storeProfile
    );

    console.log("Generating AI analysis for:", userInfo.storeName);

    // Step 3: Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Step 4: Extract response text
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude API");
    }

    const analysisText = content.text;

    console.log("AI analysis generated successfully");

    // Step 5: Return formatted AIAnalysis object
    return {
      content: analysisText,
      generatedAt: new Date().toISOString(),
      model: "claude-sonnet-4-20250514",
      fallbackUsed: false,
    };
  } catch (error) {
    // Log error details for debugging
    console.error("Failed to generate AI analysis:", error);

    // Re-throw error to be handled by component
    // Component will use fallback analysis
    throw error;
  }
}
