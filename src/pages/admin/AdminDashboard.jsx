import { useEffect, useState } from "react";
import { FiUsers, FiBox, FiPackage, FiDollarSign, FiUserCheck, FiShield } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "../../api/axios";
import { FullPageLoader } from "../../components/Loading";

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageLoader />;
  if (!stats) return <p className="text-gray-500">Could not load dashboard stats.</p>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FiUsers /> },
    { label: "Customers", value: stats.totalCustomers, icon: <FiUserCheck /> },
    { label: "Admins", value: stats.totalAdmins, icon: <FiShield /> },
    { label: "Total Products", value: stats.totalProducts, icon: <FiBox /> },
    { label: "Total Orders", value: stats.totalOrders, icon: <FiPackage /> },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: <FiDollarSign /> },
  ];

  const userChartData = [
    { name: "Customers", value: stats.totalCustomers },
    { name: "Admins", value: stats.totalAdmins },
  ];

  const overviewData = [
    { name: "Users", count: stats.totalUsers },
    { name: "Products", count: stats.totalProducts },
    { name: "Orders", count: stats.totalOrders },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="card p-5 flex items-center gap-4">
            <div className="bg-primary-50 text-primary-600 p-3 rounded-full text-xl shrink-0">{card.icon}</div>
            <div className="min-w-0">
              <p className="text-xl font-bold truncate">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Platform Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={overviewData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">User Roles</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={userChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                {userChartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="flex justify-between items-center text-sm border-b last:border-0 pb-2">
                <div>
                  <p className="font-medium">{order.user?.name || "Unknown"}</p>
                  <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {stats.recentUsers.length === 0 && <p className="text-sm text-gray-500">No users yet.</p>}
            {stats.recentUsers.map((u) => (
              <div key={u._id} className="flex justify-between items-center text-sm border-b last:border-0 pb-2">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-gray-400 text-xs">{u.email}</p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
