import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Star, ArrowRight, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import FeaturesSection from '../components/FeaturesSection';
import PageHeader from '../components/PageHeader';

const ProductComparison = () => {
  const [compareProducts, setCompareProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    loadCompareProducts();
    loadAllProducts();
  }, []);

  // Load products from localStorage
  const loadCompareProducts = () => {
    const savedCompare = localStorage.getItem('compareList');
    if (savedCompare) {
      try {
        const products = JSON.parse(savedCompare);
        setCompareProducts(products);
      } catch (error) {
        console.error('Error parsing compare list:', error);
        setCompareProducts([]);
      }
    }
    setLoading(false);
  };

  // Load all products for adding to compare
  const loadAllProducts = async () => {
    try {
      const response = await api.getProducts({ limit: 50 });
      setAllProducts(response.products || response);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Remove product from comparison
  const removeFromCompare = (productId) => {
    const updatedProducts = compareProducts.filter(
      (product) => (product._id || product.id) !== productId
    );
    setCompareProducts(updatedProducts);
    localStorage.setItem('compareList', JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event('compareUpdated'));
  };

  // Add product to comparison
  const addToCompare = (product) => {
    if (compareProducts.length >= 3) {
      alert('You can compare maximum 3 products at once!');
      return;
    }
    
    const productId = product._id || product.id;
    const isAlreadyInCompare = compareProducts.some(
      (p) => (p._id || p.id) === productId
    );
    
    if (!isAlreadyInCompare) {
      const updatedProducts = [...compareProducts, product];
      setCompareProducts(updatedProducts);
      localStorage.setItem('compareList', JSON.stringify(updatedProducts));
      window.dispatchEvent(new Event('compareUpdated'));
      setShowAddModal(false);
    } else {
      alert('Product is already in comparison!');
    }
  };

  // Add to cart functionality with backend integration
  const handleAddToCart = async (product) => {
    // Check authentication first
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    const productId = product._id || product.id;
    setAddingToCart(productId);

    try {
      const cartItem = {
        userId: user.id,
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: 'L',
        color: 'Default',
        image: product.image || '/api/placeholder/300/300',
      };

      // Call backend API
      const response = await api.addToCart(cartItem);
      
      if (response.success || response.data) {
        // Show success message
        alert(`${product.name} added to cart successfully!`);
        
        // Dispatch cart updated event
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        throw new Error('Failed to add to cart');
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    // Store current location for redirect after login
    localStorage.setItem('redirectAfterLogin', '/comparison');
    navigate('/login');
  };

  const formatPrice = (price) => {
    return `Rs. ${price?.toLocaleString('en-IN') || '0'}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-25" 
              onClick={() => setShowLoginModal(false)}
            ></div>
            
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Login Required</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Please login to add items to your cart and manage your shopping experience.
                </p>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

       <PageHeader
            title="Product Comparison"
            breadcrumb={[{ label: "Home", path: "/" }, { label: "Comparison" }]}
            backgroundImage="/images/shop.jpg"
            showLogo={true}
            logoSrc="/images/logo.png"
          />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {compareProducts.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ArrowRight className="w-16 h-16 text-gray-400 transform rotate-45" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Products to Compare
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Add products from our shop to compare their features and specifications.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-orange-50 rounded-lg p-6 sticky top-8"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Go to Product page for more Products
                  </h3>
                  <button
                    onClick={() => navigate('/shop')}
                    className="text-amber-600 hover:text-amber-700 font-medium underline text-sm"
                  >
                    View More
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Product Comparison */}
            <div className="lg:col-span-3">
              {/* Product Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                
                {/* Existing Products */}
                <AnimatePresence>
                  {compareProducts.map((product, index) => (
                    <motion.div
                      key={product._id || product.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-orange-50 rounded-lg p-4 relative group"
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCompare(product._id || product.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>

                      {/* Product Image */}
                      <div className="mb-4">
                        <img
                          src={product.image || '/api/placeholder/250/200'}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          {formatPrice(product.price)}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center justify-center mb-4">
                          <div className="flex items-center mr-2">
                            {renderStars(4.7)}
                          </div>
                          <span className="text-sm text-gray-600">4.7</span>
                          <span className="text-xs text-gray-400 ml-1">| 204 Review</span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingToCart === (product._id || product.id)}
                          className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {addingToCart === (product._id || product.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Adding...
                            </>
                          ) : (
                            'Add To Cart'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add Product Card - Made Smaller */}
                {compareProducts.length < 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-orange-50 rounded-lg p-3 border-2 border-dashed border-orange-200 flex flex-col items-center justify-center min-h-[250px]"
                  >
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      Add A Product
                    </h3>
                   
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center text-sm"
                    >
                      Choose a Product
                      <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Detailed Comparison Tables */}
              {compareProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-12"
                >
                  {/* General Section */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">General</h2>
                    <div className="space-y-4">
                      {[
                        { 
                          label: 'Sales Package', 
                          values: compareProducts.map(() => '1 sectional sofa')
                        },
                        { 
                          label: 'Model Number', 
                          values: compareProducts.map((p, i) => 
                            i === 0 ? 'TFCBLIGRBL6SRHS' : 'DTUBLIGRBL568'
                          )
                        },
                        { 
                          label: 'Secondary Material', 
                          values: compareProducts.map(() => 'Solid Wood')
                        },
                        { 
                          label: 'Configuration', 
                          values: compareProducts.map(() => 'L-shaped')
                        },
                        { 
                          label: 'Upholstery Material', 
                          values: compareProducts.map(() => 'Fabric + Cotton')
                        },
                        { 
                          label: 'Upholstery Color', 
                          values: compareProducts.map(() => 'Bright Grey & Lion')
                        },
                      ].map((spec, index) => (
                        <div key={index} className="grid gap-6 py-4 border-b border-gray-200" 
                             style={{gridTemplateColumns: `200px repeat(${Math.max(compareProducts.length, 3)}, 1fr)`}}>
                          <div className="font-medium text-gray-900 text-lg">{spec.label}</div>
                          {spec.values.map((value, i) => (
                            <div key={i} className="text-gray-700">{value}</div>
                          ))}
                          {/* Fill empty columns */}
                          {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                            <div key={`empty-${i}`}></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Section */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Product</h2>
                    <div className="space-y-4">
                      {[
                        { 
                          label: 'Filling Material', 
                          values: compareProducts.map(() => 'Foam')
                        },
                        { 
                          label: 'Finish Type', 
                          values: compareProducts.map(() => 'Bright Grey & Lion')
                        },
                        { 
                          label: 'Adjustable Headrest', 
                          values: compareProducts.map((p, i) => i === 0 ? 'No' : 'Yes')
                        },
                        { 
                          label: 'Maximum Load Capacity', 
                          values: compareProducts.map((p, i) => i === 0 ? '280 KG' : '300 KG')
                        },
                        { 
                          label: 'Origin of Manufacture', 
                          values: compareProducts.map(() => 'India')
                        },
                      ].map((spec, index) => (
                        <div key={index} className="grid gap-6 py-4 border-b border-gray-200" 
                             style={{gridTemplateColumns: `200px repeat(${Math.max(compareProducts.length, 3)}, 1fr)`}}>
                          <div className="font-medium text-gray-900 text-lg">{spec.label}</div>
                          {spec.values.map((value, i) => (
                            <div key={i} className="text-gray-700">{value}</div>
                          ))}
                          {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                            <div key={`empty-${i}`}></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions Section */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Dimensions</h2>
                    <div className="space-y-4">
                      {[
                        { 
                          label: 'Width', 
                          values: compareProducts.map(() => '265.32 cm')
                        },
                        { 
                          label: 'Height', 
                          values: compareProducts.map(() => '76 cm')
                        },
                        { 
                          label: 'Depth', 
                          values: compareProducts.map(() => '167.76 cm')
                        },
                        { 
                          label: 'Weight', 
                          values: compareProducts.map((p, i) => i === 0 ? '45 KG' : '65 KG')
                        },
                        { 
                          label: 'Seat Height', 
                          values: compareProducts.map(() => '41.52 cm')
                        },
                        { 
                          label: 'Leg Height', 
                          values: compareProducts.map(() => '5.46 cm')
                        },
                      ].map((spec, index) => (
                        <div key={index} className="grid gap-6 py-4 border-b border-gray-200" 
                             style={{gridTemplateColumns: `200px repeat(${Math.max(compareProducts.length, 3)}, 1fr)`}}>
                          <div className="font-medium text-gray-900 text-lg">{spec.label}</div>
                          {spec.values.map((value, i) => (
                            <div key={i} className="text-gray-700">{value}</div>
                          ))}
                          {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                            <div key={`empty-${i}`}></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warranty Section */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Warranty</h2>
                    <div className="space-y-4">
                      {[
                        { 
                          label: 'Warranty Summary', 
                          values: compareProducts.map((p, i) => 
                            i === 0 ? '1 Year Manufacturing Warranty' : '1 2 Year Manufacturing Warranty'
                          )
                        },
                        { 
                          label: 'Warranty Service Type', 
                          values: compareProducts.map(() => 
                            'For Warranty Claims or Any Product Related Issues Please Email at operations@trevifurniture.com'
                          )
                        },
                        { 
                          label: 'Covered in Warranty', 
                          values: compareProducts.map((p, i) => 
                            i === 0 ? 'Warranty Against Manufacturing Defect' : 'Warranty of the product is limited to manufacturing defects only.'
                          )
                        },
                        { 
                          label: 'Not Covered in Warranty', 
                          values: compareProducts.map(() => 
                            'The Warranty Does Not Cover Damages Due To Usage Of The Product Beyond Its Intended Use And Wear & Tear In The Natural Course Of Product Usage.'
                          )
                        },
                        { 
                          label: 'Domestic Warranty', 
                          values: compareProducts.map((p, i) => i === 0 ? '1 Year' : '3 Months')
                        },
                      ].map((spec, index) => (
                        <div key={index} className="grid gap-6 py-4 border-b border-gray-200" 
                             style={{gridTemplateColumns: `200px repeat(${Math.max(compareProducts.length, 3)}, 1fr)`}}>
                          <div className="font-medium text-gray-900 text-lg">{spec.label}</div>
                          {spec.values.map((value, i) => (
                            <div key={i} className="text-gray-700 text-sm leading-relaxed">{value}</div>
                          ))}
                          {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                            <div key={`empty-${i}`}></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart Buttons Row */}
                  <div className="grid gap-6 pt-8" 
                       style={{gridTemplateColumns: `200px repeat(${Math.max(compareProducts.length, 3)}, 1fr)`}}>
                    <div></div>
                    {compareProducts.map((product) => (
                      <button
                        key={product._id || product.id}
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart === (product._id || product.id)}
                        className="bg-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {addingToCart === (product._id || product.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          'Add To Cart'
                        )}
                      </button>
                    ))}
                    {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                      <div key={`empty-btn-${i}`}></div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add Product to Compare</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProducts.filter(product => 
                    !compareProducts.some(cp => (cp._id || cp.id) === (product._id || product.id))
                  ).map((product) => (
                    <div key={product._id || product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <img
                        src={product.image || '/api/placeholder/200/200'}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-amber-600 font-semibold mb-3">{formatPrice(product.price)}</p>
                      <button
                        onClick={() => addToCompare(product)}
                        className="w-full bg-amber-600 text-white py-2 rounded font-medium hover:bg-amber-700 transition-colors"
                      >
                        Add to Compare
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
            </motion.div>
            
          </motion.div>
          
        )}
      </AnimatePresence>
      

      <FeaturesSection />
    </div>
  );
};

export default ProductComparison;