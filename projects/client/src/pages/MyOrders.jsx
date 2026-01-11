import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  placed: 'bg-gray-100 text-gray-700',
  packed: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/me', {
          headers: { 'x-auth-token': token },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="py-10">
        <p className="text-sm text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm text-gray-600">Track all your previous purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-6 text-center text-sm text-gray-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-semibold">{order._id}</p>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.orderStatus]}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.product?._id || item.product} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product?.name || 'Product'} × {item.quantity}
                    </span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3 text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Status</span>
                <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.paymentReference && (
                <div className="text-xs text-gray-500">
                  Payment reference: <span className="font-semibold">{order.paymentReference}</span>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Deliver to: {order.address.street}, {order.address.city}, {order.address.state}{' '}
                {order.address.zipCode}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;




