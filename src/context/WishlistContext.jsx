import { createContext, useContext, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist({ products: [] });
      return;
    }
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => wishlist.products?.some((p) => p._id === productId);

  const toggleWishlist = async (productId) => {
    try {
      if (isInWishlist(productId)) {
        const { data } = await api.delete(`/wishlist/${productId}`);
        setWishlist(data);
        toast.success("Removed from wishlist");
      } else {
        const { data } = await api.post("/wishlist", { productId });
        setWishlist(data);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
