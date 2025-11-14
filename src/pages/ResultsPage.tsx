import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCalculator } from '../contexts/CalculatorContext';
import ResultsDisplay from '../components/ResultsDisplay';

export default function ResultsPage() {
  const { inputs, results } = useCalculator();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if no inputs/results
    if (!inputs || !results) {
      navigate('/');
    }
  }, [inputs, results, navigate]);

  if (!inputs || !results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Calculator
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Your Churn Analysis Results
          </h1>
          <p className="text-gray-600 mt-2">
            Industry: {inputs.industry} | Business Model: {inputs.businessModel}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ResultsDisplay />
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white mt-12">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Reduce Your Churn?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Implement these recommendations to start saving money and retaining more
            customers today.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Calculate Again
          </button>
        </div>
      </div>
    </div>
  );
}

