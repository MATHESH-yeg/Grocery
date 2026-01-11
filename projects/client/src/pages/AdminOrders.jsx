import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const orderStatuses = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = { 'x-auth-token': token };

  const load = async () => {
    setLoading(true);
    const res = await axios.get('/api/orders', { headers });
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}/status`, { orderStatus: status }, { headers });
    await load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3 text-purple-800">Farm Orders</h1>
      {loading ? (
        <p className="text-sm text-gray-500">Loading orders...</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white border border-purple-50 rounded-xl p-3 text-xs space-y-1 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">#{o._id.slice(-6)}</span>
                <span className="text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </span>
              </div>
              <p>
                Customer:{' '}
                <span className="font-medium">
                  {o.user?.name} ({o.user?.email})
                </span>
              </p>
              <p>
                Amount:{' '}
                <span className="font-semibold text-primary">
                  ₹{o.totalAmount?.toFixed(2)}
                </span>
              </p>
              <p>
                Status:{' '}
                <span className="font-medium text-gray-800">{o.orderStatus}</span>
              </p>
              <p className="text-[11px] text-gray-600">
                Address: {o.address.street}, {o.address.city}, {o.address.state}{' '}
                {o.address.zipCode}, {o.address.country}
              </p>
              <div className="flex justify-between items-center pt-2">
                <div className="flex flex-wrap gap-1">
                  {o.items.map((i) => (
                    <span
                      key={i.product._id}
                      className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px]"
                    >
                      {i.product.name} × {i.quantity}
                    </span>
                  ))}
                </div>
                <select
                  value={o.orderStatus}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border border-gray-300 rounded-full px-2 py-1 text-[11px]"
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-gray-500">No orders yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;









