import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { CalculatorInputs } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface StepWizardCalculatorProps {
  onSubmit: (data: CalculatorInputs) => void;
  isSubmitting?: boolean;
}

interface FormData {
  averageOrderValue: number;
  numberOfCustomers: number;
  purchaseFrequency: number;
  churnRate: number;
  customerAcquisitionCost?: number;
  grossMargin?: number;
}

export default function StepWizardCalculator({ onSubmit, isSubmitting = false }: StepWizardCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({
    purchaseFrequency: 2,
    churnRate: 75,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      id: 'aov',
      title: "Let's start with your revenue",
      question: "What's your average order value?",
      field: 'averageOrderValue',
      type: 'currency',
      placeholder: '85',
      insight: (value: number) =>
        value > 100 ? 'Great AOV! Higher values mean churn hits harder.' : 'Every dollar of AOV lost to churn compounds over time.',
      benchmark: 'Average e-commerce AOV: $75-$100',
    },
    {
      id: 'customers',
      title: 'Now your customer base',
      question: 'How many active customers do you have?',
      field: 'numberOfCustomers',
      type: 'number',
      placeholder: '5000',
      insight: (value: number) =>
        value > 10000 ? "Solid customer base! Let's make sure you're retaining them." : 'Growing your base? Retention will accelerate that growth.',
      benchmark: 'Most Shopify stores: 1K-10K customers',
    },
    {
      id: 'frequency',
      title: 'Purchase behavior matters',
      question: 'How often do customers buy per year?',
      field: 'purchaseFrequency',
      type: 'number',
      placeholder: '2.5',
      step: '0.1',
      insight: (value: number) =>
        value > 3 ? 'High frequency! Your retention strategy is critical.' : 'Increasing frequency can dramatically boost LTV.',
      benchmark: 'E-commerce average: 2-3 purchases/year',
    },
    {
      id: 'churn',
      title: 'The crucial metric',
      question: "What % of customers don't return?",
      field: 'churnRate',
      type: 'percentage',
      placeholder: '75',
      optional: true,
      insight: (value: number) =>
        value > 70 ? '⚠️ High churn alert! This is costing you significantly.' : value > 50 ? "Above-average churn. There's room to improve." : "Good retention! Let's optimize further.",
      benchmark: 'Industry average: 60-80%',
    },
  ];

  const currentStepData = steps[currentStep];

  const validateStep = (value: number | undefined): boolean => {
    if (currentStepData.optional && !value) return true;
    
    if (!value || value <= 0) {
      setErrors({ [currentStepData.field]: 'Please enter a valid value' });
      return false;
    }

    if (currentStepData.type === 'percentage' && value > 100) {
      setErrors({ [currentStepData.field]: 'Cannot exceed 100%' });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    const value = formData[currentStepData.field as keyof FormData];
    
    if (!validateStep(value)) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    const inputs: CalculatorInputs = {
      averageOrderValue: formData.averageOrderValue || 0,
      numberOfCustomers: formData.numberOfCustomers || 0,
      purchaseFrequency: formData.purchaseFrequency || 2,
      churnRate: formData.churnRate || 75,
      customerAcquisitionCost: formData.customerAcquisitionCost,
      grossMargin: formData.grossMargin,
    };

    onSubmit(inputs);
  };

  const updateValue = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, [field]: numValue });
    setErrors({});
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentValue = formData[currentStepData.field as keyof FormData];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-voyage-ocean">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-voyage-ocean to-voyage-seafoam"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100"
        >
          {/* Step title */}
          <p className="text-sm font-semibold text-voyage-ocean uppercase tracking-wide mb-3">
            {currentStepData.title}
          </p>

          {/* Question */}
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
            {currentStepData.question}
          </h2>

          {/* Input */}
          <div className="mb-6">
            <div className="relative">
              {currentStepData.type === 'currency' && (
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-gray-400">
                  $
                </span>
              )}
              <input
                type="number"
                value={currentValue || ''}
                onChange={(e) => updateValue(currentStepData.field, e.target.value)}
                placeholder={currentStepData.placeholder}
                step={currentStepData.step || '1'}
                className={`w-full text-4xl md:text-5xl font-bold text-gray-900 ${
                  currentStepData.type === 'currency' ? 'pl-12' : 'pl-4'
                } pr-4 py-6 border-2 ${
                  errors[currentStepData.field]
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-voyage-ocean'
                } rounded-xl focus:outline-none transition-colors`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNext();
                }}
              />
              {currentStepData.type === 'percentage' && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-gray-400">
                  %
                </span>
              )}
            </div>
            {errors[currentStepData.field] && (
              <p className="mt-2 text-sm text-red-600">{errors[currentStepData.field]}</p>
            )}
          </div>

          {/* Benchmark */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              📊 <strong>Benchmark:</strong> {currentStepData.benchmark}
            </p>
          </div>

          {/* Insight */}
          {currentValue && currentValue > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-gradient-to-r from-voyage-seafoam/10 to-voyage-ocean/10 rounded-lg border border-voyage-seafoam/30"
            >
              <p className="text-sm font-medium text-voyage-navy">
                💡 {currentStepData.insight(currentValue)}
              </p>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isSubmitting || !currentValue}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-voyage-ocean to-voyage-seafoam text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Calculating...
                </>
              ) : currentStep < steps.length - 1 ? (
                <>
                  Continue
                  <ChevronRightIcon className="w-5 h-5" />
                </>
              ) : (
                'Calculate My Loss →'
              )}
            </button>
          </div>

          {/* Skip option for optional fields */}
          {currentStepData.optional && (
            <button
              onClick={() => {
                setFormData({ ...formData, [currentStepData.field]: 75 });
                handleNext();
              }}
              className="w-full mt-4 text-sm text-gray-500 hover:text-voyage-ocean transition-colors"
            >
              Skip this step (we'll use industry average)
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

