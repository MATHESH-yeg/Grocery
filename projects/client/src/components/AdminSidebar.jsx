import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
        { to: '/admin/products', icon: '🌾', label: 'Produce' },
        { to: '/admin/orders', icon: '🚜', label: 'Orders' },
        { to: '/admin/users', icon: '👥', label: 'Customers' },
    ];

    return (
        <div className="w-64 bg-white border-r border-purple-100 min-h-[calc(100vh-64px)] p-4 flex flex-col gap-2 shadow-lg z-10">
            <div className="mb-6 px-2">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Farm Management</h2>
            </div>

            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                    }
                >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                </NavLink>
            ))}

            <div className="mt-auto pt-4 border-t border-gray-100">
                <button
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <span className="text-lg">🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
