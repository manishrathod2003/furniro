// components/Shop/FeaturesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Truck, Headphones } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    { 
      icon: Trophy, 
      title: "High Quality", 
      desc: "crafted from top materials"
    },
    { 
      icon: Shield, 
      title: "Warranty Protection", 
      desc: "Over 2 years"
    },
    { 
      icon: Truck, 
      title: "Free Shipping", 
      desc: "Order over 150 $"
    },
    { 
      icon: Headphones, 
      title: "24 / 7 Support", 
      desc: "Dedicated support"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-orange-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <IconComponent size={32} className="text-gray-700" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturesSection;