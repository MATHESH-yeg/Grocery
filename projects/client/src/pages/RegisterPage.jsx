import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThreeBackground from '../components/ThreeBackground';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (role === 'admin' && !form.email.endsWith('@admin.com')) {
      setError('Admin accounts must use an @admin.com email address');
      setLoading(false);
      return;
    }

    try {
      const user = await register({ ...form, role });
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Registration failed. Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden py-10">
      <ThreeBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 mx-4"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 transform transition-transform hover:scale-[1.01] duration-300"></div>

        <div className="relative z-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-primary rounded-2xl mx-auto mb-4 shadow-lg flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-3xl">🌱</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Join Our Farm</h1>
            <p className="text-gray-500 mt-2">Create an account to start {role === 'admin' ? 'managing' : 'shopping'} fresh</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Toggle */}
            <div className="flex bg-gray-100/50 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'user'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'admin'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Admin
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="relative w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="relative w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder={role === 'admin' ? "name@admin.com" : "user@gmail.com"}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Mobile Number</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <input
                  type="tel"
                  required
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="relative w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="relative w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-primary rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"></div>
              <div className="relative bg-white/0 rounded-xl px-4 py-3.5 transition-all group-hover:bg-white/10">
                <span className="relative text-white font-bold tracking-wide flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Get Started'
                  )}
                </span>
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primaryDark transition-colors relative inline-block group">
                Sign In
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
