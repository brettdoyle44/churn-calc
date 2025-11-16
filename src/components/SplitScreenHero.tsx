import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

interface SplitScreenHeroProps {
  onGetStartedClick: () => void;
}

export default function SplitScreenHero({ onGetStartedClick }: SplitScreenHeroProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-voyage-navy via-voyage-ocean to-voyage-navy relative overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-voyage-seafoam rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-voyage-coral rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Bold statement */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust badge */}
            <motion.span
              className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 text-white border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🚀 Trusted by 500+ Shopify stores
            </motion.span>

            {/* Main headline */}
            <h1 className="text-6xl lg:text-7xl font-black mb-6 text-white leading-tight">
              Stop the{' '}
              <span className="relative">
                <span className="relative z-10 text-voyage-seafoam">
                  revenue leak
                </span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-4 bg-voyage-coral/30"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Discover exactly how much you're losing to churn—and what to do about it.
              Get AI-powered insights in 60 seconds.
            </p>

            {/* CTA Button */}
            <motion.button
              onClick={onGetStartedClick}
              className="px-8 py-4 bg-gradient-to-r from-voyage-coral to-voyage-sunset text-white rounded-full font-bold text-lg shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Calculate My Loss →
            </motion.button>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-8 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="text-voyage-seafoam text-lg">✓</span>
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-voyage-seafoam text-lg">✓</span>
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-voyage-seafoam text-lg">✓</span>
                <span>Instant results</span>
              </div>
            </div>
          </motion.div>

          {/* Right side: Animated stats preview */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Stats cards */}
            <div className="space-y-6">
              {/* Main stat card */}
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-white/70 text-sm font-medium mb-2">
                  Average annual loss
                </p>
                <div className="text-6xl font-black text-white mb-2">
                  {inView && (
                    <>
                      $<CountUp end={247000} duration={2.5} separator="," />
                    </>
                  )}
                </div>
                <p className="text-voyage-coral text-sm font-semibold">
                  Don't let this be you →
                </p>
              </motion.div>

              {/* Secondary stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-white/70 text-xs font-medium mb-2">
                    Avg Churn Rate
                  </p>
                  <div className="text-3xl font-black text-voyage-coral">
                    {inView && <CountUp end={75} duration={2} />}%
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-white/70 text-xs font-medium mb-2">
                    Stores Analyzed
                  </p>
                  <div className="text-3xl font-black text-voyage-seafoam">
                    {inView && <CountUp end={2847} duration={2} separator="," />}
                  </div>
                </motion.div>
              </div>

              {/* Insight card */}
              <motion.div
                className="bg-gradient-to-r from-voyage-seafoam/20 to-voyage-ocean/20 backdrop-blur-xl rounded-xl p-6 border border-voyage-seafoam/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-white font-semibold mb-1">
                      Did you know?
                    </p>
                    <p className="text-white/80 text-sm">
                      Most merchants don't realize 60-80% of their customers never make a second purchase.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-white/50 text-xs font-medium">
          <span>Scroll to explore</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

