import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPage = () => {
    const { category: categoryParam } = useParams();
    const [searchParams] = useSearchParams();
    const searchCategory = searchParams.get('category');

    // Resolve which category to filter by
    const activeCategory = categoryParam || searchCategory || 'All';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const categories = [
        { name: 'All', icon: '🛍️' },
        { name: 'Vegetables', icon: '🥗' },
        { name: 'Fruits', icon: '🍎' },
        { name: 'Beverages', icon: '🥤' },
        { name: 'Snacks', icon: '🍪' },
        { name: 'Dairy', icon: '🥛' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (activeCategory !== 'All') {
                    params.category = activeCategory;
                }
                const res = await axios.get('/api/products', { params });
                setProducts(res.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategory]);

    return (
        <div className="container-responsive py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side Navigation Bar */}
                <aside className="w-full lg:w-64 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-50">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                            Categories
                        </h2>
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.name}
                                    to={cat.name === 'All' ? '/products' : `/category/${cat.name}`}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeCategory === cat.name
                                            ? 'bg-primary text-white shadow-md shadow-purple-100'
                                            : 'text-gray-600 hover:bg-purple-50 hover:text-primary'
                                        }`}
                                >
                                    <span className={`text-xl group-hover:scale-110 transition-transform ${activeCategory === cat.name ? 'scale-110' : ''}`}>
                                        {cat.icon}
                                    </span>
                                    <span className="font-medium text-sm">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Promo Card in Sidebar */}
                    <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-2xl text-white shadow-lg overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 transform -rotate-12 group-hover:scale-110 transition-transform">🌿</div>
                        <h3 className="font-bold text-lg mb-2 relative z-10">Fresh & Organic</h3>
                        <p className="text-xs text-white/80 mb-4 relative z-10">Get up to 30% off on all organic vegetables this week.</p>
                        <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-colors relative z-10">
                            Claim Offer
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-50 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {activeCategory === 'All' ? 'All Products' : activeCategory}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {loading ? 'Checking stocks...' : `Showing ${products.length} items`}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Sort functionality could go here */}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-8">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-2xl"></div>
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                                {products.length === 0 && (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="text-6xl mb-4">🍃</div>
                                        <h3 className="text-lg font-bold text-gray-800">No products found</h3>
                                        <p className="text-gray-500">We couldn't find any products in this category.</p>
                                        <Link to="/products" className="mt-4 inline-block text-primary font-bold hover:underline">
                                            View all products
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
