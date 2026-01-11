import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users', {
          headers: { 'x-auth-token': token },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load users:', err);
        alert('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { 'x-auth-token': token } }
      );
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      alert('User role updated successfully');
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { 'x-auth-token': token },
      });
      setUsers(users.filter((u) => u._id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.msg || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="container-responsive py-10">
        <p className="text-sm text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-purple-800">Customer Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all registered customers and their roles.</p>
      </div>

      <div className="bg-white border border-purple-100 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-purple-50 border-b border-purple-100">
              <tr>
                <th className="text-left p-3 font-semibold text-xs text-purple-900">Name</th>
                <th className="text-left p-3 font-semibold text-xs text-purple-900">Email</th>
                <th className="text-left p-3 font-semibold text-xs text-purple-900">Mobile</th>
                <th className="text-left p-3 font-semibold text-xs text-purple-900">Role</th>
                <th className="text-left p-3 font-semibold text-xs text-purple-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3 text-gray-600">{user.mobile}</td>
                  <td className="p-3">
                    {user._id === currentUser?._id ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {user.role === 'admin' ? 'Farmer/Owner' : user.role} (You)
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      >
                        <option value="user">Customer</option>
                        <option value="admin">Farmer/Owner</option>
                      </select>
                    )}
                  </td>
                  <td className="p-3">
                    {user._id !== currentUser?._id && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;






