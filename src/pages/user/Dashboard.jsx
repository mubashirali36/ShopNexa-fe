import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import api from "../../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrderCount(res.data.length)).catch(() => {});
  }, []);

  const stats = [
    { label: "Total Orders", value: orderCount, icon: <FiPackage />, link: "/dashboard/orders" },
    { label: "Wishlist Items", value: wishlist?.products?.length || 0, icon: <FiHeart />, link: "/wishlist" },
    { label: "Cart Items", value: cartCount, icon: <FiShoppingCart />, link: "/cart" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
      <p className="text-gray-500 mb-6">Here's a quick overview of your account.</p>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link} className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
            <div className="bg-primary-50 text-primary-600 p-3 rounded-full text-xl">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
