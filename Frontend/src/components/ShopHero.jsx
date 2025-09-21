// components/Shop/ShopHero.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ShopHero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-80 bg-cover bg-center flex items-center justify-center"
      style={{ 
        backgroundImage: "url('/images/shop.jpg')",
      }}
    >
      <div className="text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold mb-6 text-gray-800"
        >
          Shop
        </motion.h1>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center space-x-3 text-gray-600"
        >
          <span className="font-medium">Home</span>
          <span className="text-amber-600">›</span>
          <span className="font-medium text-amber-600">Shop</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShopHero;