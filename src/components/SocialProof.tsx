import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

export default function SocialProof() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    {
      value: 12000000,
      prefix: '$',
      suffix: 'M',
      label: 'Revenue Analyzed',
      description: 'Across thousands of stores',
    },
    {
      value: 4200000,
      prefix: '$',
      suffix: 'M',
      label: 'Potential Savings Identified',
      description: 'In recoverable revenue',
    },
    {
      value: 2847,
      prefix: '',
      suffix: '+',
      label: 'Stores Helped',
      description: 'This month alone',
    },
    {
      value: 60,
      prefix: '',
      suffix: 's',
      label: 'Average Time',
      description: 'To get full analysis',
    },
  ];

  const integrations = [
    { name: 'Shopify', logo: '🛍️' },
    { name: 'Claude AI', logo: '🤖' },
    { name: 'Stripe', logo: '💳' },
    { name: 'HubSpot', logo: '📊' },
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-black text-voyage-navy mb-2">
                {inView && (
                  <>
                    {stat.prefix}
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=","
                    />
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="text-sm font-bold text-voyage-ocean mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-200 pt-12"
        >
          <p className="text-center text-sm uppercase tracking-wide mb-8 text-gray-500 font-semibold">
            Powered by best-in-class tools
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 text-gray-400 hover:text-voyage-ocean transition-colors"
              >
                <span className="text-3xl">{integration.logo}</span>
                <span className="font-semibold text-lg">{integration.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial-style trust message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-voyage-cream to-white rounded-2xl p-12 shadow-xl border border-gray-100">
            <div className="text-4xl mb-6">💬</div>
            <blockquote className="text-xl text-gray-700 italic mb-6 leading-relaxed">
              "I had no idea we were losing $180K annually to churn. Voyage showed me exactly
              where the leak was and gave me a clear action plan. Within 3 months, we cut
              churn by 23%."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-voyage-ocean to-voyage-seafoam flex items-center justify-center text-white font-bold text-lg">
                SK
              </div>
              <div className="text-left">
                <div className="font-bold text-voyage-navy">Sarah Kim</div>
                <div className="text-sm text-gray-600">Founder, Beauty Supply Co.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

