import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="text-2xl font-extrabold text-primary-600 shrink-0">
            Shop<span className="text-gray-800">Nexa</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-4 rounded-r-lg transition-colors">
              <FiSearch />
            </button>
          </form>

          <nav className="hidden md:flex items-center gap-5">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors">Products</Link>
            <Link to="/wishlist" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <FiHeart size={20} />
              {wishlist?.products?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.products.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600"
                >
                  <FiUser size={20} />
                  <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-cardHover py-2 fade-in">
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                    <Link to="/dashboard/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">My Orders</Link>
                    <Link to="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Profile</Link>
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-primary">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-500 rounded-lg hover:bg-primary-50 transition-colors">Register</Link>
              </div>
            )}
          </nav>

          <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 fade-in">
          <form onSubmit={handleSearch} className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-sm"
            />
            <button type="submit" className="bg-primary-500 text-white px-3 rounded-r-lg"><FiSearch /></button>
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-1">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-1">Products</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-1">Wishlist ({wishlist?.products?.length || 0})</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-1">Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-1">Dashboard</Link>
              <Link to="/dashboard/orders" onClick={() => setMenuOpen(false)} className="block py-1">My Orders</Link>
              <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)} className="block py-1">Profile</Link>
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-1">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left py-1 text-red-600">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary block text-center flex-1">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-center flex-1 py-2 text-sm font-medium text-primary-600 border border-primary-500 rounded-lg hover:bg-primary-50">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;