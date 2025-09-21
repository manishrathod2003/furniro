import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import { api } from "../services/api";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCartItems();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.getProductById(id);
      setProduct(data);

      // Set default color selection
      if (data.variants?.colors?.length > 0) {
        setSelectedColor(data.variants.colors[0].name);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.message || "Product not found");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId") || "guest";
      const response = await api.getCartItems(userId);
      setCartItems(response.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // If error, initialize with empty cart
      setCartItems([]);
    }
  };

  // Add item to cart (backend)
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);

      const userId = localStorage.getItem("userId") || "guest";
      const cartItem = {
        userId: userId,
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
        image: product.image || "/api/placeholder/80/80",
      };

      // Add to backend
      const response = await api.addToCart(cartItem);

      if (response.success) {
        // Refresh cart items
        await fetchCartItems();
        setIsCartOpen(true);

        // Show success message (optional)
        alert("Product added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Remove item from cart (backend)
  const removeFromCart = async (itemId) => {
    try {
      const response = await api.removeFromCart(itemId);
      if (response.success) {
        await fetchCartItems();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item from cart.");
    }
  };

  // Update quantity in cart (backend)
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      const response = await api.updateCartQuantity(itemId, newQuantity);
      if (response.success) {
        await fetchCartItems();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleBackToShop = () => {
    navigate("/shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToShop}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsCartOpen(false)}
            ></div>

            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl">
              <div className="flex h-full flex-col">
                {/* Cart Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold">Shopping Cart</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item._id || item.id}
                          className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg relative"
                        >
                          {/* Product Image */}
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {item.name}
                            </h4>

                            {/* Quantity and Price Row */}
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-900 font-medium">
                                {item.quantity}
                              </span>
                              <span className="text-gray-400">X</span>
                              <span className="text-orange-600 font-medium">
                                Rs. {item.price?.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item._id || item.id)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 hover:text-gray-700 transition-colors"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Cart Footer */}
                {cartItems.length > 0 && (
                  <div className="border-t px-6 py-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold text-orange-600">
                        Rs. {getSubtotal().toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate("/cart");
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded hover:bg-gray-50"
                      >
                        Cart
                      </button>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate("/checkout");
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded hover:bg-gray-50"
                      >
                        Checkout
                      </button>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate("/compare");

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded hover:bg-gray-50"
                      >
                        Comparison
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-orange-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 text-base">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-600">›</span>
            <button
              onClick={handleBackToShop}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Shop
            </button>
            <span className="text-gray-600">›</span>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <span className="text-gray-900 font-medium">{product?.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images */}
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 4 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={product.image || "/api/placeholder/80/80"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Product Image */}
            <div className="flex-1 max-w-md">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={product.image || "/api/placeholder/500/500"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="text-2xl font-medium text-gray-600 mb-4">
                Rs. {product.price?.toLocaleString()}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(product.averageRating || 4.5)}
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">
                  {product.totalReviews || 5} Customer Review
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.shortDescription ||
                product.description ||
                "Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound."}
            </p>

            {/* Size Selection */}
            <div>
              <h4 className="text-gray-600 text-sm font-medium mb-3">Size</h4>
              <div className="flex space-x-3">
                {["L", "XL", "XS"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h4 className="text-gray-600 text-sm font-medium mb-3">Color</h4>
              <div className="flex space-x-3">
                {[
                  { name: "Purple", color: "#6366f1" },
                  { name: "Black", color: "#000000" },
                  { name: "Gold", color: "#f59e0b" },
                ].map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColor(colorOption.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === colorOption.name
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                    title={colorOption.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center space-x-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-white border border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add To Cart</span>
                )}
              </button>

              {/* Compare Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-white border border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Compare</span>
              </button>
            </div>

            {/* Product Meta */}
            <div className="border-t pt-6 space-y-3 text-sm">
              <div className="flex items-center">
                <span className="w-16 text-gray-500">SKU</span>
                <span className="text-gray-400 mr-4">:</span>
                <span className="text-gray-600">{product.sku || "SS001"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-gray-500">Category</span>
                <span className="text-gray-400 mr-4">:</span>
                <span className="text-gray-600">
                  {product.category || "Sofas"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-gray-500">Tags</span>
                <span className="text-gray-400 mr-4">:</span>
                <span className="text-gray-600">
                  {product.tags?.join(", ") || "Sofa, Chair, Home, Shop"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-gray-500">Share</span>
                <span className="text-gray-400 mr-4">:</span>
                <div className="flex space-x-3">
                  <button className="text-gray-600 hover:text-gray-900 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="border-b border-gray-200 mb-12">
          <nav className="flex justify-center space-x-8">
            {[
              { id: "description", label: "Description" },
              { id: "additional", label: "Additional Information" },
              {
                id: "reviews",
                label: `Reviews [${product.totalReviews || 5}]`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-16 max-w-4xl mx-auto">
          {activeTab === "description" && (
            <div>
              <p className="text-gray-600 leading-relaxed text-center mb-8">
                {product.description ||
                  "Embodying the raw, wayward spirit of rock 'n' roll, the Kilburn portable active stereo speaker takes the unmistakable look and sound of Marshall, unplugs the chords, and takes the show on the road."}
              </p>
              <p className="text-gray-600 leading-relaxed text-center mb-8">
                Weighing in under 7 pounds, the Kilburn is a lightweight piece
                of vintage styled engineering. Setting the bar as one of the
                loudest speakers in its class, the Kilburn is a compact,
                stout-hearted hero with a well-balanced audio which boasts a
                clear midrange and extended highs for a sound that is both
                articulate and pronounced.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-orange-50 rounded-lg overflow-hidden">
                  <img
                    src={product.image || "/api/placeholder/400/300"}
                    alt="Product detail 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-orange-50 rounded-lg overflow-hidden">
                  <img
                    src={product.image || "/api/placeholder/400/300"}
                    alt="Product detail 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "additional" && (
            <div className="text-center">
              <p className="text-gray-600">
                Additional product information will be displayed here.
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-center">
              <p className="text-gray-600">
                Customer reviews will be displayed here.
              </p>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-medium text-center mb-12">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Discount Badge */}
                {index % 2 === 0 && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{index === 0 ? "30" : "50"}%
                  </div>
                )}
                {/* New Badge */}
                {index === 3 && (
                  <div className="absolute top-3 right-3 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    New
                  </div>
                )}

                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image || "/api/placeholder/250/250"}
                    alt={`Related product ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {["Syltherine", "Leviosa", "Lolito", "Respira"][index]}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {
                      [
                        "Stylish cafe chair",
                        "Stylish cafe chair",
                        "Luxury big sofa",
                        "Outdoor bar table and stool",
                      ][index]
                    }
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {
                        [
                          "Rp 2.500.000",
                          "Rp 2.500.000",
                          "Rp 7.000.000",
                          "Rp 500.000",
                        ][index]
                      }
                    </span>
                    {index % 2 === 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {["Rp 3.500.000", "", "Rp 14.000.000", ""][index]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={handleBackToShop}
              className="bg-white border-2 border-orange-600 text-orange-600 px-12 py-3 font-medium hover:bg-orange-50 transition-colors"
            >
              Show More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
