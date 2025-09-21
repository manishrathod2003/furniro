// components/Shop/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, RotateCcw, Heart, ShoppingCart, Check, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ 
  product, 
  index, 
  likedProducts, 
  setLikedProducts,
  addToCart, 
  compareProducts, 
  addToCompare, 
  removeFromCompare,
  toggleLike 
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [shareTooltip, setShareTooltip] = useState(false);
  const [likingProduct, setLikingProduct] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showLoginNotification, setShowLoginNotification] = useState(false);
  const [showCompareNotification, setShowCompareNotification] = useState(false);
  const [localCompareProducts, setLocalCompareProducts] = useState([]);
  
  // Generate consistent discount/new status based on product ID
  const productId = product._id || product.id;
  const hasDiscount = index % 3 === 0;
  const isNew = index % 5 === 0;
  const discountPercent = hasDiscount ? [20, 30, 50][index % 3] : 0;
  const originalPrice = hasDiscount ? Math.floor(product.price * 1.5) : product.price;
  
  // Load compare list from localStorage
  useEffect(() => {
    const loadCompareList = () => {
      try {
        const compareList = JSON.parse(localStorage.getItem("compareList") || "[]");
        setLocalCompareProducts(compareList);
      } catch (error) {
        console.error("Error loading compare list:", error);
        setLocalCompareProducts([]);
      }
    };

    loadCompareList();

    const handleCompareUpdate = () => {
      loadCompareList();
    };

    window.addEventListener("compareUpdated", handleCompareUpdate);
    return () => window.removeEventListener("compareUpdated", handleCompareUpdate);
  }, []);
  
  // Check if product is in compare list
  const isInCompare = localCompareProducts?.some(p => (p._id || p.id) === productId) || false;
  
  // Check if product is liked
  const isLiked = likedProducts?.has(productId) || false;

  const formatPrice = (price) => {
    return `Rp ${price?.toLocaleString('id-ID') || '0'}`;
  };

  // Show login notification
  const showLoginAlert = () => {
    setShowLoginNotification(true);
    setTimeout(() => {
      setShowLoginNotification(false);
    }, 4000);
  };

  // Show compare notification
  const showCompareAlert = (message, isSuccess = false) => {
    setShowCompareNotification({ message, isSuccess });
    setTimeout(() => {
      setShowCompareNotification(false);
    }, 3000);
  };

  // Handle product click to navigate to single product page
  const handleProductClick = () => {
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle action button clicks - prevent card click
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  // Enhanced Share Function
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name} - ${formatPrice(product.price)}`,
      url: `${window.location.origin}/product/${productId}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
      }
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    }
  };

  // Enhanced Compare Function with Notifications
  const handleCompare = () => {
    if (!isAuthenticated || !user) {
      showLoginAlert();
      return;
    }

    const existingCompareList = JSON.parse(localStorage.getItem("compareList") || "[]");
    
    // Check if product is already in compare list
    const isAlreadyComparing = existingCompareList.find((item) => (item._id || item.id) === productId);

    if (isAlreadyComparing) {
      // Remove from compare list
      const updatedCompareList = existingCompareList.filter(
        (item) => (item._id || item.id) !== productId
      );
      localStorage.setItem("compareList", JSON.stringify(updatedCompareList));
      setLocalCompareProducts(updatedCompareList);
      
      showCompareAlert(`${product.name} removed from compare list!`);
      
      // Update compare count
      window.dispatchEvent(new CustomEvent("compareUpdated", {
        detail: { count: updatedCompareList.length }
      }));
      
    } else {
      // Add to compare list
      if (existingCompareList.length >= 4) {
        showCompareAlert("You can compare maximum 4 products. Please remove some products first.", false);
        return;
      }

      const updatedCompareList = [...existingCompareList, product];
      localStorage.setItem("compareList", JSON.stringify(updatedCompareList));
      setLocalCompareProducts(updatedCompareList);
      
      showCompareAlert(`${product.name} added to compare list!`, true);
      
      // Update compare count
      window.dispatchEvent(new CustomEvent("compareUpdated", {
        detail: { count: updatedCompareList.length }
      }));

      // Auto-navigate option after a delay
      setTimeout(() => {
        if (updatedCompareList.length >= 2) {
          const goToCompare = window.confirm(
            "Would you like to view the comparison page now?"
          );
          if (goToCompare) {
            navigate("/compare");
            window.scrollTo(0, 0);
          }
        }
      }, 1000);
    }
  };

  // Enhanced Like Function with Backend Integration
  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      showLoginAlert();
      return;
    }

    setLikingProduct(true);
    try {
      await toggleLike(productId);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setLikingProduct(false);
    }
  };

  // Enhanced Add to Cart with Backend Integration
  const handleAddToCart = async () => {
    if (!isAuthenticated || !user) {
      showLoginAlert();
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Notifications */}
      {showLoginNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-orange-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3"
          >
            <ShoppingCart className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">
              Please login to add items to cart
            </span>
            <button
              onClick={() => setShowLoginNotification(false)}
              className="text-white hover:text-gray-200 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}

      {showCompareNotification && (
        <div className="fixed top-16 right-4 z-50 max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              showCompareNotification.isSuccess ? 'bg-green-500' : 'bg-blue-500'
            } text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}
          >
            <RotateCcw className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium flex-1">
              {showCompareNotification.message}
            </span>
            {showCompareNotification.isSuccess && localCompareProducts.length > 0 && (
              <button
                onClick={() => {
                  navigate("/compare");
                  setShowCompareNotification(false);
                }}
                className="bg-white text-green-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
              >
                <Eye size={14} className="inline mr-1" />
                View
              </button>
            )}
            <button
              onClick={() => setShowCompareNotification(false)}
              className="text-white hover:text-gray-200 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image || "/src/images/cafe_chair1.png"}
          alt={product.name}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/src/images/cafe_chair1.png";
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2 z-10">
          {hasDiscount && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {isNew && !hasDiscount && (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              New
            </span>
          
          
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleActionClick(e, handleAddToCart)}
              disabled={addingToCart}
              className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-amber-50 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              <span>{addingToCart ? 'Adding...' : 'Add to cart'}</span>
              {addingToCart && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
              )}
            </motion.button>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-6">
              {/* Share Button with Tooltip */}
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.1, y: -2 }}
                  onClick={(e) => handleActionClick(e, handleShare)}
                  className="flex items-center space-x-1 text-white hover:text-amber-300 transition-colors group/btn"
                >
                  {shareTooltip ? (
                    <Check size={16} className="text-green-300" />
                  ) : (
                    <Share2 size={16} className="group-hover/btn:animate-pulse" />
                  )}
                  <span className="text-sm font-medium">
                    {shareTooltip ? 'Copied!' : 'Share'}
                  </span>
                </motion.button>
              </div>
              
              {/* Compare Button */}
              <motion.button 
                whileHover={{ scale: 1.1, y: -2 }}
                onClick={(e) => handleActionClick(e, handleCompare)}
                className={`flex items-center space-x-1 transition-colors group/btn ${
                  isInCompare 
                    ? 'text-blue-300' 
                    : 'text-white hover:text-amber-300'
                }`}
              >
                <RotateCcw 
                  size={16} 
                  className={isInCompare ? 'animate-spin' : 'group-hover/btn:animate-spin'} 
                />
                <span className="text-sm font-medium">
                  {isInCompare ? 'Remove' : 'Compare'}
                </span>
              </motion.button>
              
              {/* Like Button with Backend Integration */}
              <motion.button 
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleActionClick(e, handleLike)}
                disabled={likingProduct}
                className={`flex items-center space-x-1 transition-colors group/btn disabled:opacity-50 ${
                  isLiked 
                    ? 'text-red-400' 
                    : 'text-white hover:text-red-300'
                }`}
              >
                {likingProduct ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <Heart 
                    size={16} 
                    fill={isLiked ? 'currentColor' : 'none'}
                    className={isLiked ? 'animate-pulse' : 'group-hover/btn:animate-pulse'}
                  />
                )}
                <span className="text-sm font-medium">
                  {likingProduct ? 'Loading...' : isLiked ? 'Liked' : 'Like'}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.shortDescription || product.description || `${product.brand} - ${product.category}`}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isLiked && (
              <div className="text-red-500">
                <Heart size={16} fill="currentColor" />
              </div>
            )}
            {isInCompare && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/compare');
                }}
                className="text-blue-500 hover:text-blue-600 transition-colors"
                title="Go to Compare"
              >
                <RotateCcw size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Compare Button (if products in compare) */}
      {localCompareProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/compare')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 font-medium"
          >
            <RotateCcw size={20} />
            <span>Compare ({localCompareProducts.length})</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductCard;