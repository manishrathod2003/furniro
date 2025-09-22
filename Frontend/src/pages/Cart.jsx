import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
import FeaturesSection from '../components/FeaturesSection';
import PageHeader from '../components/PageHeader';
import { api } from "../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use React Router navigation

  // Breadcrumb configuration
  const breadcrumb = [
    { label: 'Home', path: '/' },
    { label: 'Cart' } // Current page - no path needed
  ];

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId') || 'guest';
      
      console.log('Fetching cart for userId:', userId);
      
      // Use centralized API service instead of direct fetch
      const result = await api.getCartItems(userId);
      console.log('Cart API Response:', result);
      
      // Handle different response formats from your backend
      let items = [];
      if (result.success) {
        items = result.data || [];
      } else if (result.cartItems) {
        items = result.cartItems;
      } else if (Array.isArray(result)) {
        items = result;
      }
      
      // Transform data to match frontend format
      const transformedItems = items.map(item => ({
        _id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/api/placeholder/300/300', // Fixed image path
        size: item.size,
        color: item.color,
        productId: item.productId
      }));
      
      setCartItems(transformedItems);
      console.log('Cart items loaded:', transformedItems);
      
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError(error.message);
      
      // Fallback to localStorage if API fails
      const localCart = localStorage.getItem('cartItems');
      if (localCart) {
        try {
          const parsedCart = JSON.parse(localCart);
          // Ensure proper image paths for local data too
          const transformedLocal = parsedCart.map(item => ({
            ...item,
            image: item.image?.startsWith('/src/') 
              ? '/api/placeholder/300/300' 
              : item.image || '/api/placeholder/300/300'
          }));
          setCartItems(transformedLocal);
        } catch (e) {
          console.error('Error parsing localStorage cart:', e);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Store original quantity for rollback
    const originalItem = cartItems.find(item => item._id === itemId);
    const originalQuantity = originalItem ? originalItem.quantity : 1;
    
    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }));
      
      // Update local state immediately for better UX
      setCartItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      console.log('Updating quantity for item:', itemId, 'to:', newQuantity);
      
      // Use centralized API service
      const result = await api.updateCartQuantity(itemId, newQuantity);
      console.log('Update quantity response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update quantity');
      }
      
      // Update localStorage as backup
      const updatedItems = cartItems.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      
      // Dispatch event for navbar update
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error updating quantity:', error);
      
      // Revert local state on error
      setCartItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, quantity: originalQuantity }
            : item
        )
      );
      
      setError(`Failed to update quantity: ${error.message}`);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeFromCart = async (itemId) => {
    // Store original items for rollback
    const originalItems = [...cartItems];
    
    try {
      // Update local state immediately for better UX
      setCartItems(prev => prev.filter(item => item._id !== itemId));
      
      console.log('Removing item:', itemId);
      
      // Use centralized API service
      const result = await api.removeFromCart(itemId);
      console.log('Remove item response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to remove item');
      }
      
      // Update localStorage as backup
      const updatedItems = originalItems.filter(item => item._id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      
      // Dispatch event for navbar update
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error removing item:', error);
      
      // Revert local state on error
      setCartItems(originalItems);
      setError(`Failed to remove item: ${error.message}`);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleNavigation = (path) => {
    navigate(path); // Use React Router navigation
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <motion.div
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full mx-auto mb-4"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 font-medium"
          >
            Loading your cart...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Reusable Page Header Component */}
        <PageHeader
        title="Cart"
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Cart" }]}
        backgroundImage="/src/images/shop.jpg"
        showLogo={true}
        logoSrc="/src/images/logo.png"
      />

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-7xl mx-auto px-4 pt-4"
          >
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
              <span 
                className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                onClick={() => setError(null)}
              >
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        
          {cartItems.length === 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-16"
            >
              <motion.div
                variants={itemVariants}
                className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
              >
                <ShoppingBag className="w-16 h-16 text-orange-400" />
              </motion.div>
              
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                Your cart is empty
              </motion.h2>
              
              <motion.p
                variants={itemVariants}
                className="text-gray-600 mb-8 text-lg"
              >
                Add some amazing products to your cart to continue shopping.
              </motion.p>
              
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/shop')}
                className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft size={20} />
                <span>Continue Shopping</span>
              </motion.button>
            </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Cart Items */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-sm border border-orange-100">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 p-6 bg-gradient-to-r from-orange-100 to-amber-100 font-semibold text-gray-800 text-center">
                  <div className="col-span-2 text-left">Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Subtotal</div>
                </div>

                {/* Cart Items */}
                <AnimatePresence>
                  <div className="divide-y divide-orange-100">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item._id || item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.1 }}
                        className="grid grid-cols-5 gap-4 p-6 items-center hover:bg-orange-75 transition-colors group"
                      >
                        {/* Product Info */}
                        <div className="col-span-2 flex items-center space-x-4">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-orange-100"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/api/placeholder/80/80';
                              }}
                            />
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-center text-gray-600 font-medium">
                          Rs. {item.price?.toLocaleString()}
                        </div>

                        {/* Quantity */}
                        <div className="text-center">
                          <div className="inline-flex items-center bg-white border border-orange-200 rounded-lg shadow-sm">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={updating[item._id] || item.quantity <= 1}
                              className="p-2 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-orange-200 rounded-l-lg transition-colors"
                            >
                              <Minus size={14} />
                            </motion.button>
                            <span className="px-4 py-2 min-w-[50px] font-semibold text-gray-800">
                              {updating[item._id] ? '...' : item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={updating[item._id]}
                              className="p-2 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed border-l border-orange-200 rounded-r-lg transition-colors"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-3">
                            <span className="font-bold text-gray-900">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item._id)}
                              className="p-2 text-orange-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Cart Totals */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 sticky top-8 shadow-lg border border-orange-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Cart Totals
                </h2>
                
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center py-4 px-4 bg-white rounded-lg shadow-sm border border-orange-100"
                  >
                    <span className="font-semibold text-gray-800">Subtotal</span>
                    <span className="text-gray-600 font-medium">Rs. {getSubtotal().toLocaleString()}</span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg shadow-sm border border-orange-200"
                  >
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Rs. {getSubtotal().toLocaleString()}
                    </span>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/checkout')}
                  disabled={cartItems.length === 0}
                  className="w-full mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 rounded-xl font-bold hover:from-gray-900 hover:to-black transition-all duration-300 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
      <FeaturesSection/>
    </div>
  );
};

export default Cart;