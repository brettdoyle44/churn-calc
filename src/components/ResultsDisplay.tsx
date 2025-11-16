import { useEffect, useState, useRef, useMemo } from 'react';
import {
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  UsersIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { CalculatorInputs, CalculatorResults, UserInfo } from '../types';

interface ResultsDisplayProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  userInfo: UserInfo;
}

/**
 * Format number as currency
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with commas
 */
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(num);
};

/**
 * Hook for animated count-up effect
 */
const useCountUp = (end: number, shouldStart: boolean, duration: number = 2000): number => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (shouldStart && !hasStarted) {
      setHasStarted(true);
    }
  }, [shouldStart, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return hasStarted ? count : 0;
};

/**
 * Hook for Intersection Observer to trigger animations
 */
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isIntersecting };
};

/**
 * Hero Result Section Component
 */
const HeroResultSection = ({ 
  storeName, 
  annualLoss, 
  monthlyLoss 
}: { 
  storeName: string; 
  annualLoss: number; 
  monthlyLoss: number;
}) => {
  const { ref, isIntersecting } = useIntersectionObserver();
  const animatedValue = useCountUp(annualLoss, isIntersecting, 2500);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden bg-warning-50 border border-warning-100 rounded-mercury-lg p-8 md:p-12 mb-12 transition-all duration-1000 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold text-navy-950 mb-6 leading-tight">
          <span className="text-navy-900">{storeName}</span>, you're losing{' '}
          <span className="text-warning-600">
            {isIntersecting ? formatCurrency(animatedValue) : '$0'}
          </span>{' '}
          per year to customer churn
        </h1>
        <p className="text-xl md:text-2xl text-navy-700">
          That's <span className="font-semibold text-warning-600">{formatCurrency(monthlyLoss)}</span>{' '}
          every month walking out the door
        </p>
      </div>
    </section>
  );
};

/**
 * Metric Card Component
 */
const MetricCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  delay = 0,
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  delay?: number;
}) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`card-mercury hover:shadow-mercury-md transition-all duration-500 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="bg-warning-50 rounded-mercury p-3 mb-4">
          <Icon className="w-8 h-8 text-warning-600" />
        </div>
        <h3 className="text-sm font-medium text-navy-600 mb-2">{title}</h3>
        <p className="text-3xl md:text-4xl font-semibold text-navy-950 mb-2">{value}</p>
        <p className="text-sm text-navy-500">{subtitle}</p>
      </div>
    </div>
  );
};

/**
 * Key Metrics Grid Component
 */
const KeyMetricsGrid = ({ results }: { results: CalculatorResults }) => {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={ArrowTrendingDownIcon}
          title="Annual Revenue Lost"
          value={formatCurrency(results.annualRevenueLost)}
          subtitle="Lost to churn each year"
          delay={0}
        />
        <MetricCard
          icon={CalendarDaysIcon}
          title="3-Year Impact"
          value={formatCurrency(results.threeYearImpact)}
          subtitle="Projected loss over 3 years"
          delay={100}
        />
        <MetricCard
          icon={UsersIcon}
          title="Customers Lost"
          value={formatNumber(results.customersLostPerMonth)}
          subtitle="Customers churning monthly"
          delay={200}
        />
      </div>
    </section>
  );
};

/**
 * Visualization Section Component
 */
const VisualizationSection = ({ results }: { results: CalculatorResults }) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const chartData = useMemo(() => [
    { year: '1 Year', loss: results.annualRevenueLost },
    { year: '3 Years', loss: results.threeYearImpact },
    { year: '5 Years', loss: results.fiveYearImpact },
  ], [results]);

  return (
    <section
      ref={ref}
      className={`card-mercury mb-12 transition-all duration-1000 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-navy-950 mb-2 text-center">
        Your churn impact over time
      </h2>
      <p className="text-navy-600 text-center mb-8">
        See how churn compounds and erodes your revenue
      </p>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              stroke="#2c3749"
              style={{ fontSize: '14px', fontWeight: 500 }}
            />
            <YAxis
              stroke="#2c3749"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              style={{ fontSize: '14px' }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #d2dae5',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(27, 35, 50, 0.1)',
              }}
            />
            <Bar
              dataKey="loss"
              fill="url(#colorLoss)"
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={isIntersecting ? 0 : 10000}
            />
            <defs>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={1} />
                <stop offset="100%" stopColor="#f87171" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

/**
 * Scenario Card Component
 */
