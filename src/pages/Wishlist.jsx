import { Link } from "react-router-dom";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const products = wishlist.products || [];

  if (products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center fade-in">
        <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love for later.</p>
        <Link to="/products" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product._id} className="card p-4 flex gap-4 items-center">
            <img src={product.image?.url} alt={product.name} className="w-20 h-20 object-cover rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <Link to={`/products/${product._id}`} className="font-medium hover:text-primary-600 line-clamp-1">
                {product.name}
              </Link>
              <p className="text-primary-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => addToCart(product._id, 1)} className="btn-primary p-2 rounded-full" title="Move to cart">
                <FiShoppingCart size={16} />
              </button>
              <button onClick={() => toggleWishlist(product._id)} className="p-2 rounded-full border text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
