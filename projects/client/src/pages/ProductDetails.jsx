import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [productRes, relatedRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get('/api/products')
        ]);
        setProduct(productRes.data);
        // Filter out current product and take 4 random ones
        const related = relatedRes.data
          .filter(p => p._id !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = () => {
    if (!token) {
      alert('Please login to add items to cart.');
      return;
    }
    addToCart(product._id, qty);
  };

  const handleQtyChange = (val) => {
    if (val >= 1 && val <= product.stock) {
      setQty(val);
    }
  };

  if (loading) {
    return (
      <div className="container-responsive py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-responsive py-20 text-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8 space-y-16">
      {/* Top Section: Image & Details */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[400px] object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-1 border border-gray-100 cursor-pointer hover:border-primary transition-colors">
                <img
                  src={product.imageUrl}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-20 object-contain opacity-80 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium mb-3">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span>(0 reviews)</span>
              <span>•</span>
              <span className="text-primary font-medium">Brand: FreshFarm</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
            <span className="text-lg text-gray-400 line-through mb-1">
              ₹{(product.price * 1.2).toFixed(2)}
            </span>
            <span className="text-sm text-green-600 font-medium mb-2 ml-2">
              20% OFF
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <div className="pt-6 border-t border-gray-100 space-y-6">
            {product.stock > 0 && (
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-200 rounded-full">
                  <button
                    onClick={() => handleQtyChange(qty - 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    readOnly
                    className="w-12 text-center text-gray-800 font-medium focus:outline-none"
                  />
                  <button
                    onClick={() => handleQtyChange(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Only <span className="text-orange-500 font-medium">{product.stock} items</span> left!
                </span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                disabled={product.stock === 0}
                onClick={handleAdd}
                className="flex-1 bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-100 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Add to Cart
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Tabs */}
      <div>
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-semibold capitalize transition-colors relative ${activeTab === tab
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-800'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {activeTab === 'description' ? (
            <div className="prose max-w-none text-gray-600">
              <p>
                {product.description}
              </p>
              <p className="mt-4">
                Experience the freshness of farm-to-table produce with our premium selection.
                Sourced directly from local farmers, our products are guaranteed to be fresh,
                organic, and full of natural flavor. Whether you're cooking a family meal or
                looking for a healthy snack, {product.name} is the perfect choice for you.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>100% Organic and Natural</li>
                <li>Sourced from local certified farmers</li>
                <li>Rich in vitamins and minerals</li>
                <li>Freshly harvested and delivered</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Customer Reviews (0)</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                No reviews yet. Be the first to review this product!
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h4 className="font-semibold text-gray-800 mb-4">Add a Review</h4>
                <div className="space-y-4 max-w-2xl">
                  <div className="flex gap-1 text-gray-300 text-2xl mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="cursor-pointer hover:text-yellow-400">★</span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Write your review here..."
                    className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  ></textarea>
                  <button className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primaryDark transition-colors">
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Related Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {relatedProducts.length === 0 && (
            <p className="text-gray-500 col-span-4 text-center py-8">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
