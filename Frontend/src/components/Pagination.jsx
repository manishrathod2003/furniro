// components/Shop/Pagination.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ products, currentPage, totalPages, handlePageChange, showCount }) => {
  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center mt-16 pb-12"
      >
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          {currentPage > 1 && (
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-amber-100 text-amber-600 rounded hover:bg-amber-200 transition-colors font-medium"
            >
              Previous
            </button>
          )}
          
          {/* Page Numbers - Show at least current page */}
          {totalPages > 1 ? (
            generatePaginationNumbers().map((page) => (
              <button 
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                }`}
              >
                {page}
              </button>
            ))
          ) : (
            // Show current page even if totalPages is 1 or unknown
            <button className="px-4 py-2 bg-amber-600 text-white rounded font-medium">
              1
            </button>
          )}
          
          {/* Next Button - Show if we have potential more pages */}
          {(currentPage < totalPages || products.length === showCount) && (
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-amber-100 text-amber-600 rounded hover:bg-amber-200 transition-colors font-medium"
            >
              Next
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Pagination;