import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiUsers, FiBox, FiPackage, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const links = [
  { to: "/admin", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/admin/users", label: "Users", icon: <FiUsers /> },
  { to: "/admin/products", label: "Products", icon: <FiBox /> },
  { to: "/admin/orders", label: "Orders", icon: <FiPackage /> },
];

const AdminLayout = () => {
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
          <div className="px-3 py-2 mb-2">
            <p className="font-bold text-primary-600">Admin Panel</p>
          </div>
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
            <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 whitespace-nowrap">
              <FiArrowLeft /> Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              <FiLogOut /> Logout
            </button>
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
