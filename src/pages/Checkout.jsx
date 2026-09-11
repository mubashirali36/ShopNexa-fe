import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

const Checkout = () => {
  const { user, login } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loggingIn, setLoggingIn] = useState(false);
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "Cash on Delivery",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setValue("fullName", user.name);
      setValue("phone", user.phone || "");
    }
  }, [user, setValue]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success("Logged in — continue checkout below");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const onPlaceOrder = async (data) => {
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setPlacing(true);
    try {
      const { data: order } = await api.post("/orders", data);
      toast.success("Order placed successfully!");
      await fetchCart();
      navigate("/dashboard/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!user && (
            <div className="card p-5 border-2 border-primary-200">
              <h2 className="font-semibold mb-1">Login to Continue</h2>
              <p className="text-sm text-gray-500 mb-4">
                Please login so we can associate this order with your account. Your cart will be preserved.
              </p>
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="input-field"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="input-field"
                />
                <button type="submit" disabled={loggingIn} className="btn-primary w-full">
                  {loggingIn ? "Logging in..." : "Login"}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-3">
                Don't have an account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
              </p>
            </div>
          )}

          <div className={`card p-5 transition-opacity ${!user ? "opacity-50 pointer-events-none" : ""}`}>
            <h2 className="font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit(onPlaceOrder)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("fullName", { required: "Full name is required" })}
                    disabled={!user}
                    placeholder="Full Name"
                    className="input-field"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <input
                    {...register("email", { required: "Email is required" })}
                    disabled={!user}
                    placeholder="Email"
                    className="input-field"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <input
                  {...register("phone", { required: "Phone number is required" })}
                  disabled={!user}
                  placeholder="Phone Number"
                  className="input-field"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <input
                  {...register("shippingAddress", { required: "Shipping address is required" })}
                  disabled={!user}
                  placeholder="Shipping Address"
                  className="input-field"
                />
                {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("city", { required: "City is required" })}
                    disabled={!user}
                    placeholder="City"
                    className="input-field"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <input
                    {...register("postalCode", { required: "Postal code is required" })}
                    disabled={!user}
                    placeholder="Postal Code"
                    className="input-field"
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="pt-2 border-t space-y-3">
                <label className="font-semibold block text-sm text-gray-800">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Cash on Delivery", "JazzCash", "EasyPaisa", "Bank Account"].map((method) => (
                    <label
                      key={method}
                      className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer text-sm font-medium transition-all ${
                        selectedPaymentMethod === method ? "border-primary-500 bg-primary-50/40 text-primary-700" : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        value={method}
                        {...register("paymentMethod", { required: "Payment method is required" })}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      {method}
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>}

                {/* Conditional Account Number Input for Digital Payments */}
                {selectedPaymentMethod !== "Cash on Delivery" && (
                  <div className="mt-3 animate-fade-in">
                    <input
                      {...register("paymentDetails", {
                        required: `Please enter your ${selectedPaymentMethod} account or phone number`,
                      })}
                      disabled={!user}
                      placeholder={`Enter your ${selectedPaymentMethod} Number / Account Details`}
                      className="input-field"
                    />
                    {errors.paymentDetails && <p className="text-red-500 text-xs mt-1">{errors.paymentDetails.message}</p>}
                  </div>
                )}
              </div>

              <textarea
                {...register("orderNotes")}
                disabled={!user}
                placeholder="Order Notes (optional)"
                rows={3}
                className="input-field"
              />

              <button type="submit" disabled={!user || placing || items.length === 0} className="btn-primary w-full">
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        <div className="card p-5 h-fit sticky top-20">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 items-center text-sm">
                  <img src={item.product?.image?.url} className="w-12 h-12 object-cover rounded-md shrink-0" alt={item.product?.name} />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1">{item.product?.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium shrink-0">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;