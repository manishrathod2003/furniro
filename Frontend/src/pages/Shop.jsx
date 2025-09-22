// components/Shop/Shop.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import FilterBar from "../components/FilterBar";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";
import FeaturesSection from "../components/FeaturesSection";
import PageHeader from "../components/PageHeader";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [viewMode, setViewMode] = useState("grid");
  const [showCount, setShowCount] = useState(16);
  const [sortBy, setSortBy] = useState("default");
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // New states for enhanced features
  const [compareProducts, setCompareProducts] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Auth context
  const { user, isAuthenticated } = useAuth();

  // Fetch products using backend API
  const fetchProducts = async (
    page = 1,
    limit = 16,
    search = "",
    category = "all",
    sort = "default"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category !== "all" && { category }),
        ...(sort !== "default" && { sort }),
      };

      const response = await api.getProducts(params);
      
      setProducts(response.products || response);
      setTotalProducts(response.totalProducts || response.total || (response.products?.length || 0));
      setTotalPages(response.totalPages || Math.ceil((response.total || 0) / limit));
      setCurrentPage(response.currentPage || page);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
      setCurrentPage(1);
      setLoading(false);
      setError(error.message || "Failed to fetch products");
    }
  };

  // Fetch user's wishlist using backend API
  const fetchUserWishlist = async () => {
    if (!isAuthenticated || !user) {
      setLikedProducts(new Set());
      return;
    }

    try {
      const response = await api.getUserWishlist(user._id);
      const likedProductIds = response.data?.map(item => 
        item.productId?._id || item.productId || item._id
      ) || [];
      setLikedProducts(new Set(likedProductIds));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setLikedProducts(new Set());
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Enhanced Add to Cart with Backend Integration
  const addToCart = async (product) => {
    if (!isAuthenticated || !user) {
      showNotification("Please login to add items to cart", "warning");
      return;
    }

    setCartLoading(true);

    try {
      const cartData = {
        userId: user._id,
        productId: product._id || product.id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image || product.images?.[0],
      };

      const response = await api.addToCart(cartData);

      if (response.success) {
        showNotification("Product added to cart successfully!", "success");
        updateCartCount();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.message.includes('already in cart')) {
        showNotification("Product already in cart!", "info");
      } else {
        showNotification("Failed to add product to cart", "error");
      }
    } finally {
      setCartLoading(false);
    }
  };

  // Enhanced Toggle Like with Backend Integration
  const toggleLike = async (productId) => {
    if (!isAuthenticated || !user) {
      showNotification("Please login to like products", "warning");
      return;
    }

    try {
      const response = await api.toggleWishlist(user._id, productId);
      
      if (response.success) {
        // Update local state based on response
        if (response.action === 'added') {
          setLikedProducts(prev => new Set([...prev, productId]));
          showNotification("Added to wishlist", "success");
        } else {
          setLikedProducts(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          showNotification("Removed from wishlist", "info");
        }
        
        // Update wishlist count in navbar
        updateWishlistCount();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showNotification("Failed to update wishlist", "error");
    }
  };

  // Add to Compare Function
  const addToCompare = (product) => {
    if (compareProducts.length >= 4) {
      showNotification(
        "You can compare maximum 4 products at once!",
        "warning"
      );
      return;
    }

    const productId = product._id || product.id;
    const isAlreadyInCompare = compareProducts.some(
      (p) => (p._id || p.id) === productId
    );

    if (isAlreadyInCompare) {
      showNotification("Product already in compare list", "info");
      return;
    }

    setCompareProducts((prev) => [...prev, product]);
    showNotification("Product added to compare list", "success");
  };

  // Remove from Compare Function
  const removeFromCompare = (productId) => {
    setCompareProducts((prev) =>
      prev.filter((p) => (p._id || p.id) !== productId)
    );
    showNotification("Product removed from compare list", "info");
  };

  // Update Cart Count Function using backend API
  const updateCartCount = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await api.getCartCount(user._id);
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: response.count },
        })
      );
    } catch (error) {
      console.error("Error updating cart count:", error);
    }
  };

  // Update Wishlist Count Function using backend API
  const updateWishlistCount = async () => {
    if (!isAuthenticated || !user) return;

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

  // Show Notification Function
  const showNotification = (message, type = "info") => {
    const notification = {
      id: Date.now(),
      message,
      type,
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 3000);
  };

  // Remove Notification Function
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Initial load
  useEffect(() => {
    fetchProducts(1, showCount, searchTerm, selectedCategory, sortBy);
  }, []);

  // Fetch wishlist when authentication state changes
  useEffect(() => {
    fetchUserWishlist();
  }, [isAuthenticated, user]);

  // Handle filter changes - reset to page 1
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      fetchProducts(1, showCount, searchTerm, selectedCategory, sortBy);
    } else {
      fetchProducts(1, showCount, searchTerm, selectedCategory, sortBy);
    }
  }, [showCount, searchTerm, selectedCategory, sortBy]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page, showCount, searchTerm, selectedCategory, sortBy);
    scrollToTop();
  };

  // Calculate showing range
  const startRange = (currentPage - 1) * showCount + 1;
  const endRange = Math.min(currentPage * showCount, totalProducts);

  return (
    <div className="min-h-screen bg-white">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`p-4 rounded-lg shadow-lg cursor-pointer max-w-sm ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : notification.type === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {notification.message}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="ml-2 text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <PageHeader
        title="Shop"
        breadcrumb={[{ label: "Home", path: "/" }, { label: "Shop" }]}
        backgroundImage="/images/shop.jpg"
        showLogo={true}
        logoSrc="/images/logo.png"
      />

      <FilterBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCount={showCount}
        setShowCount={setShowCount}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalProducts={totalProducts}
        startRange={startRange}
        endRange={endRange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Compare Products Bar */}
      {compareProducts.length > 0 && (
        <div className="container mx-auto px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-semibold">
                {compareProducts.length} products in compare list
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    console.log("View comparison", compareProducts)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compare Now
                </button>
                <button
                  onClick={() => setCompareProducts([])}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        showCount={showCount}
        likedProducts={likedProducts}
        setLikedProducts={setLikedProducts}
        toggleLike={toggleLike}
        addToCart={addToCart}
        compareProducts={compareProducts}
        addToCompare={addToCompare}
        removeFromCompare={removeFromCompare}
        fetchProducts={() =>
          fetchProducts(
            currentPage,
            showCount,
            searchTerm,
            selectedCategory,
            sortBy
          )
        }
      />

      <Pagination
        products={products}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        showCount={showCount}
      />

      <FeaturesSection />

      {/* Cart Loading Overlay */}
      {cartLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg flex items-center space-x-3"
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            <span className="text-gray-700">Adding to cart...</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Shop;