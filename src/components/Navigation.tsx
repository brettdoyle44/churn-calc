import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  onCalculateClick?: () => void;
}

export default function Navigation({ onCalculateClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCalculator = () => {
    if (onCalculateClick) {
      onCalculateClick();
    } else {
      const calculatorSection = document.getElementById('calculator');
      if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="font-display font-black text-2xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={isScrolled ? 'text-voyage-navy' : 'text-white'}>
              voyage
            </span>
            <span className="text-voyage-seafoam">_</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-voyage-ocean'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              How it works
            </a>
            <a
              href="#why-voyage"
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-voyage-ocean'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Why Voyage
            </a>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={scrollToCalculator}
            className="px-6 py-3 bg-gradient-to-r from-voyage-seafoam to-voyage-ocean text-white rounded-full font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Calculate Your Loss
          </motion.button>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}

