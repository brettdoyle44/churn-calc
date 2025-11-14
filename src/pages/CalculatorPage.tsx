import CalculatorForm from '../components/CalculatorForm';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              ChurnGuard
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate the true cost of customer churn for your Shopify store and
            get AI-powered insights to reduce it.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Accurate Calculations
            </h3>
            <p className="text-gray-600">
              Get precise metrics on your monthly and annual churn costs, customer
              lifetime value, and more.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-12 w-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI-Powered Insights
            </h3>
            <p className="text-gray-600">
              Receive personalized recommendations powered by Claude AI to reduce
              churn and increase retention.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Industry Benchmarks
            </h3>
            <p className="text-gray-600">
              Compare your metrics against industry standards and understand where
              you stand.
            </p>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Calculate Your Churn Cost
          </h2>
          <CalculatorForm />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            All calculations are performed in your browser. Your data is never
            stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}

