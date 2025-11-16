import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculator } from '../contexts/CalculatorContext';
import SplitScreenHero from '../components/SplitScreenHero';
import VoyageDifference from '../components/VoyageDifference';
import WhyVoyage from '../components/WhyVoyage';
import SocialProof from '../components/SocialProof';
import StepWizardCalculator from '../components/StepWizardCalculator';
import EmailCaptureForm from '../components/EmailCaptureForm';
import Footer from '../components/Footer';
import { calculateAllResults } from '../utils/calculations';
import { submitToHubSpot } from '../utils/hubspot';
import type { CalculatorInputs, UserInfo } from '../types';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const calculatorRef = useRef<HTMLDivElement>(null);
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

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <SplitScreenHero onGetStartedClick={scrollToCalculator} />

      {/* Voyage Difference Section */}
      <VoyageDifference />

      {/* Why Voyage Section */}
      <WhyVoyage />

      {/* Social Proof Section */}
      <SocialProof />

      {/* Calculator Section */}
      <div
        id="calculator"
        ref={calculatorRef}
        className="py-24 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-voyage-navy mb-4">
              Calculate Your Loss
            </h2>
            <p className="text-xl text-gray-600">
              Answer 4 quick questions to see your churn impact
            </p>
          </div>

          {/* Error message */}
          {calculationError && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{calculationError}</p>
            </div>
          )}

          {/* Wizard Calculator */}
          <StepWizardCalculator
            onSubmit={handleCalculatorSubmit}
            isSubmitting={isCalculating}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Email Capture Modal */}
      {showEmailCapture && calculatorResults && (
        <EmailCaptureForm
          calculatorResults={calculatorResults}
          onSubmit={handleEmailSubmit}
          isSubmitting={isSubmittingEmail}
        />
      )}
    </>
  );
}
