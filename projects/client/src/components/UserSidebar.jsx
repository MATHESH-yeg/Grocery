import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        { to: '/profile', icon: '👤', label: 'My Profile' },
        { to: '/address', icon: '📍', label: 'Address' },
        { to: '/wishlist', icon: '❤️', label: 'My List' },
        { to: '/orders', icon: '🛍️', label: 'My Orders' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
            {/* User Profile Summary */}
            <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-gray-100">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-3xl mb-3 border-2 border-purple-100">
                    👤
                </div>
                <h3 className="font-bold text-gray-800 uppercase tracking-wide">{user?.name || 'User Name'}</h3>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-purple-50 text-primary border-l-4 border-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <span className="text-lg">{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}

                <button
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all mt-2"
                >
                    <span className="text-lg">🚪</span>
                    Logout
                </button>
            </nav>
        </div>
    );
};

export default UserSidebar;