const ScenarioCard = ({
  title,
  reductionPercentage,
  newChurnRate,
  annualSavings,
  threeYearSavings,
  accentColor,
  isRecommended = false,
  delay = 0,
}: {
  title: string;
  reductionPercentage: number;
  newChurnRate: number;
  annualSavings: number;
  threeYearSavings: number;
  accentColor: string;
  isRecommended?: boolean;
  delay?: number;
}) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`relative bg-white rounded-mercury-lg shadow-mercury hover:shadow-mercury-md transition-all duration-500 p-6 border-2 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        borderColor: accentColor,
        transitionDelay: `${delay}ms`,
      }}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            RECOMMENDED
          </span>
        </div>
      )}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-navy-950 mb-2">{title}</h3>
        <p className="text-sm text-navy-600 mb-4">
          Reduce to <span className="font-semibold">{newChurnRate.toFixed(1)}%</span> churn
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-navy-500">Annual Savings</p>
            <p className="text-2xl font-semibold" style={{ color: accentColor }}>
              {formatCurrency(annualSavings)}
            </p>
          </div>
          <div>
            <p className="text-sm text-navy-500">3-Year Savings</p>
            <p className="text-xl font-medium" style={{ color: accentColor }}>
              {formatCurrency(threeYearSavings)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Scenarios Section Component
 */
const ScenariosSection = ({ results }: { results: CalculatorResults }) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const scenarios = results.churnReductionScenarios;

  const getAccentColor = (index: number): string => {
    const colors = ['#22c55e', '#16a34a', '#15803d'];
    return colors[index] || colors[0];
  };

  return (
    <section
      ref={ref}
      className={`mb-12 transition-all duration-1000 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-navy-950 mb-2">
          What if you could reduce churn?
        </h2>
        <p className="text-navy-600">
          See how much you could save with different churn reduction levels
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => (
          <ScenarioCard
            key={scenario.reductionPercentage}
            title={`${scenario.reductionPercentage}% Reduction`}
            reductionPercentage={scenario.reductionPercentage}
            newChurnRate={scenario.newChurnRate}
            annualSavings={scenario.annualSavings}
            threeYearSavings={scenario.threeYearSavings}
            accentColor={getAccentColor(index)}
            isRecommended={scenario.reductionPercentage === 25}
            delay={index * 100}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Comparison Section Component
 */
const ComparisonSection = ({ inputs, results }: { inputs: CalculatorInputs; results: CalculatorResults }) => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const comparisons = useMemo(() => {
    const items = [];

    // Calculate total revenue
    const totalRevenue = inputs.averageOrderValue * inputs.numberOfCustomers * inputs.purchaseFrequency;
    const percentOfRevenue = (results.annualRevenueLost / totalRevenue) * 100;

    items.push({
      text: `Your annual churn loss is equivalent to ${percentOfRevenue.toFixed(1)}% of your total revenue`,
      highlight: `${percentOfRevenue.toFixed(1)}%`,
    });

    // CAC comparison
    if (inputs.customerAcquisitionCost && inputs.customerAcquisitionCost > 0) {
      const newCustomersCouldFund = Math.floor(results.annualRevenueLost / inputs.customerAcquisitionCost);
      items.push({
        text: `Your annual churn loss could fund ${formatNumber(newCustomersCouldFund)} new customer acquisitions`,
        highlight: formatNumber(newCustomersCouldFund),
      });
    }

    // Weekly customer loss
    const customersPerWeek = results.customersLostPerMonth / 4.33;
    items.push({
      text: `You're losing ${formatNumber(customersPerWeek)} customers per week - that's a full-time job just acquiring replacements`,
      highlight: `${formatNumber(customersPerWeek)} customers per week`,
    });

    return items;
  }, [inputs, results]);

  return (
    <section
      ref={ref}
      className={`bg-mercury-50 border border-mercury-100 rounded-mercury-lg p-6 md:p-8 mb-12 transition-all duration-1000 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-navy-950 mb-6 text-center">
        Put your churn loss in perspective
      </h2>
      <div className="space-y-4">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className="bg-white rounded-mercury p-4 shadow-mercury-sm flex items-start space-x-3"
          >
            <CheckCircleIcon className="w-6 h-6 text-accent-600 flex-shrink-0 mt-0.5" />
            <p className="text-navy-700 text-lg">{comparison.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * CTA Section Component
 */
const CTASection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className={`bg-navy-900 rounded-mercury-lg p-8 md:p-12 text-center shadow-mercury-lg transition-all duration-1000 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
        Ready to stop the bleeding?
      </h2>
      <p className="text-xl text-mercury-200 mb-8">
        Let's work together to reduce your churn and protect your revenue
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <button className="w-full md:w-auto bg-white text-navy-900 font-medium px-8 py-3 rounded-mercury shadow-mercury hover:shadow-mercury-md transition-all">
          Book a Free Churn Reduction Strategy Call
        </button>
        <button className="w-full md:w-auto bg-transparent text-white font-medium px-8 py-3 rounded-mercury border-2 border-white hover:bg-white hover:text-navy-900 transition-all">
          Get Early Access to ChurnGuard (20% Off)
        </button>
      </div>
    </section>
  );
};

/**
 * Main Results Display Component
 */
export default function ResultsDisplay({ inputs, results, userInfo }: ResultsDisplayProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 print:p-0">
      {/* Hero Result Section */}
      <HeroResultSection
        storeName={userInfo.storeName}
        annualLoss={results.annualRevenueLost}
        monthlyLoss={results.monthlyRevenueLost}
      />

      {/* Key Metrics Grid */}
      <KeyMetricsGrid results={results} />

      {/* Visualization Section */}
      <VisualizationSection results={results} />

      {/* Scenarios Section */}
      <ScenariosSection results={results} />

      {/* Comparison Section */}
      <ComparisonSection inputs={inputs} results={results} />

      {/* CTA Section */}
      <CTASection />

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .shadow-mercury,
          .shadow-mercury-sm,
          .shadow-mercury-md,
          .shadow-mercury-lg,
          .shadow-mercury-xl {
            box-shadow: none !important;
            border: 1px solid #d2dae5;
          }
        }
      `}</style>
    </div>
  );
}
