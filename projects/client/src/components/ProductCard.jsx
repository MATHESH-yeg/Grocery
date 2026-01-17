import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { token } = useAuth();

  const handleAdd = () => {
    if (!token) {
      alert("Please login to add items to cart.");
      return;
    }
    addToCart(product._id, 1);
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(124, 58, 237, 0.1)" }}
      className="bg-white rounded-2xl overflow-hidden border border-purple-50 shadow-sm flex flex-col transition-all duration-300"
    >
      <Link to={`/product/${product._id}`} className="block overflow-hidden">
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm line-clamp-2">
            {product.name}
          </h3>

          <span className="text-primary font-bold text-sm">
            ₹{Number(product.price).toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex justify-between items-center pt-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              product.stock > 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>

          <button
            disabled={product.stock === 0}
            onClick={handleAdd}
            className="text-xs px-3 py-1 rounded-full bg-primary text-white hover:bg-primaryDark disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
