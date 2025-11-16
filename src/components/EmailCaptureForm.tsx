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
        <Dialog.Panel className="mx-auto max-w-md w-full polaris-card animate-scale-up">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-text">ChurnGuard</h1>
          </div>

          {/* Teaser Section */}
          <div className="text-center mb-8">
            <div className="mb-2">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">
              Your Churn Analysis is Ready
            </h2>
            <p className="text-text-subdued mb-4">
              You're losing approximately...
            </p>
            <div className="relative inline-block">
              <div className="text-4xl font-semibold text-critical blur-sm select-none">
                {formatCurrency(calculatorResults.annualRevenueLost)}
              </div>
              <div className="text-sm text-text-subdued mt-1 blur-sm select-none">
                per year
              </div>
            </div>
          </div>

          {/* Unlock Section */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-text mb-2">
              Enter your details to see your complete analysis
            </h3>
            <p className="text-sm text-text-subdued">
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
              <div key={index} className="flex items-center text-sm text-text">
                <CheckCircleIcon className="h-5 w-5 text-success mr-2 flex-shrink-0" />
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
                className="polaris-label"
              >
                Email Address <span className="text-critical">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@yourstore.com"
                disabled={isSubmitting}
                className={`polaris-input ${errors.email ? 'polaris-input-error' : ''}`}
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
                <p id="email-error" className="mt-1 text-sm text-critical">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Store Name */}
            <div>
              <label
                htmlFor="storeName"
                className="polaris-label"
              >
                Store Name <span className="text-critical">*</span>
              </label>
              <input
                id="storeName"
                type="text"
                placeholder="My Shopify Store"
                disabled={isSubmitting}
                className={`polaris-input ${errors.storeName ? 'polaris-input-error' : ''}`}
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
                <p id="storeName-error" className="mt-1 text-sm text-critical">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            {/* Store URL (Optional) */}
            <div>
              <label
                htmlFor="storeUrl"
                className="polaris-label"
              >
                Shopify Store URL <span className="text-text-subdued">(Optional)</span>
              </label>
              <input
                id="storeUrl"
                type="text"
                placeholder="mystore.myshopify.com"
                disabled={isSubmitting}
                className={`polaris-input ${errors.storeUrl ? 'polaris-input-error' : ''}`}
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
                <p id="storeUrl-error" className="mt-1 text-sm text-critical">
                  {errors.storeUrl.message}
                </p>
              ) : (
                <p id="storeUrl-help" className="mt-1 text-xs text-text-subdued">
                  Optional - helps us personalize your analysis
                </p>
              )}
            </div>

            {/* Biggest Challenge (Optional) */}
            <div>
              <label
                htmlFor="biggestChallenge"
                className="polaris-label"
              >
                What's your biggest retention challenge?{' '}
                <span className="text-text-subdued">(Optional)</span>
              </label>
              <textarea
                id="biggestChallenge"
                rows={3}
                placeholder="e.g., customers only buy once..."
                disabled={isSubmitting}
                className="polaris-input resize-none"
                {...register('biggestChallenge')}
                aria-describedby="biggestChallenge-help"
              />
              <p id="biggestChallenge-help" className="mt-1 text-xs text-text-subdued">
                Optional - helps our AI give better recommendations
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            <p className="text-xs text-text-subdued text-center">
              By continuing, you agree to receive occasional retention tips and
              product updates.{' '}
              <a href="#" className="text-interactive hover:underline">
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
