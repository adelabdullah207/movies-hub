import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle } from 'lucide-react';

const FloatingButtons: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openWhatsApp = () => {
    const phoneNumber = '+971581195494';
    const message = 'Hello! I found your MoviesHub website and would like to get in touch.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openWhatsApp}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-2xl transition-colors duration-300"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-14 h-14 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300"
            title="Scroll to top"
          >
            <ArrowUp className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingButtons;