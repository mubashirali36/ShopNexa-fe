import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import api from "../../api/axios";
import { FullPageLoader } from "../../components/Loading";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageLoader />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <FiPackage size={40} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Your placed orders will show up here.</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-xs">{order._id}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              {order.products.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                  <span className="flex-1 line-clamp-1">{item.name}</span>
                  <span className="text-gray-500">x{item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</span>
              <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
