import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const WishlistPage = () => {
    const { user, token } = useAuth();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                // Since we updated getMe to populate wishlist, we can use user.wishlist
                // But to be safe and get fresh data, we'll fetch me again or just use user if available
                // For now, let's fetch me to ensure we have the latest populated data
                const res = await axios.get('/api/users/me', {
                    headers: { 'x-auth-token': token }
                });
                setWishlist(res.data.wishlist || []);
            } catch (err) {
                console.error('Failed to load wishlist', err);
            } finally {
                setLoading(false);
            }
        };
        if (token) loadWishlist();
    }, [token]);

    const handleRemove = async (productId) => {
        // TODO: Implement remove from wishlist API
        // For now, just filter locally
        setWishlist(prev => prev.filter(p => p._id !== productId));
        alert('Removed from wishlist (Frontend only for now)');
    };

    const handleAddToCart = (product) => {
        addToCart(product._id, 1);
    };

    if (loading) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500">Loading wishlist...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">My List</h1>
                <p className="text-sm text-gray-500 mt-1">There are {wishlist.length} products in your My List</p>
            </div>

            <div className="space-y-4">
                {wishlist.length > 0 ? (
                    wishlist.map((product) => (
                        <div
                            key={product._id}
                            className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 border border-gray-100 flex-shrink-0">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">FreshFarm</p>
                                <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xs">★</span>
                                    ))}
                                    <span className="text-xs text-gray-400">(4.5)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-red-500 text-sm">₹{product.price.toFixed(2)}</span>
                                    <span className="text-xs text-gray-400 line-through">₹{(product.price * 1.2).toFixed(2)}</span>
                                    <span className="text-[10px] font-bold text-green-600">14% OFF</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-full hover:bg-primaryDark transition-colors"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => handleRemove(product._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Your wishlist is empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
