import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { FullPageLoader } from "../components/Loading";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHeart, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
    setQty(1);
  }, [id]);

  if (loading) return <FullPageLoader />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  const stockMessage =
    product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In Stock";
  const stockColor = product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-orange-600" : "text-green-600";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      <div className="flex items-center text-sm text-gray-500 gap-1 mb-4">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <FiChevronRight size={14} />
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        <FiChevronRight size={14} />
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-4">
          <img src={product.image?.url} alt={product.name} className="w-full h-80 md:h-96 object-cover rounded-lg" />
        </div>

        <div>
          <span className="text-sm text-primary-600 font-medium">{product.category?.name}</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 mb-3">{product.name}</h1>
          <p className="text-3xl font-extrabold text-primary-600 mb-3">${product.price.toFixed(2)}</p>
          <p className={`text-sm font-medium mb-4 ${stockColor}`}>{stockMessage}</p>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                className="px-3 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => addToCart(product._id, qty)}
              disabled={product.stock === 0}
              className="btn-primary flex-1"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`p-3 rounded-lg border transition-colors ${
                isInWishlist(product._id) ? "bg-primary-500 text-white border-primary-500" : "border-gray-300 text-gray-600 hover:border-primary-400"
              }`}
            >
              <FiHeart className={isInWishlist(product._id) ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
