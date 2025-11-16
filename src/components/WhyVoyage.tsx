import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function WhyVoyage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Intelligence',
      description: 'Claude AI analyzes your data and provides personalized recommendations based on your specific business model.',
      color: 'voyage-seafoam',
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Get comprehensive analysis in 60 seconds. No waiting, no complex setup, no learning curve.',
      color: 'voyage-sunset',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy First',
      description: 'Your data is processed securely and never shared. We respect your business confidentiality.',
      color: 'voyage-coral',
    },
    {
      icon: ChartBarIcon,
      title: 'Visual Insights',
      description: 'Beautiful charts and dashboards that make complex metrics easy to understand and act on.',
      color: 'voyage-ocean',
    },
    {
      icon: LightBulbIcon,
      title: 'Actionable Strategies',
      description: 'Not just data—get specific, implementable tactics to reduce churn and boost retention.',
      color: 'voyage-seafoam',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Growth Focused',
      description: 'Built by e-commerce operators who understand the real challenges of scaling a Shopify store.',
      color: 'voyage-sunset',
    },
  ];

  return (
    <section id="why-voyage" ref={ref} className="py-32 bg-voyage-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black text-voyage-navy mb-8 leading-tight">
            We're not just a calculator.
            <br />
            We're your{' '}
            <span className="relative">
              <span className="gradient-text">growth partner</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M2 10C100 2 200 2 298 10"
                  stroke="#57C5B6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
            </span>
            .
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Voyage was born from a simple truth: most Shopify stores are bleeding revenue
            and don't even know it. We built intelligent tools that don't just show you
            the problem—we help you fix it.
          </p>
        </motion.div>

        {/* Value props grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-${value.color}/10 mb-6`}>
                  <Icon className={`w-7 h-7 text-${value.color}`} style={{ color: getColorValue(value.color) }} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-voyage-navy mb-3">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-voyage-ocean to-voyage-seafoam p-1 rounded-2xl">
            <div className="bg-white px-8 py-6 rounded-xl">
              <p className="text-2xl font-bold text-voyage-navy mb-2">
                Join 500+ stores already optimizing retention
              </p>
              <p className="text-gray-600">
                Calculate your churn cost and get your personalized strategy—free, forever.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Helper function to get actual color values
function getColorValue(colorName: string): string {
  const colors: Record<string, string> = {
    'voyage-navy': '#0A2540',
    'voyage-ocean': '#1A5F7A',
    'voyage-seafoam': '#57C5B6',
    'voyage-coral': '#FF6B6B',
    'voyage-sunset': '#FFB347',
  };
  return colors[colorName] || '#1A5F7A';
}

