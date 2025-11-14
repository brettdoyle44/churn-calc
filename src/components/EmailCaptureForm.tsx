import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { CalculatorResults, UserInfo } from '../types';

interface EmailCaptureFormProps {
  calculatorResults: CalculatorResults;
  onSubmit: (userInfo: UserInfo) => void;
  isSubmitting: boolean;
}

interface FormData {
  email: string;
  storeName: string;
  storeUrl?: string;
  biggestChallenge?: string;
}

export default function EmailCaptureForm({
  calculatorResults,
  onSubmit,
  isSubmitting,
}: EmailCaptureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      email: data.email,
      storeName: data.storeName,
      storeUrl: data.storeUrl,
      biggestChallenge: data.biggestChallenge,
    });
  };

  // Format the annual revenue lost for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog
      open={true}
      onClose={() => {
        // Intentionally empty - cannot be dismissed
      }}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Modal card */}
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-scale-up">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ChurnGuard</h1>
          </div>

          {/* Teaser Section */}
          <div className="text-center mb-8">
            <div className="mb-2">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your Churn Analysis is Ready
            </h2>
            <p className="text-gray-600 mb-4">
              You're losing approximately...
            </p>
            <div className="relative inline-block">
              <div className="text-4xl font-bold text-red-600 blur-sm select-none">
                {formatCurrency(calculatorResults.annualRevenueLost)}
              </div>
              <div className="text-sm text-gray-600 mt-1 blur-sm select-none">
                per year
              </div>
            </div>
          </div>

          {/* Unlock Section */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Enter your details to see your complete analysis
            </h3>
            <p className="text-sm text-gray-600">
              Instant access to your personalized churn reduction strategy
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6 space-y-2">
            {[
              'Full churn cost breakdown',
              'AI-powered reduction strategy',
              '90-day implementation roadmap',
              'Industry benchmarking',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@yourstore.com"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Store Name */}
            <div>
              <label
                htmlFor="storeName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                id="storeName"
                type="text"
                placeholder="My Shopify Store"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.storeName ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('storeName', {
                  required: 'Store name is required',
                  minLength: {
                    value: 2,
                    message: 'Store name must be at least 2 characters',
                  },
                })}
                aria-invalid={errors.storeName ? 'true' : 'false'}
                aria-describedby={errors.storeName ? 'storeName-error' : undefined}
              />
              {errors.storeName && (
                <p id="storeName-error" className="mt-1 text-sm text-red-600">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            {/* Store URL (Optional) */}
            <div>
              <label
                htmlFor="storeUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shopify Store URL <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="storeUrl"
                type="text"
                placeholder="mystore.myshopify.com"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.storeUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('storeUrl', {
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                    message: 'Invalid URL format',
                  },
                })}
                aria-invalid={errors.storeUrl ? 'true' : 'false'}
                aria-describedby={
                  errors.storeUrl ? 'storeUrl-error' : 'storeUrl-help'
                }
              />
              {errors.storeUrl ? (
                <p id="storeUrl-error" className="mt-1 text-sm text-red-600">
                  {errors.storeUrl.message}
                </p>
              ) : (
                <p id="storeUrl-help" className="mt-1 text-xs text-gray-500">
                  Optional - helps us personalize your analysis
                </p>
              )}
            </div>

            {/* Biggest Challenge (Optional) */}
            <div>
              <label
                htmlFor="biggestChallenge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                What's your biggest retention challenge?{' '}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="biggestChallenge"
                rows={3}
                placeholder="e.g., customers only buy once..."
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                {...register('biggestChallenge')}
                aria-describedby="biggestChallenge-help"
              />
              <p id="biggestChallenge-help" className="mt-1 text-xs text-gray-500">
                Optional - helps our AI give better recommendations
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Show Me My Results →
                </>
              )}
            </button>

            {/* Legal Text */}
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to receive occasional retention tips and
              product updates.{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              . Unsubscribe anytime.
            </p>
          </form>
        </Dialog.Panel>
      </div>

      {/* Custom CSS for animation */}
      <style>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `}</style>
    </Dialog>
  );
}
