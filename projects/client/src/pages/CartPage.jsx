import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, subtotal, updateItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const discount = subtotal > 999 ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryCharge - discount;

  if (!items.length) {
    return (
      <div className="container-responsive text-center py-20 space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🛒</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Your cart is empty</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Browse our fresh produce and start shopping!
        </p>
        <Link
          to="/"
          className="inline-flex px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primaryDark transition-colors shadow-lg shadow-green-100"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        <p className="text-gray-500 text-sm mt-1">There are {items.length} products in your cart</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,350px] gap-8">
        {/* Cart Items List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          {items.map((item, index) => (
            <div
              key={item.product?._id || index}
              className={`p-6 flex gap-6 items-start relative ${index !== items.length - 1 ? 'border-b border-gray-100' : ''
                }`}
            >
              {/* Remove Button (Top Right) */}
              <button
                onClick={() => item.product && removeFromCart(item.product._id)}
                className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100">
                <img
                  src={item.product?.imageUrl || 'placeholder.jpg'}
                  alt={item.product?.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 pt-1">
                <p className="text-xs text-gray-500 mb-1">FreshFarm</p>
                <h3 className="font-semibold text-gray-800 text-lg mb-2 pr-8">
                  {item.product?.name || 'Unavailable Product'}
                </h3>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">(4.5)</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                    <span className="text-xs font-medium text-gray-500 px-2 border-r border-gray-200 mr-2">Qty: {item.quantity}</span>
                    <button
                      onClick={() => item.product && updateItem(item.product._id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-primary transition-colors text-sm"
                      disabled={!item.product}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-500">
                      ₹{(item.product?.price || 0).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{((item.product?.price || 0) * 1.2).toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                      20% OFF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Cart Totals</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-red-500">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">
                  {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                <span className="text-gray-600">Estimate for</span>
                <span className="font-medium text-gray-800">India</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-red-500">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-8 bg-secondary text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
            >
              Proceed to Checkout
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default CartPage;
