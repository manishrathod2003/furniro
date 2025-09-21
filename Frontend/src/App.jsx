// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ProtectedRoute from '../src/components/Auth/ProtectedRoute';

// Import your pages
import Home from '../src/pages/Home';
import Shop from '../src/pages/Shop';
import About from '../src/pages/About';
import Contact from '../src/pages/Contact';
import SingleProduct from '../src/pages/SingleProduct';
import Cart from '../src/pages/Cart';
import Checkout from '../src/pages/Checkout';
import Profile from '../src/pages/Profile';
import Wishlist from '../src/pages/Wishlist';
import ProductComparison from '../src/pages/ProductComparison';
// import Search from '../src/pages/Search';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          
          {/* Main Content */}
          <main className="pt-0 md:pt-0">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<SingleProduct />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Semi-Protected Routes (can access but limited functionality) */}
              {/* <Route path="/search" element={<Search />} /> */}
              
              {/* Product Comparison Route - Semi-protected */}
              <Route 
                path="/compare" 
                element={<ProductComparison />} 
              />
              
              {/* Protected Routes - Login required */}
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute message="Please login to view and manage your cart items.">
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute message="Please login to proceed with checkout and place your order.">
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/wishlist" 
                element={
                  <ProtectedRoute message="Please login to view your saved items.">
                    <Wishlist />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute message="Please login to access your profile.">
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Success/Thank you page after checkout */}
              <Route 
                path="/order-success" 
                element={
                  <ProtectedRoute message="Please login to view your order details.">
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center max-w-md mx-auto p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Successful!</h2>
                        <p className="text-gray-600 mb-6">
                          Thank you for your purchase. Your order has been placed successfully and you will receive a confirmation email shortly.
                        </p>
                        <div className="space-x-4">
                          <a 
                            href="/shop" 
                            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors inline-block"
                          >
                            Continue Shopping
                          </a>
                          <a 
                            href="/profile" 
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-block"
                          >
                            View Orders
                          </a>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route for 404 */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-96 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Page Not Found
                      </h2>
                      <p className="text-gray-600 mb-6">
                        The page you're looking for doesn't exist.
                      </p>
                      <a 
                        href="/" 
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;