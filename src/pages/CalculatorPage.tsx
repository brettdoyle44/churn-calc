import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculator } from '../contexts/CalculatorContext';
import CalculatorForm from '../components/CalculatorForm';
import EmailCaptureForm from '../components/EmailCaptureForm';
import { calculateAllResults } from '../utils/calculations';
import { submitToHubSpot } from '../utils/hubspot';
import type { CalculatorInputs, UserInfo } from '../types';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const { setCalculatorInputs, setCalculatorResults, setUserInfo, calculatorInputs, calculatorResults } = useCalculator();
  
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  /**
   * Handle calculator form submission
   * Calculates results and shows email capture modal
   */
  const handleCalculatorSubmit = async (inputs: CalculatorInputs) => {
    try {
      setIsCalculating(true);
      setCalculationError(null);

      // Save inputs to context
      setCalculatorInputs(inputs);

      // Calculate results
      const results = calculateAllResults(inputs);

      // Save results to context
      setCalculatorResults(results);

      // Show email capture modal
      setShowEmailCapture(true);
    } catch (error) {
      console.error('Calculator error:', error);
      setCalculationError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while calculating your results. Please check your inputs and try again.'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * Handle email capture form submission
   * Saves user info, submits to HubSpot (non-blocking), and navigates to results
   */
  const handleEmailSubmit = async (userInfo: UserInfo) => {
    try {
      setIsSubmittingEmail(true);

      // Save user info to context
      setUserInfo(userInfo);

      // Submit to HubSpot in the background (non-blocking)
      // Don't await - we don't want to block the user experience
      if (calculatorInputs && calculatorResults) {
        submitToHubSpot(userInfo, calculatorInputs, calculatorResults).catch(err => {
          console.error('HubSpot submission failed:', err);
          // Continue anyway - don't block user
        });
      } else {
        console.warn('Cannot submit to HubSpot: missing calculator inputs or results');
      }

      // Hide the email capture modal
      setShowEmailCapture(false);

      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Email submission error:', error);
      // Even if there's an error, hide modal and navigate to results
      // The user has already filled out the form
      setShowEmailCapture(false);
      navigate('/results');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              How much is customer churn really costing your store?
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Most Shopify merchants lose 60-80% of customers and don't realize it. 
            Calculate your hidden revenue leak in 60 seconds.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Free forever</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>No credit card</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Enter your metrics
              </h3>
              <p className="text-gray-600">
                Share basic info about your store's revenue and customer base
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                See your impact
              </h3>
              <p className="text-gray-600">
                Discover exactly how much churn is costing your business
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-pink-600 rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get your strategy
              </h3>
              <p className="text-gray-600">
                Receive AI-powered recommendations to reduce churn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {calculationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{calculationError}</p>
              </div>
            )}
            <CalculatorForm 
              onSubmit={handleCalculatorSubmit} 
              isSubmitting={isCalculating}
            />
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      {showEmailCapture && calculatorResults && (
        <EmailCaptureForm
          calculatorResults={calculatorResults}
          onSubmit={handleEmailSubmit}
          isSubmitting={isSubmittingEmail}
        />
      )}
    </div>
  );
}
