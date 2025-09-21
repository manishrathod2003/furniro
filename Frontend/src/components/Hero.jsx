// components/Hero/Hero.jsx
import React from "react";
import { motion } from "framer-motion";


const Hero = () => {
  return (
    <section className="relative bg-gray-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen"
      >
        {/* Full Width Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Modern chair with plant"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>

        {/* Content Box - Responsive positioning */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center md:justify-end">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg md:mr-0 lg:mr-8"
          >
            <div className="bg-yellow-50 p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg mx-auto backdrop-blur-sm bg-opacity-90">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-800 font-semibold text-sm sm:text-base tracking-wider mb-2"
              >
                New Arrival
              </motion.p>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-800 leading-tight mb-3 sm:mb-4"
              >
                Discover Our
                <br />
                New Collection
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                elit tellus, luctus nec ullamcorper mattis.
              </motion.p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-sm sm:text-base px-8 sm:px-12 py-3 sm:py-4 transition-colors rounded-md"
              >
                BUY NOW
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;