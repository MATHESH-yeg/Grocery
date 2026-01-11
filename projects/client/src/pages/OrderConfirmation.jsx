import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/orders/me', {
          headers: { 'x-auth-token': token },
        });
        const foundOrder = res.data.find((o) => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="container-responsive py-10">
        <p className="text-sm text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-responsive py-10 text-center space-y-4">
        <h1 className="text-xl font-semibold">Order Not Found</h1>
        <p className="text-sm text-gray-500">We couldn't find your order details.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-full bg-primary text-white text-sm hover:bg-primaryDark"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-responsive max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-semibold">Order Placed Successfully!</h1>
        <p className="text-sm text-gray-600">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-start border-b border-gray-100 pb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="text-sm font-medium">{order._id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Order Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.orderStatus === 'delivered'
                  ? 'bg-green-100 text-green-700'
                  : order.orderStatus === 'shipped'
                  ? 'bg-blue-100 text-blue-700'
                  : order.orderStatus === 'packed'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold mb-2">Order Items</h2>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
              <div className="flex-1">
                <p className="font-medium">{item.product?.name || 'Product'}</p>
                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="pt-3 border-t border-gray-100">
          <h2 className="text-sm font-semibold mb-2">Delivery Address</h2>
          <p className="text-xs text-gray-600">
            {order.address.street}, {order.address.city}, {order.address.state}{' '}
            {order.address.zipCode}, {order.address.country}
          </p>
        </div>

        {/* Order Summary */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Status</span>
            <span
              className={
                order.paymentStatus === 'paid'
                  ? 'text-green-600 font-medium'
                  : 'text-yellow-600 font-medium'
              }
            >
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
        <div className="text-[10px] text-gray-500 space-y-1 mt-2">
          {order.paymentReference && (
            <p>
              Payment reference: <strong>{order.paymentReference}</strong>
            </p>
          )}
          <p>Payment method: Manual UPI (GPay scanner)</p>
          <p>Pending payments are verified by the admin before dispatch.</p>
        </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          to="/"
          className="flex-1 text-center px-4 py-2 rounded-full bg-primary text-white text-sm hover:bg-primaryDark"
        >
          Continue Shopping
        </Link>
        <button
          onClick={() => (user?.role === 'admin' ? navigate('/admin/orders') : navigate('/orders'))}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
        >
          {user?.role === 'admin' ? 'View All Orders' : 'View My Orders'}
        </button>
      </div>

      {/* Order Timeline */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold mb-4">Order Timeline</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                ['placed', 'packed', 'shipped', 'delivered'].includes(order.orderStatus)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
            <div className="flex-1">
              <p className="text-xs font-medium">Order Placed</p>
              <p className="text-[10px] text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {order.orderStatus !== 'placed' && (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    ['packed', 'shipped', 'delivered'].includes(order.orderStatus)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-xs font-medium">Packed</p>
                </div>
              </div>
              {['shipped', 'delivered'].includes(order.orderStatus) && (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ['shipped', 'delivered'].includes(order.orderStatus)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium">Shipped</p>
                    </div>
                  </div>
                  {order.orderStatus === 'delivered' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">Delivered</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

