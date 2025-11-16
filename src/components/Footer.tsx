import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-voyage-navy text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-end mb-16">
          {/* Left side */}
          <div>
            <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Ready to stop
              <br />
              <span className="text-voyage-seafoam">the leak?</span>
            </h3>
            <p className="text-xl text-white/60">
              Join hundreds of stores saving millions in lost revenue.
            </p>
          </div>

          {/* Right side - CTA */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <motion.button
              onClick={scrollToCalculator}
              className="px-8 py-4 bg-gradient-to-r from-voyage-coral to-voyage-sunset text-white rounded-full font-bold text-lg shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Your Free Analysis →
            </motion.button>
            <p className="text-sm text-white/50">
              No credit card required • Results in 60 seconds
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-6">
              <div className="font-display font-black text-2xl">
                voyage<span className="text-voyage-seafoam">_</span>
              </div>
              <p className="text-sm text-white/40">
                © {currentYear} Voyage. Built for growth.
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#privacy"
                className="text-white/60 hover:text-voyage-seafoam transition-colors"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="text-white/60 hover:text-voyage-seafoam transition-colors"
              >
                Terms
              </a>
              <a
                href="mailto:hello@voyage.com"
                className="text-white/60 hover:text-voyage-seafoam transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              <motion.a
                href="#twitter"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                𝕏
              </motion.a>
              <motion.a
                href="#linkedin"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                in
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/30 italic">
            Helping Shopify merchants turn churn into revenue, one insight at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}

