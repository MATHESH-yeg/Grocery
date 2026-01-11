import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = ['Vegetables', 'Fruits', 'Beverages', 'Snacks', 'Dairy'];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-20">
      <div className="container-responsive flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="text-3xl">🍇</span>
            <span>Fresh<span className="text-secondary">Farm</span></span>
          </Link>
          <div className="hidden md:flex gap-3">
            {categories.map((c) => (
              <NavLink
                key={c}
                to={`/category/${encodeURIComponent(c)}`}
                className={({ isActive }) =>
                  `text-sm px-3 py-1 rounded-full ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {c}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="relative inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <span className="material-icons mr-1 text-gray-700">shopping_cart</span>
            <span className="text-sm font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs">
                {cartCount}
              </span>
            )}
          </button>
          {user ? (
            <>
              <button
                onClick={() => navigate('/orders')}
                className="text-sm px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                Orders
              </button>
              <span className="hidden sm:inline text-sm text-gray-700">
                Hi, {user.name?.split(' ')[0] || 'User'}
              </span>
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-white"
                >
                  My Farm
                </button>
              )}
              <button
                onClick={logout}
                className="text-sm px-3 py-1 rounded-full bg-primary text-white hover:bg-primaryDark"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="hidden sm:inline text-sm px-3 py-1 rounded-full bg-primary text-white hover:bg-primaryDark"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






