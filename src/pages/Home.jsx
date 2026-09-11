import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Loading";
import { FiTruck, FiShield, FiRefreshCw, FiArrowRight } from "react-icons/fi";

const Home = () => {
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [latestRes, featuredRes, catRes] = await Promise.all([
          api.get("/products?limit=8&sort=newest"),
          api.get("/products?limit=8"),
          api.get("/categories"),
        ]);
        setLatest(latestRes.data.products);
        setFeatured(featuredRes.data.products);
        setCategories(catRes.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="fade-in bg-gray-100 min-h-screen pb-12">
      <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Shop Back to Store
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mt-2 mb-3">
              School & Tech Essentials at Every Price
            </h1>
            <p className="text-primary-100 text-sm md:text-base mb-6">
              Explore top-rated gadgets, gear, and daily essentials handpicked just for you.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-lg hover:bg-primary-50 transition-all shadow-md">
              Explore Collection <FiArrowRight />
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80" alt="Headphones" className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-white/20" />
            <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&q=80" alt="Scooter" className="w-28 h-28 object-cover rounded-xl shadow-lg border-2 border-white/20" />
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80" alt="Watch" className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-white/20" />
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-25 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-3">Get your game on</h3>
              <div className="bg-gray-50 rounded-lg p-3 h-48 flex items-center justify-center overflow-hidden mb-4 border border-gray-100">
                <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80" alt="Gaming" className="w-full h-full object-cover rounded-md" />
              </div>
            </div>
            <Link to="/products?category=gaming" className="text-primary-600 text-sm font-semibold hover:underline">See more</Link>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-3">Must-haves for every student</h3>
              <div className="bg-gray-50 rounded-lg p-3 h-48 flex items-center justify-center overflow-hidden mb-4 border border-gray-100">
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80" alt="Student Essentials" className="w-full h-full object-cover rounded-md" />
              </div>
            </div>
            <Link to="/products" className="text-primary-600 text-sm font-semibold hover:underline">Shop school supplies</Link>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-3">New arrivals under $50</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center">
                  <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80" alt="Item 1" className="w-full h-20 object-cover rounded-md border" />
                  <span className="text-[11px] text-gray-600 mt-1 block">Kitchen & Dining</span>
                </div>
                <div className="text-center">
                  <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=150&q=80" alt="Item 2" className="w-full h-20 object-cover rounded-md border" />
                  <span className="text-[11px] text-gray-600 mt-1 block">Home Decor</span>
                </div>
              </div>
            </div>
            <Link to="/products" className="text-primary-600 text-sm font-semibold hover:underline">Shop the latest</Link>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-3">Electronics & Gadgets</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center">
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80" alt="Backpacks" className="w-full h-20 object-cover rounded-md border" />
                  <span className="text-[11px] text-gray-600 mt-1 block">Headphones</span>
                </div>
                <div className="text-center">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80" alt="Electronics" className="w-full h-20 object-cover rounded-md border" />
                  <span className="text-[11px] text-gray-600 mt-1 block">Smart Watches</span>
                </div>
              </div>
            </div>
            <Link to="/products" className="text-primary-600 text-sm font-semibold hover:underline">Discover more</Link>
          </div>

        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <FiTruck size={22} />, title: "Fast Delivery", desc: "Quick and reliable shipping" },
          { icon: <FiShield size={22} />, title: "Secure Payments", desc: "Your data is always protected" },
          { icon: <FiRefreshCw size={22} />, title: "Easy Returns", desc: "Hassle-free return policy" },
        ].map((item) => (
          <div key={item.title} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="text-primary-500">{item.icon}</div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Shop by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="shrink-0 px-5 py-2.5 rounded-full bg-white border border-gray-200 hover:border-primary-400 hover:text-primary-600 transition-colors text-sm font-medium shadow-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : featured.length === 0 ? (
          <p className="text-gray-500 text-sm">No products yet — check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.link || featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Latest Arrivals</h2>
          <Link to="/products" className="text-primary-600 text-sm font-medium hover:underline">View all</Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : latest.length === 0 ? (
          <p className="text-gray-500 text-sm">No products yet — check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {latest.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

Home.jsx
export default Home;