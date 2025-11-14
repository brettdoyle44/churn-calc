import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { EmailFormData } from '../types';
import { submitToHubSpot } from '../utils/hubspot';

interface EmailCaptureFormProps {
  onSuccess: () => void;
}

export default function EmailCaptureForm({ onSuccess }: EmailCaptureFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>();

  const onSubmit = async (data: EmailFormData) => {
    setSubmitting(true);
    try {
      await submitToHubSpot(data);
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Still call onSuccess to not block the user
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-primary-200 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Get Your Detailed Report
      </h3>
      <p className="text-gray-600 mb-4">
        Enter your email to receive a comprehensive churn analysis report and
        personalized recommendations.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name (Optional)
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name (Optional)
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-warning-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name (Optional)
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Acme Inc."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Get Full Report'}
        </button>
      </form>
    </div>
  );
}

