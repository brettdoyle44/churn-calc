import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCalculator } from '../contexts/CalculatorContext';
import type { CalculatorInputs } from '../types';

export default function CalculatorForm() {
  const { setInputs, calculateResults } = useCalculator();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculatorInputs>();

  const onSubmit = async (data: CalculatorInputs) => {
    setInputs(data);
    await calculateResults();
    navigate('/results');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="averageOrderValue"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Average Order Value ($)
        </label>
        <input
          id="averageOrderValue"
          type="number"
          step="0.01"
          {...register('averageOrderValue', {
            required: 'Average order value is required',
            min: { value: 0, message: 'Must be a positive number' },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="50.00"
        />
        {errors.averageOrderValue && (
          <p className="mt-1 text-sm text-warning-600">
            {errors.averageOrderValue.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="customersPerMonth"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Active Customers Per Month
        </label>
        <input
          id="customersPerMonth"
          type="number"
          {...register('customersPerMonth', {
            required: 'Number of customers is required',
            min: { value: 1, message: 'Must be at least 1' },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="1000"
        />
        {errors.customersPerMonth && (
          <p className="mt-1 text-sm text-warning-600">
            {errors.customersPerMonth.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="churnRate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Monthly Churn Rate (%)
        </label>
        <input
          id="churnRate"
          type="number"
          step="0.1"
          {...register('churnRate', {
            required: 'Churn rate is required',
            min: { value: 0, message: 'Must be a positive number' },
            max: { value: 100, message: 'Cannot exceed 100%' },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="5.0"
        />
        {errors.churnRate && (
          <p className="mt-1 text-sm text-warning-600">
            {errors.churnRate.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Industry
        </label>
        <select
          id="industry"
          {...register('industry', { required: 'Industry is required' })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select your industry</option>
          <option value="Fashion & Apparel">Fashion & Apparel</option>
          <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
          <option value="Food & Beverage">Food & Beverage</option>
          <option value="Electronics">Electronics</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Health & Wellness">Health & Wellness</option>
          <option value="Sports & Outdoors">Sports & Outdoors</option>
          <option value="Other">Other</option>
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-warning-600">{errors.industry.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="businessModel"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Business Model
        </label>
        <select
          id="businessModel"
          {...register('businessModel', {
            required: 'Business model is required',
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select your business model</option>
          <option value="B2C">B2C (Direct to Consumer)</option>
          <option value="B2B">B2B (Business to Business)</option>
          <option value="Subscription">Subscription</option>
          <option value="Marketplace">Marketplace</option>
        </select>
        {errors.businessModel && (
          <p className="mt-1 text-sm text-warning-600">
            {errors.businessModel.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Calculate Churn Cost
      </button>
    </form>
  );
}

