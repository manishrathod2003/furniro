// components/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Search, Heart, ShoppingCart, Menu, X, LogOut, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./Auth/AuthModal";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count || 0);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Get initial cart count if user is authenticated
    if (isAuthenticated && user) {
      fetchCartCount();
    }

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isAuthenticated, user]);

  const fetchCartCount = async () => {
    try {
      if (user) {
        const response = await fetch(`http://localhost:5000/api/cart/count/${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.count || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setCartCount(0);
  };

  // Handle user icon click
  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setUserDropdownOpen(!userDropdownOpen);
    } else {
      setAuthModalOpen(true);
    }
  };

  // Navigation items
  const navItems = [
    { title: "Home", href: "/" },
    { title: "Shop", href: "/shop" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  // Check if current route is active
  const isActiveRoute = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full bg-white shadow-sm relative z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo Section */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center">
                <img
                  src="/src/images/logo.png"
                  alt="Logo"
                  className="w-12 md:w-20 h-auto"
                />
                <h1 className="text-xl md:text-3xl font-bold text-black font-serif">
                  Furniro
                </h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-16">
              {navItems.map((item, index) => (
                <motion.div key={index} whileHover={{ scale: 1.1 }}>
                  <Link
                    to={item.href}
                    className={`font-medium text-base transition-colors relative ${
                      isActiveRoute(item.href)
                        ? "text-amber-600"
                        : "text-black hover:text-gray-600"
                    }`}
                  >
                    {item.title}
                    {isActiveRoute(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-600"
                        initial={false}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Icons Section */}
            <div className="flex items-center space-x-4 md:space-x-8">
              {/* Desktop Icons */}
              <div className="hidden sm:flex items-center space-x-4 md:space-x-8">
                {/* User Icon with Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleUserIconClick}
                    className="text-black hover:text-gray-600 transition-colors flex items-center space-x-1"
                  >
                    {isAuthenticated ? (
                      <UserCircle size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                    ) : (
                      <User size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                    )}
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {userDropdownOpen && isAuthenticated && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10"
                      >
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <UserCircle size={16} className="mr-3" />
                          My Profile
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} className="mr-3" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other Icons */}
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to="/search"
                    className="text-black hover:text-gray-600 transition-colors"
                  >
                    <Search size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to="/wishlist"
                    className="text-black hover:text-gray-600 transition-colors"
                  >
                    <Heart size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                  </Link>
                </motion.div>

                {/* Cart Icon with Count */}
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to="/cart"
                    className="text-black hover:text-gray-600 transition-colors relative"
                  >
                    <ShoppingCart size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden text-black hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X size={24} strokeWidth={1.5} />
                ) : (
                  <Menu size={24} strokeWidth={1.5} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40"
            >
              <nav className="px-4 py-4 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div key={index} whileHover={{ x: 10 }}>
                    <Link
                      to={item.href}
                      className={`block font-medium text-base transition-colors py-2 ${
                        isActiveRoute(item.href)
                          ? "text-amber-600"
                          : "text-black hover:text-gray-600"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Section */}
                {isAuthenticated ? (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserCircle size={24} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block py-2 text-gray-700 hover:text-amber-600"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block py-2 text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <button
                      onClick={() => {
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 py-2 text-amber-600 hover:text-amber-700"
                    >
                      <User size={20} />
                      <span>Login / Register</span>
                    </button>
                  </div>
                )}
                
                {/* Mobile Icons */}
                <div className="flex items-center justify-center space-x-8 pt-4 border-t">
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      to="/search"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <Search size={24} strokeWidth={1.5} />
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      to="/wishlist"
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <Heart size={24} strokeWidth={1.5} />
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      to="/cart"
                      className="text-black hover:text-gray-600 transition-colors relative"
                    >
                      <ShoppingCart size={24} strokeWidth={1.5} />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;