import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function VoyageDifference() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const traditionalItems = [
    'Generic reports with no context',
    'Hours of manual analysis',
    'Spreadsheets and guesswork',
    'No actionable insights',
  ];

  const voyageItems = [
    'AI-powered personalized insights',
    'Results in 60 seconds',
    'Clear, visual dashboards',
    'Actionable strategies you can implement today',
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-24 bg-gradient-to-br from-voyage-navy via-voyage-navy to-voyage-ocean"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            The Voyage Difference
          </h2>
          <p className="text-xl text-white/70">
            Why settle for guesswork when you can have intelligence?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full">
              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-6">
                <span className="text-red-300 text-xs font-bold uppercase tracking-wide">
                  Old Way
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white/50 mb-6 line-through">
                Traditional Analytics
              </h3>

              <ul className="space-y-4">
                {traditionalItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 text-white/60"
                  >
                    <span className="text-red-400 text-xl flex-shrink-0">✗</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Voyage Intelligence */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-voyage-seafoam to-voyage-ocean opacity-20 blur-xl rounded-2xl" />

            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-voyage-seafoam/30 h-full shadow-2xl">
              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-voyage-seafoam/20 border border-voyage-seafoam/30 rounded-full mb-6">
                <span className="text-voyage-seafoam text-xs font-bold uppercase tracking-wide">
                  ✨ New Way
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-6">
                Voyage Intelligence
              </h3>

              <ul className="space-y-4">
                {voyageItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 text-white"
                  >
                    <span className="text-voyage-seafoam text-xl flex-shrink-0">✓</span>
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Call to action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <p className="text-voyage-seafoam font-semibold text-lg">
                  → Try it now, free forever
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

