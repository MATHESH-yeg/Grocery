import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats', {
          headers: { 'x-auth-token': token },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) loadStats();
  }, [token]);

  if (loading) {
    return (
      <div className="container-responsive py-10">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-purple-800">Farmer's Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome back, <span className="font-medium text-primary">{user?.name}</span>. Manage
          your farm produce and shop inventory.
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-xs text-purple-600 mb-1 font-medium">Total Customers</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
          </div>
          <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-xs text-purple-600 mb-1 font-medium">Total Produce Items</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.totalProducts}</p>
          </div>
          <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-xs text-purple-600 mb-1 font-medium">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.totalOrders}</p>
          </div>
          <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-xs text-purple-600 mb-1 font-medium">Farm Revenue</p>
            <p className="text-2xl font-semibold text-gray-800">₹{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-purple-800">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="block bg-white border border-purple-100 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-purple-900">Manage Produce</h3>
                <p className="text-xs text-gray-500">
                  Add, edit, and remove harvest items and manage stock levels.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="block bg-white border border-purple-100 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">🚜</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-purple-900">Farm Orders</h3>
                <p className="text-xs text-gray-500">
                  View incoming orders and update delivery statuses.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="block bg-white border border-purple-100 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-purple-900">Customer List</h3>
                <p className="text-xs text-gray-500">
                  View all registered customers and manage accounts.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-sm mb-4 text-purple-800">Recent Orders</h3>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex justify-between items-center text-xs border-b border-purple-50 pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{order.user?.name || 'Unknown'}</p>
                      <p className="text-gray-500">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] ${order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.orderStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No recent orders</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-sm mb-4 text-purple-800">Low Stock Harvest</h3>
            <div className="space-y-3">
              {stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex justify-between items-center text-xs border-b border-purple-50 pb-2 last:border-0"
                  >
                    <p className="font-medium truncate text-gray-800">{product.name}</p>
                    <span className="text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">{product.stock} left</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">All harvest well stocked</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
