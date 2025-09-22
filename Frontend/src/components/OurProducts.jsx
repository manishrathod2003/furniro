// components/OurProducts/OurProducts.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share, RefreshCw, Heart, ShoppingCart, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [compareProducts, setCompareProducts] = useState([]);
  const [showLoginNotification, setShowLoginNotification] = useState(false);
  const [showCompareNotification, setShowCompareNotification] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [likingProduct, setLikingProduct] = useState({});

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Available fallback images array
  const fallbackImages = [
    "images/living.png",
    "images/bedroom.png", 
    "images/dining.png",
    "images/sofa.png",
    "images/cafe_chair1.png",
    "images/cafe_chair2.png",
    "images/bar_table.jpg",
    "images/hero.jpg"
  ];

  // Function to get fallback image based on index
  const getFallbackImage = (index) => {
    return fallbackImages[index % fallbackImages.length];
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts({ page: 1, limit: 8 });
        setProducts(response.products || response);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load compare list from localStorage
  useEffect(() => {
    const loadCompareList = () => {
      try {
        const compareList = JSON.parse(localStorage.getItem("compareList") || "[]");
        setCompareProducts(compareList);
      } catch (error) {
        console.error("Error loading compare list:", error);
        setCompareProducts([]);
      }
    };

    loadCompareList();

    // Listen for compare updates
    const handleCompareUpdate = () => {
      loadCompareList();
    };

    window.addEventListener("compareUpdated", handleCompareUpdate);
    return () => window.removeEventListener("compareUpdated", handleCompareUpdate);
  }, []);

  // Fetch user's wishlist if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserWishlist();
    }
  }, [isAuthenticated, user]);

  const fetchUserWishlist = async () => {
    try {
      const response = await api.getUserWishlist(user._id);
      const likedProductIds = response.data.map((item) => item.productId._id);
      setLikedProducts(new Set(likedProductIds));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
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

  // Add to cart functionality
  const handleAddToCart = async (product) => {
    if (!isAuthenticated || !user) {
      showLoginAlert();
      return;
    }

    const productId = product._id || product.id;

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));

      const cartItem = {
        userId: user._id,
        productId: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: "L",
        color: "Default",
        image: product.image || getFallbackImage(0),
      };

      const response = await api.addToCart(cartItem);

      if (response.success) {
        // Update cart count in navbar
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { count: response.count || 0 },
          })
        );

        alert(`${product.name} added to cart successfully!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.message.includes("already in cart")) {
        alert("Product is already in your cart!");
      } else {
        alert("Failed to add product to cart. Please try again.");
      }
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Like/Unlike functionality with backend integration
  const handleLike = async (product) => {
    if (!isAuthenticated || !user) {
      showLoginAlert();
      return;
    }

    const productId = product._id || product.id;

    try {
      setLikingProduct((prev) => ({ ...prev, [productId]: true }));

      const response = await api.toggleWishlist(user._id, productId);

      if (response.success) {
        // Update local state based on response
        if (response.action === "added") {
          setLikedProducts((prev) => new Set([...prev, productId]));
          alert(`${product.name} added to wishlist!`);
        } else {
          setLikedProducts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          alert(`${product.name} removed from wishlist!`);
        }

        // Update wishlist count in navbar
        updateWishlistCount();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setLikingProduct((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Update wishlist count
  const updateWishlistCount = async () => {
    try {
      const response = await api.getWishlistCount(user._id);
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { count: response.count },
        })
      );
    } catch (error) {
      console.error("Error updating wishlist count:", error);
    }
  };

  // Navigate to product detail page
  const handleProductClick = (product) => {
    const productId = product._id || product.id;
    navigate(`/product/${productId}`);
  };

  // Share functionality
  const handleShare = (product) => {
    const productUrl = `${window.location.origin}/product/${
      product._id || product.id
    }`;

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out this ${product.name}`,
          url: productUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(productUrl)
        .then(() => {
          alert("Product link copied to clipboard!");
        })
        .catch(() => {
          alert(`Share this product: ${productUrl}`);
        });
    }
  };

  // Enhanced compare functionality with navigation
  const handleCompare = (product) => {
    if (!isAuthenticated || !user) {
      showLoginAlert();
      return;
    }

    const productId = product._id || product.id;
    const existingCompareList = JSON.parse(localStorage.getItem("compareList") || "[]");
    
    // Check if product is already in compare list
    const isAlreadyComparing = existingCompareList.find((item) => (item._id || item.id) === productId);

    if (isAlreadyComparing) {
      // Remove from compare list
      const updatedCompareList = existingCompareList.filter(
        (item) => (item._id || item.id) !== productId
      );
      localStorage.setItem("compareList", JSON.stringify(updatedCompareList));
      setCompareProducts(updatedCompareList);
      
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
      setCompareProducts(updatedCompareList);
      
      showCompareAlert(`${product.name} added to compare list!`, true);
      
      // Update compare count
      window.dispatchEvent(new CustomEvent("compareUpdated", {
        detail: { count: updatedCompareList.length }
      }));

      // Ask if user wants to go to compare page
      setTimeout(() => {
        const goToCompare = window.confirm(
          "Would you like to view the comparison page now?"
        );
        if (goToCompare) {
          navigate("/compare");
          window.scrollTo(0, 0);
        }
      }, 1000);
    }
  };

  // Check if product is in compare list
  const isProductInCompare = (product) => {
    const productId = product._id || product.id;
    return compareProducts.some((item) => (item._id || item.id) === productId);
  };

  // Check if product is liked
  const isProductLiked = (product) => {
    const productId = product._id || product.id;
    return likedProducts.has(productId);
  };

  // Navigate to shop page
  const handleShowMore = () => {
    navigate("/shop");
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-10 md:py-2 bg-white-50 relative">
      {/* Login Notification */}
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

      {/* Compare Notification */}
      {showCompareNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              showCompareNotification.isSuccess ? 'bg-green-500' : 'bg-blue-500'
            } text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}
          >
            <RefreshCw className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium flex-1">
              {showCompareNotification.message}
            </span>
            {showCompareNotification.isSuccess && compareProducts.length > 0 && (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
              >
                <div className="w-full h-80 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600 text-lg">
                Error loading products: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#B88E2F] text-white px-6 py-2 rounded hover:bg-[#A07A28]"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            products.map((product, index) => {
              const hasDiscount = index % 3 === 0;
              const isNew = index % 4 === 0;
              const discountPercent = hasDiscount
                ? [30, 50][Math.floor(Math.random() * 2)]
                : 0;
              const originalPrice = hasDiscount
                ? Math.floor(product.price * 1.4)
                : product.price;
              const productId = product._id || product.id;
              const isLiked = isProductLiked(product);
              const isLiking = likingProduct[productId];
              const isInCompare = isProductInCompare(product);

              return (
                <motion.div
                  key={productId || Math.random()}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || getFallbackImage(index)}
                      alt={product.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = getFallbackImage(index);
                      }}
                      onClick={() => handleProductClick(product)}
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 space-y-2 z-10">
                      {hasDiscount && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          -{discountPercent}%
                        </div>
                      )}

                      {isNew && !hasDiscount && (
                        <div className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          New
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-4">
                      {/* Add to Cart Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={addingToCart[productId]}
                        className="bg-white text-[#B88E2F] px-8 py-2 font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        {addingToCart[productId] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <span>Add to cart</span>
                        )}
                      </motion.button>

                      {/* Action Icons */}
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center space-x-1 text-white hover:text-[#B88E2F] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(product);
                          }}
                        >
                          <Share size={16} />
                          <span className="text-sm font-medium">Share</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className={`flex items-center space-x-1 transition-colors ${
                            isInCompare
                              ? "text-blue-300 hover:text-blue-200"
                              : "text-white hover:text-[#B88E2F]"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompare(product);
                          }}
                        >
                          <RefreshCw 
                            size={16} 
                            className={isInCompare ? "animate-spin" : ""} 
                          />
                          <span className="text-sm font-medium">
                            {isInCompare ? "Remove" : "Compare"}
                          </span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          disabled={isLiking}
                          className={`flex items-center space-x-1 transition-colors disabled:opacity-50 ${
                            isLiked
                              ? "text-red-400 hover:text-red-300"
                              : "text-white hover:text-[#B88E2F]"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(product);
                          }}
                        >
                          {isLiking ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : (
                            <Heart
                              size={16}
                              className={isLiked ? "fill-current" : ""}
                            />
                          )}
                          <span className="text-sm font-medium">
                            {isLiking
                              ? "Loading..."
                              : isLiked
                              ? "Liked"
                              : "Like"}
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div
                    className="p-6 bg-gray-50"
                    onClick={() => handleProductClick(product)}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 truncate">
                      {product.description ||
                        `${product.brand} - ${product.category}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <p className="text-lg font-semibold text-gray-900">
                          Rp {product.price?.toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p className="text-sm text-gray-400 line-through">
                            Rp {originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      {/* Product Status Icons */}
                      <div className="flex items-center space-x-2">
                        {isLiked && (
                          <div className="text-red-500" title="In Wishlist">
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
                            <RefreshCw size={16} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-12">
          {products.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowMore}
              className="border-2 border-[#B88E2F] text-[#B88E2F] font-medium py-2 px-8 rounded hover:bg-[#B88E2F] hover:text-white transition-colors"
            >
              Show More
            </motion.button>
          )}
        </div>

        {/* Fixed Compare Button (if products in compare) */}
        {compareProducts.length > 0 && (
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
              <RefreshCw size={20} />
              <span>Compare ({compareProducts.length})</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OurProducts;