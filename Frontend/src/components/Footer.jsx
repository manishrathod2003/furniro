// components/Footer/Footer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
    // Add your subscription logic here
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
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
    }
  };

  // Navigation links with proper routing
  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const helpLinks = [
    { name: "Payment Options", path: "/payment-options" },
    { name: "Returns", path: "/returns" },
    { name: "Privacy Policies", path: "/privacy-policies" }
  ];

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-6xl ml-8 sm:ml-12 lg:ml-16 mr-4 sm:mr-6 lg:mr-40">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-black mb-6">Furniro.</h3>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>400 University Drive Suite 200 Coral</p>
                <p>Gables,</p>
                <p>FL 33134 USA</p>
              </div>
            </div>
          </motion.div>

          {/* Links Section */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="text-gray-500 font-medium mb-8 text-base">Links</h4>
            <nav className="space-y-6">
              {navigationLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.path}
                  whileHover={{ x: 5 }}
                  className="block text-black font-medium hover:text-gray-600 transition-colors duration-200 text-base"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Help Section */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="text-gray-500 font-medium mb-8 text-base">Help</h4>
            <nav className="space-y-6">
              {helpLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.path}
                  whileHover={{ x: 5 }}
                  className="block text-black font-medium hover:text-gray-600 transition-colors duration-200 text-base"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="text-gray-500 font-medium mb-8 text-base">Newsletter</h4>
            <form onSubmit={handleSubscribe}>
              <div className="flex items-end border-b border-black pb-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  className="flex-1 px-0 py-3 text-sm text-gray-900 placeholder-gray-400 border-0 focus:ring-0 bg-transparent outline-none"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-3 pb-3 text-sm font-medium text-black hover:text-gray-600 transition-colors duration-200 uppercase tracking-wide"
                >
                  SUBSCRIBE
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Bottom Border and Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-10 border-t border-gray-200"
        >
          <p className="text-black text-sm font-normal">
            2023 Furnino. All rights reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;