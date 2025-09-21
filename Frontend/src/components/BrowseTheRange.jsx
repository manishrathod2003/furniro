// components/BrowseTheRange/BrowseTheRange.jsx
import React from "react";
import { motion } from "framer-motion";

const BrowseTheRange = () => {
  const categories = [
    {
      name: "Dining",
      image: "/images/dining.png",
      alt: "Dining"
    },
    {
      name: "Living",
      image: "/images/living.png",
      alt: "Living"
    },
    {
      name: "Bedroom",
      image: "/images/bedroom.png",
      alt: "Bedroom"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse The Range
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-80 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrowseTheRange;