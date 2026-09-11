import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (!loading && items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center fade-in">
        <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="card p-4 flex gap-4 items-center">
              <img
                src={item.product?.image?.url}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product?._id}`} className="font-medium hover:text-primary-600 line-clamp-1">
                  {item.product?.name}
                </Link>
                <p className="text-primary-600 font-semibold mt-1">${item.product?.price?.toFixed(2)}</p>
              </div>
              <div className="flex items-center border rounded-lg shrink-0">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40"
                >
                  −
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= (item.product?.stock || 0)}
                  className="px-3 py-1.5 hover:bg-gray-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5 h-fit sticky top-20">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-gray-500">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg mb-4">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary w-full">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
