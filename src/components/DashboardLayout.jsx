import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiPackage, FiHeart, FiShoppingCart, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/dashboard/orders", label: "My Orders", icon: <FiPackage /> },
  { to: "/wishlist", label: "Wishlist", icon: <FiHeart /> },
  { to: "/cart", label: "Cart", icon: <FiShoppingCart /> },
  { to: "/dashboard/profile", label: "Profile", icon: <FiUser /> },
];

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="card p-3 h-fit md:sticky md:top-20">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "bg-primary-500 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              <FiLogOut /> Logout
            </button>
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
