import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import Hero3D from "../components/Hero3D";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = [
    { name: "Vegetables", icon: "🥦", path: "/category/Vegetables" },
    { name: "Fruits", icon: "🍎", path: "/category/Fruits" },
    { name: "Beverages", icon: "🥤", path: "/category/Beverages" },
    { name: "Snacks", icon: "🍪", path: "/category/Snacks" },
    { name: "Dairy", icon: "🥛", path: "/category/Dairy" },
  ];

  return (
    <div className="container-responsive space-y-12">

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-[#f9f7f2] rounded-3xl overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-16">

          <div className="space-y-6 relative z-10">
            <span className="inline-block px-3 py-1 rounded bg-[#dcfce7] text-[#166534] text-xs font-bold uppercase tracking-wider">
              Weekend Discount
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-[#1f2937] leading-tight">
              Get the best quality products at the lowest prices
            </h1>

            <p className="text-gray-600 text-lg max-w-md">
              We have prepared special discounts for you on organic breakfast products.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <Link
                to="/products"
                className="bg-[#10b981] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-[#059669] transition-colors shadow-lg shadow-green-200 flex items-center gap-2"
              >
                Shop Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* 3D Area */}
          <div className="relative h-[400px] w-full">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Top Categories</h2>
            <p className="text-sm text-gray-500 mt-1">
              New products with updated stocks.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-500 hover:text-primary flex items-center gap-1"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className="group flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:border-primary hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center group-hover:text-primary">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Fresh from the Harvest
        </h2>

        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading fresh produce...</p>
          </div>
        )}

        {!loading && error && (
          <p className="text-red-500 text-center py-10">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}

            {products.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-10">
                No products found.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
