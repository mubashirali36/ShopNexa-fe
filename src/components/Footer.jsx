import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2 md:col-span-1">
        <h3 className="text-2xl font-extrabold text-white mb-3">
          Shop<span className="text-primary-500">Nexa</span>
        </h3>
        <p className="text-sm text-gray-400">Your one-stop shop for everything you need, delivered fast.</p>
        <div className="flex gap-3 mt-4">
          <a href="https://www.facebook.com/" className="hover:text-primary-500 transition-colors"><FiFacebook /></a>
          <a href="https://www.instagram.com/" className="hover:text-primary-500 transition-colors"><FiInstagram /></a>
          <a href="https://twitter.com/" className="hover:text-primary-500 transition-colors"><FiTwitter /></a>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/products" className="hover:text-primary-500 transition-colors">All Products</Link></li>
          <li><Link to="/wishlist" className="hover:text-primary-500 transition-colors">Wishlist</Link></li>
          <li><Link to="/cart" className="hover:text-primary-500 transition-colors">Cart</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Account</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/dashboard" className="hover:text-primary-500 transition-colors">Dashboard</Link></li>
          <li><Link to="/dashboard/orders" className="hover:text-primary-500 transition-colors">My Orders</Link></li>
          <li><Link to="/login" className="hover:text-primary-500 transition-colors">Login</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Support</h4>
        <ul className="space-y-2 text-sm">
          <li>more help at mubashiali3667@gmail.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 text-center text-xs text-gray-500 py-4">
      © {new Date().getFullYear()} ShopNexa. All rights reserved.
    </div>
  </footer>
);

export default Footer;
