import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { useCalculator } from '../contexts/CalculatorContext';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import EmailCaptureForm from './EmailCaptureForm';
import LoadingSpinner from './LoadingSpinner';

export default function ResultsDisplay() {
  const { results, analysis, loading } = useCalculator();
  const [showFullReport, setShowFullReport] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!results || !analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No results to display</p>
      </div>
    );
  }

  // Generate projection data for the chart
  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    withChurn: results.monthlyChurnCost * (i + 1),
    withReduction:
      results.monthlyChurnCost * 0.5 * (i + 1), // Assuming 50% churn reduction
  }));

  const urgencyColors = {
    low: 'bg-accent-100 text-accent-800 border-accent-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-warning-100 text-warning-800 border-warning-300',
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Monthly Churn Cost
          </h3>
          <p className="text-3xl font-bold text-warning-600">
            {formatCurrency(results.monthlyChurnCost)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Annual Churn Cost
          </h3>
          <p className="text-3xl font-bold text-warning-600">
            {formatCurrency(results.annualChurnCost)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Potential Recovery
          </h3>
          <p className="text-3xl font-bold text-accent-600">
            {formatCurrency(results.potentialRecovery)}/mo
          </p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Customer Lifetime Value
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(results.averageCustomerLifetimeValue)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Retention Rate
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatPercentage(results.retentionRate)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Customers Lost/Month
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {results.customersLostPerMonth.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Email Capture Form */}
      {!showFullReport && (
        <EmailCaptureForm onSuccess={() => setShowFullReport(true)} />
      )}

      {/* AI Analysis - Only show after email capture */}
      {showFullReport && (
        <>
          {/* Urgency Badge */}
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${
              urgencyColors[analysis.urgencyLevel]
            }`}
          >
            Urgency Level: {analysis.urgencyLevel.toUpperCase()}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Projection Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12-Month Cost Projection
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="withChurn"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Current Churn"
                />
                <Line
                  type="monotone"
                  dataKey="withReduction"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="With 50% Reduction"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Key Insights
            </h2>
            <ul className="space-y-3">
              {analysis.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recommended Actions
            </h2>
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="border-l-4 border-accent-500 pl-4 py-2"
                >
                  <div className="text-gray-700">
                    <ReactMarkdown>
                      {recommendation}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Comparison */}
          {analysis.industryComparison && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Industry Comparison
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {analysis.industryComparison}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

