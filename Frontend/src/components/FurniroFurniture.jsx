// components/FuniroFurniture/FuniroFurniture.jsx
import React from "react";
import { motion } from "framer-motion";

const FurniroFurniture = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gray-600 text-lg mb-2">Share your setup with</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            #FurniroFurniture
          </h2>
        </motion.div>

        {/* Natural Masonry Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-4 overflow-hidden"
        >
          {/* First Column - Left */}
          <div className="flex flex-col gap-4 w-48 flex-shrink-0">
            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/src/images/gallery-workspace-left.jpg"
                alt="Modern workspace with laptop"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/living.png";
                }}
              />
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/src/images/gallery-chair-setup.jpg"
                alt="Cozy chair corner"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/bedroom.png";
                }}
              />
            </motion.div>
          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-4 w-56 flex-shrink-0">
            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/src/images/gallery-workspace.jpg"
                alt="Clean workspace setup"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/dining.png";
                }}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/src/images/gallery-minimalist.jpg"
                alt="Minimalist decor"
                className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/living.png";
                }}
              />
            </motion.div>
          </div>

          {/* Third Column - Center Large */}
          <div className="flex flex-col gap-4 w-80 flex-shrink-0">
            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg relative"
            >
              <img
                src="/src/images/gallery-featured-dining.jpg"
                alt="Featured dining setup"
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/dining.png";
                }}
              />
              {/* Yellow Border Overlay */}
              <div className="absolute inset-0 border-4 border-yellow-500 rounded-lg pointer-events-none"></div>
            </motion.div>
          </div>

          {/* Fourth Column */}
          <div className="flex flex-col gap-4 w-52 flex-shrink-0">
            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/src/images/gallery-bedroom.jpg"
                alt="Modern bedroom"
                className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/bedroom.png";
                }}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/src/images/gallery-decor.jpg"
                alt="Home decoration"
                className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/living.png";
                }}
              />
            </motion.div>
          </div>

          {/* Fifth Column - Right */}
          <div className="flex flex-col gap-4 w-64 flex-shrink-0">
            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/src/images/gallery-kitchen.jpg"
                alt="Kitchen interior"
                className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/dining.png";
                }}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-lg overflow-hidden shadow-lg relative"
            >
              <img
                src="/src/images/gallery-kitchen-tools.jpg"
                alt="Kitchen setup"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/src/images/bedroom.png";
                }}
              />
              {/* Name Tag */}
              <div className="absolute bottom-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium">
            
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Gallery - Grid for smaller screens */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:hidden grid grid-cols-2 gap-4 mt-8"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`rounded-lg overflow-hidden shadow-lg ${
                index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[5/4]'
              }`}
            >
              <img
                src={`/src/images/gallery-mobile-${index + 1}.jpg`}
                alt={`Funiro furniture setup ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = index % 2 === 0 ? "/src/images/living.png" : "/src/images/bedroom.png";
                }}
              />
              {index === 5 && (
                <div className="absolute bottom-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                  
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FurniroFurniture;