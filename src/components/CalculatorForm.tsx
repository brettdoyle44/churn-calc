import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InformationCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';
import type { CalculatorInputs } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CalculatorFormProps {
  onSubmit: (data: CalculatorInputs) => void;
  isSubmitting?: boolean;
}

interface FormData {
  averageOrderValue: string;
  numberOfCustomers: string;
  purchaseFrequency: string;
  churnRate: string;
  customerAcquisitionCost: string;
  grossMargin: string;
}

const CalculatorForm = ({ onSubmit, isSubmitting = false }: CalculatorFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      averageOrderValue: '',
      numberOfCustomers: '',
      purchaseFrequency: '2',
      churnRate: '',
      customerAcquisitionCost: '',
      grossMargin: '',
    },
  });

  // Format number with commas
  const formatNumber = (value: string): string => {
    const numValue = value.replace(/[^0-9.]/g, '');
    if (!numValue) return '';
    
    const parts = numValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
  };

  // Format currency with $ and commas
  const formatCurrency = (value: string): string => {
    if (!value) return '';
    const formatted = formatNumber(value);
    return formatted ? `$${formatted}` : '';
  };

  // Parse formatted string back to number
  const parseFormattedNumber = (value: string): number => {
    return parseFloat(value.replace(/[$,]/g, '')) || 0;
  };

  const handleFormSubmit = (data: FormData) => {
    const inputs: CalculatorInputs = {
      averageOrderValue: parseFormattedNumber(data.averageOrderValue),
      numberOfCustomers: parseFormattedNumber(data.numberOfCustomers),
      purchaseFrequency: parseFloat(data.purchaseFrequency) || 2,
      churnRate: data.churnRate ? parseFloat(data.churnRate) : 75,
      customerAcquisitionCost: data.customerAcquisitionCost 
        ? parseFormattedNumber(data.customerAcquisitionCost) 
        : undefined,
      grossMargin: data.grossMargin ? parseFloat(data.grossMargin) : undefined,
    };

    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Average Order Value */}
      <div>
        <label htmlFor="averageOrderValue" className="label-mercury">
          Average Order Value ($)
          <span className="text-warning-500 ml-1">*</span>
        </label>
        <Controller
          name="averageOrderValue"
          control={control}
          rules={{
            required: 'Average order value is required',
            validate: (value) => {
              const num = parseFormattedNumber(value);
              if (num < 1) return 'Must be at least $1';
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              type="text"
              id="averageOrderValue"
              placeholder="e.g., $85"
              value={value}
              onChange={(e) => {
                const formatted = formatCurrency(e.target.value);
                onChange(formatted);
              }}
              onBlur={onBlur}
              className={`input-mercury ${
                errors.averageOrderValue ? 'ring-warning-300 border-warning-300' : ''
              }`}
            />
          )}
        />
        {errors.averageOrderValue ? (
          <p className="mt-2 text-sm text-warning-600">{errors.averageOrderValue.message}</p>
        ) : (
          <p className="mt-2 text-sm text-navy-500">Average amount customers spend per order</p>
        )}
      </div>

      {/* Total Customers */}
      <div>
        <label htmlFor="numberOfCustomers" className="label-mercury">
          Total Customers
          <span className="text-warning-500 ml-1">*</span>
        </label>
        <Controller
          name="numberOfCustomers"
          control={control}
          rules={{
            required: 'Total customers is required',
            validate: (value) => {
              const num = parseFormattedNumber(value);
              if (num < 1) return 'Must be at least 1 customer';
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              type="text"
              id="numberOfCustomers"
              placeholder="e.g., 5,000"
              value={value}
              onChange={(e) => {
                const formatted = formatNumber(e.target.value);
                onChange(formatted);
              }}
              onBlur={onBlur}
              className={`input-mercury ${
                errors.numberOfCustomers ? 'ring-warning-300 border-warning-300' : ''
              }`}
            />
          )}
        />
        {errors.numberOfCustomers ? (
          <p className="mt-2 text-sm text-warning-600">{errors.numberOfCustomers.message}</p>
        ) : (
          <p className="mt-2 text-sm text-navy-500">Your active customer base</p>
        )}
      </div>

      {/* Purchase Frequency */}
      <div>
        <label htmlFor="purchaseFrequency" className="label-mercury">
          Purchase Frequency (per year)
          <span className="text-warning-500 ml-1">*</span>
        </label>
        <Controller
          name="purchaseFrequency"
          control={control}
          rules={{
            required: 'Purchase frequency is required',
            validate: (value) => {
              const num = parseFloat(value);
              if (num < 0.1) return 'Must be at least 0.1';
              return true;
            },
          }}
          render={({ field }) => (
            <input
              type="number"
              id="purchaseFrequency"
              placeholder="e.g., 2.5"
              step="0.1"
              min="0.1"
              {...field}
              className={`input-mercury ${
                errors.purchaseFrequency ? 'ring-warning-300 border-warning-300' : ''
              }`}
            />
          )}
        />
        {errors.purchaseFrequency ? (
          <p className="mt-2 text-sm text-warning-600">{errors.purchaseFrequency.message}</p>
        ) : (
          <p className="mt-2 text-sm text-navy-500">How many times per year customers typically buy</p>
        )}
      </div>

      {/* Current Churn Rate */}
      <div>
        <label htmlFor="churnRate" className="flex items-center label-mercury">
          Current Churn Rate (%)
          <Popover className="relative ml-2">
            <Popover.Button className="text-navy-400 hover:text-navy-600 transition-colors">
              <InformationCircleIcon className="h-5 w-5" />
            </Popover.Button>
            <Popover.Panel className="absolute z-10 w-64 px-4 py-3 mt-2 text-sm bg-navy-900 text-white rounded-mercury shadow-mercury-lg">
              Most Shopify stores see 60-80% churn
            </Popover.Panel>
          </Popover>
        </label>
        <Controller
          name="churnRate"
          control={control}
          rules={{
            validate: (value) => {
              if (value && parseFloat(value) < 0) return 'Cannot be negative';
              if (value && parseFloat(value) > 100) return 'Cannot exceed 100%';
              return true;
            },
          }}
          render={({ field }) => (
            <input
              type="number"
              id="churnRate"
              placeholder="Leave blank if unsure"
              step="0.1"
              min="0"
              max="100"
              {...field}
              className={`input-mercury ${
                errors.churnRate ? 'ring-warning-300 border-warning-300' : ''
              }`}
            />
          )}
        />
        {errors.churnRate ? (
          <p className="mt-2 text-sm text-warning-600">{errors.churnRate.message}</p>
        ) : (
          <p className="mt-2 text-sm text-navy-500">
            What % of customers don't return? (We'll use 75% industry average if blank)
          </p>
        )}
      </div>

      {/* Advanced Options - Collapsible */}
      <div className="border-t border-mercury-200 pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-navy-900 hover:text-navy-950 transition-colors"
        >
          <span>Advanced Options</span>
          {showAdvanced ? (
            <ChevronUpIcon className="h-5 w-5 text-navy-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-navy-600" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {/* Customer Acquisition Cost */}
            <div>
              <label htmlFor="customerAcquisitionCost" className="label-mercury">
                Customer Acquisition Cost ($)
              </label>
              <Controller
                name="customerAcquisitionCost"
                control={control}
                rules={{
                  validate: (value) => {
                    if (value && parseFormattedNumber(value) < 0) return 'Cannot be negative';
                    return true;
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    type="text"
                    id="customerAcquisitionCost"
                    placeholder="e.g., $50"
                    value={value}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      onChange(formatted);
                    }}
                    onBlur={onBlur}
                    className={`input-mercury ${
                      errors.customerAcquisitionCost ? 'ring-warning-300 border-warning-300' : ''
                    }`}
                  />
                )}
              />
              {errors.customerAcquisitionCost ? (
                <p className="mt-2 text-sm text-warning-600">{errors.customerAcquisitionCost.message}</p>
              ) : (
                <p className="mt-2 text-sm text-navy-500">Average cost to acquire one customer</p>
              )}
            </div>

            {/* Gross Margin */}
            <div>
              <label htmlFor="grossMargin" className="label-mercury">
                Gross Margin (%)
              </label>
              <Controller
                name="grossMargin"
                control={control}
                rules={{
                  validate: (value) => {
                    if (value && parseFloat(value) < 0) return 'Cannot be negative';
                    if (value && parseFloat(value) > 100) return 'Cannot exceed 100%';
                    return true;
                  },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    id="grossMargin"
                    placeholder="e.g., 40"
                    step="0.1"
                    min="0"
                    max="100"
                    {...field}
                    className={`input-mercury ${
                      errors.grossMargin ? 'ring-warning-300 border-warning-300' : ''
                    }`}
                  />
                )}
              />
              {errors.grossMargin ? (
                <p className="mt-2 text-sm text-warning-600">{errors.grossMargin.message}</p>
              ) : (
                <p className="mt-2 text-sm text-navy-500">Your profit margin on products</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full btn-mercury-primary text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Calculating...
            </>
          ) : (
            'Calculate my churn impact'
          )}
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;
