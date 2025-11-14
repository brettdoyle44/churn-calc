import Anthropic from '@anthropic-ai/sdk';
import type { CalculatorInputs, CalculationResults, AIAnalysis } from '../types';
import { generateAnalysisPrompt } from './prompts';
import { getFallbackAnalysis } from './fallbackAnalysis';

export async function generateAIAnalysis(
  inputs: CalculatorInputs,
  results: CalculationResults
): Promise<AIAnalysis> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  // If no API key, return fallback analysis
  if (!apiKey) {
    console.warn('No Anthropic API key found, using fallback analysis');
    return getFallbackAnalysis(inputs, results);
  }

  try {
    const anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, this should be a backend call
    });

    const prompt = generateAnalysisPrompt(inputs, results);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the text content from the response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    // Parse the JSON response
    const analysisText = textContent.text;
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not find JSON in response');
    }

    const analysis: AIAnalysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    // Return fallback analysis on error
    return getFallbackAnalysis(inputs, results);
  }
}

