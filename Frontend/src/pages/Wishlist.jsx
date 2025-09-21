// pages/Wishlist.jsx - Updated with backend integration
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch wishlist items from backend
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlistItems();
    }
  }, [isAuthenticated, user]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await api.getUserWishlist(user._id);
      
      // Transform the response to match component structure
      const transformedItems = response.data.map(wishlistItem => ({
        id: wishlistItem.productId._id,
        name: wishlistItem.productId.name,
        price: wishlistItem.productId.price,
        image: wishlistItem.productId.image || '/src/images/cafe_chair1.png',
        category: wishlistItem.productId.category,
        brand: wishlistItem.productId.brand,
        description: wishlistItem.productId.shortDescription || wishlistItem.productId.description,
        inStock: wishlistItem.productId.status === 'active' && wishlistItem.productId.stock > 0,
        addedAt: wishlistItem.addedAt
      }));
      
      setWishlistItems(transformedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showNotification('Failed to load wishlist items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `Rp ${price?.toLocaleString('id-ID') || '0'}`;
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated || !user) {
      showNotification('Please login to manage wishlist', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      await api.removeFromWishlist(user._id, productId);
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      showNotification('Item removed from wishlist', 'success');
      
      // Update wishlist count in navbar
      updateWishlistCount();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showNotification('Failed to remove item from wishlist', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const addToCart = async (item) => {
    if (!isAuthenticated || !user) {
      showNotification('Please login to add items to cart', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      
      const cartData = {
        userId: user._id,
        productId: item.id,
        quantity: 1,
        price: item.price,
        name: item.name,
        image: item.image
      };

      await api.addToCart(cartData);
      showNotification('Item added to cart successfully!', 'success');
      
      // Update cart count in navbar
      updateCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message.includes('already in cart')) {
        showNotification('Item is already in your cart', 'info');
      } else {
        showNotification('Failed to add item to cart', 'error');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const clearAllWishlist = async () => {
    if (!isAuthenticated || !user) return;

    const confirmClear = window.confirm('Are you sure you want to clear your entire wishlist?');
    if (!confirmClear) return;

    try {
      setActionLoading(true);
      await api.clearWishlist(user._id);
      
      setWishlistItems([]);
      showNotification('Wishlist cleared successfully', 'success');
      updateWishlistCount();
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      showNotification('Failed to clear wishlist', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const addAllToCart = async () => {
    if (!isAuthenticated || !user) return;
    
    const inStockItems = wishlistItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      showNotification('No items available to add to cart', 'info');
      return;
    }

    try {
      setActionLoading(true);
      let successCount = 0;
      
      for (const item of inStockItems) {
        try {
          const cartData = {
            userId: user._id,
            productId: item.id,
            quantity: 1,
            price: item.price,
            name: item.name,
            image: item.image
          };
          
          await api.addToCart(cartData);
          successCount++;
        } catch (error) {
          console.error(`Error adding ${item.name} to cart:`, error);
        }
      }
      
      if (successCount > 0) {
        showNotification(`${successCount} items added to cart successfully!`, 'success');
        updateCartCount();
      } else {
        showNotification('Failed to add items to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding all to cart:', error);
      showNotification('Failed to add items to cart', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const navigateToProduct = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  // Update wishlist count in navbar
  const updateWishlistCount = async () => {
    try {
      const response = await api.getWishlistCount(user._id);
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { count: response.count } 
      }));
    } catch (error) {
      console.error('Error updating wishlist count:', error);
    }
  };

  // Update cart count in navbar
  const updateCartCount = async () => {
    try {
      const response = await api.getCartCount(user._id);
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { count: response.count } 
      }));
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  // Simple notification function
  const showNotification = (message, type = 'info') => {
    // You can replace this with a proper toast library
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    alert(`${emoji} ${message}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-gray-600">
            Items you've saved for later ({wishlistItems.length} items)
          </p>
        </motion.div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start browsing and add items you love to your wishlist
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          /* Wishlist Items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigateToProduct(item.id)}
                  />
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={actionLoading}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                  <h3 
                    className="font-semibold text-lg text-gray-800 mb-2 hover:text-amber-600 cursor-pointer transition-colors"
                    onClick={() => navigateToProduct(item.id)}
                  >
                    {item.name}
                  </h3>
                  <p className="font-bold text-xl text-gray-900 mb-4">
                    {formatPrice(item.price)}
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock || actionLoading}
                      className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        item.inStock && !actionLoading
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={16} />
                      <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Wishlist Actions */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={addAllToCart}
                disabled={actionLoading || wishlistItems.filter(item => item.inStock).length === 0}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Adding...' : 'Add All to Cart'}
              </button>
              
              <button
                onClick={clearAllWishlist}
                disabled={actionLoading}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {actionLoading ? 'Clearing...' : 'Clear Wishlist'}
              </button>
              
              <button
                onClick={() => navigate('/shop')}
                className="border border-amber-600 text-amber-600 px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {actionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;