// components/PageHeader/PageHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  breadcrumb = [], 
  backgroundImage,
  showLogo = true,
  logoSrc
}) => {
  const navigate = useNavigate();

  // Default images that will work in production
  const defaultBgImage = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const defaultLogo = 'https://via.placeholder.com/64x28/B88E2F/FFFFFF?text=FURNIRO';

  // Use provided images or fallback to defaults
  const bgImage = backgroundImage || defaultBgImage;
  const logo = logoSrc || defaultLogo;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-80 bg-cover bg-center flex items-center justify-center"
      style={{ 
        backgroundImage: `url('${bgImage}')`,
        backgroundColor: '#f5f5f5' // Fallback color
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-amber-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-300 rounded-full blur-xl"></div>
      </div>

      <div className="text-center relative z-20 px-4">
        {/* Logo Section */}
        {showLogo && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <motion.div className="w-16 h-7 flex items-center justify-center mx-auto">
              <img 
                src={logo} 
                alt="Furniro Logo"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // If logo fails to load, show text fallback
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `
                    <div class="text-orange-600 font-bold text-lg">FURNIRO</div>
                  `;
                }}
              />
            </motion.div>
          </motion.div>
        )}
        
        {/* Page Title */}
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-5xl font-bold mb-6 text-gray-800"
        >
          {title}
        </motion.h1>
        
        {/* Breadcrumb Navigation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center space-x-3 text-gray-600 flex-wrap"
        >
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index === breadcrumb.length - 1 ? (
                // Last item (current page) - not clickable
                <span className="font-medium text-orange-600">
                  {item.label}
                </span>
              ) : (
                // Clickable breadcrumb items
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => item.path && handleNavigation(item.path)}
                  className="font-medium hover:text-orange-600 transition-colors text-black"
                >
                  {item.label}
                </motion.button>
              )}
              
              {/* Separator */}
              {index < breadcrumb.length - 1 && (
                <span className="text-orange-600 mx-1">›</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PageHeader;