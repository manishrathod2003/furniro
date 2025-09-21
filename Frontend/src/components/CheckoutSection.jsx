// components/CheckoutSection.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CheckoutSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'Sri Lanka',
    streetAddress: '',
    townCity: '',
    province: 'Western Province',
    zipCode: '',
    phone: '',
    email: '',
    additionalInfo: '',
    paymentMethod: 'bank-transfer'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Order placed:', formData);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 space-y-16">
            {/* Billing Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight">Billing details</h2>
              
              <div className="space-y-6">
                {/* First & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-900 font-medium mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 font-medium mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    Country / Region
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    Street address
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>

                {/* Town / City */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    Town / City
                  </label>
                  <input
                    type="text"
                    name="townCity"
                    value={formData.townCity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    Province
                  </label>
                  <div className="relative">
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="Western Province">Western Province</option>
                      <option value="Central Province">Central Province</option>
                      <option value="Southern Province">Southern Province</option>
                      <option value="Northern Province">Northern Province</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    ZIP code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-900 font-medium mb-3">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Additional information"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-gray-500 placeholder-gray-400"
                  />
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:pl-8"
            >
              {/* Product Summary */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Product</h3>
                  <h3 className="text-2xl font-semibold text-gray-900 text-right">Subtotal</h3>
                </div>

                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Asgaard sofa</span>
                    <span className="text-gray-600">x 1</span>
                    <span className="text-gray-900">Rs. 250,000.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-900 font-medium">Subtotal</span>
                  <span className="text-gray-900">Rs. 250,000.00</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-2xl font-bold text-amber-600">Rs. 250,000.00</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <div className="space-y-4">
                  {/* Direct Bank Transfer */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank-transfer"
                        checked={formData.paymentMethod === 'bank-transfer'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-gray-900 font-medium">Direct Bank Transfer</span>
                    </label>
                    {formData.paymentMethod === 'bank-transfer' && (
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        Make your payment directly into our bank account. Please use 
                        your Order ID as the payment reference. Your order will not be 
                        shipped until the funds have cleared in our account.
                      </p>
                    )}
                  </div>

                  {/* Other Payment Options */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer-2"
                      checked={formData.paymentMethod === 'bank-transfer-2'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                    />
                    <span className="ml-3 text-gray-600">Direct Bank Transfer</span>
                  </label>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash-on-delivery"
                      checked={formData.paymentMethod === 'cash-on-delivery'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                    />
                    <span className="ml-3 text-gray-600">Cash On Delivery</span>
                  </label>
                </div>

                <p className="mt-6 text-sm text-gray-600 leading-relaxed">
                  Your personal data will be used to support your experience 
                  throughout this website, to manage access to your account, and 
                  for other purposes described in our <a href="#" className="font-semibold text-gray-900 hover:text-amber-600">privacy policy</a>.
                </p>
              </div>

              {/* Place Order Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full bg-white text-gray-900 font-medium py-4 px-8 border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place order'}
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutSection;