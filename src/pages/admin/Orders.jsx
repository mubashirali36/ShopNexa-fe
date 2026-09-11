import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { FullPageLoader } from "../../components/Loading";

const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      toast.success("Order status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders ({orders.length})</h1>

      <div className="space-y-4">
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
              <div>
                <p className="text-sm font-medium">{order.user?.name}</p>
                <p className="text-xs text-gray-500">{order.user?.email}</p>
                <p className="text-xs text-gray-400 font-mono mt-1">{order._id}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 ${statusColors[order.status]}`}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              className="text-sm text-primary-600 hover:underline mb-2"
            >
              {expanded === order._id ? "Hide details" : "View details"}
            </button>

            {expanded === order._id && (
              <div className="border-t pt-3 space-y-3 fade-in">
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <p><span className="font-medium">Phone:</span> {order.phone}</p>
                  <p><span className="font-medium">City:</span> {order.city}</p>
                  <p className="sm:col-span-2"><span className="font-medium">Address:</span> {order.shippingAddress}, {order.postalCode}</p>
                  {order.orderNotes && <p className="sm:col-span-2"><span className="font-medium">Notes:</span> {order.orderNotes}</p>}
                </div>
                <div className="space-y-2">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                      <span className="flex-1 line-clamp-1">{item.name}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between text-sm border-t pt-3 mt-2">
              <span className="text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</span>
              <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
