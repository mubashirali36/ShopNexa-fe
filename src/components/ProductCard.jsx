import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="card group overflow-hidden fade-in flex flex-col">
      <Link to={`/products/${product._id}`} className="relative block overflow-hidden">
        <img
          src={product.image?.url}
          alt={product.name}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors duration-200 ${
            inWishlist ? "bg-primary-500 text-white" : "bg-white text-gray-500 hover:text-primary-500"
          }`}
        >
          <FiHeart className={inWishlist ? "fill-current" : ""} />
        </button>
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <span className="text-xs text-primary-600 font-medium">{product.category?.name}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 line-clamp-2 mt-1 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product._id, 1)}
            disabled={product.stock === 0}
            className="btn-primary p-2.5 rounded-full disabled:cursor-not-allowed"
            title="Add to cart"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
