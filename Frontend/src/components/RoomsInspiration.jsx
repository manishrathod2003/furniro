// components/RoomsInspiration/RoomsInspiration.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const RoomsInspiration = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      category: "Bed Room",
      title: "Inner Peace",
      image: "/images/bedroom.png"
    },
    {
      id: 2,
      category: "Living Room", 
      title: "Modern Comfort",
      image: "/images/living.png"
    },
    {
      id: 3,
      category: "Dining Room",
      title: "Family Gathering", 
      image: "/images/dining.png"
    },
    {
      id: 4,
      category: "Cafe Space",
      title: "Cozy Corner", 
      image: "/images/cafe_chair1.png"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-16 md:py-20 bg-amber-50">{/* Background color restored to warm tone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              50+ Beautiful rooms inspiration
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Our designer already made a lot of beautiful prototype of rooms that inspire you
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-8 py-3 transition-colors duration-300"
            >
              Explore More
            </motion.button>
          </motion.div>

          {/* Right Content - Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="flex space-x-4 overflow-hidden">
              {/* Main Large Image */}
              <div className="relative flex-1 max-w-md h-96 md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-gray-500 text-sm font-medium mb-1">
                          {slides[currentSlide].id.toString().padStart(2, '0')} —— {slides[currentSlide].category}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {slides[currentSlide].title}
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#D97706' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextSlide}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded transition-all duration-200 shadow-lg ml-4"
                      >
                        <ChevronRight size={20} strokeWidth={2} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Images Stack */}
              <div className="hidden lg:flex flex-col space-y-4 w-48">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="h-60 rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    src="/images/sofa.png"
                    alt="Sofa collection"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="h-48 rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    src="/images/cafe_chair2.png"
                    alt="Cafe chair design"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Navigation Arrow - Right */}
              <div className="hidden md:flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                  className="bg-white hover:bg-gray-50 text-yellow-600 p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-200"
                >
                  <ChevronRight size={24} strokeWidth={2} />
                </motion.button>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-3 mt-8">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? "bg-yellow-600 ring-2 ring-yellow-300" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoomsInspiration;