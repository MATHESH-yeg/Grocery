import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddressPage = () => {
    const { token, user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    const [loading, setLoading] = useState(false);

    const loadAddresses = async () => {
        try {
            const res = await axios.get('/api/users/me', {
                headers: { 'x-auth-token': token }
            });
            setAddresses(res.data.addresses || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) loadAddresses();
    }, [token]);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('/api/users/me/addresses', formData, {
                headers: { 'x-auth-token': token }
            });
            await loadAddresses();
            setShowForm(false);
            setFormData({ street: '', city: '', state: '', zipCode: '', country: 'India' });
        } catch (err) {
            alert('Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await axios.delete(`/api/users/me/addresses/${id}`, {
                headers: { 'x-auth-token': token }
            });
            await loadAddresses();
        } catch (err) {
            alert('Failed to delete address');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Address</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage Your Addresses</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm font-medium text-primary border border-primary px-4 py-2 rounded-md hover:bg-purple-50 transition-colors"
                >
                    {showForm ? 'Cancel' : 'Add Address'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in">
                    <h3 className="font-semibold text-gray-800 mb-4">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Street Address</label>
                            <input
                                required
                                type="text"
                                placeholder="House No, Street Name"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">City</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">State</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Zip Code</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-600">Country</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-100 disabled:bg-gray-300"
                        >
                            {loading ? 'Saving...' : 'Save Address'}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {addresses.map((addr) => (
                    <div key={addr._id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative group hover:border-primary transition-colors">
                        <div className="absolute top-4 right-4">
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </button>
                            {/* Dropdown menu could go here, for now just a delete button appearing on hover or click */}
                            <div className="hidden group-hover:block absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10">
                                <button
                                    onClick={() => handleDelete(addr._id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <span className="inline-block bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase mb-3">
                            Home
                        </span>

                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-800 text-sm uppercase">{user?.name}</h3>
                            <span className="text-gray-600 text-sm font-medium">{user?.mobile}</span>
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed">
                            {addr.street} {addr.city} {addr.state} {addr.country} {addr.zipCode}
                        </p>
                    </div>
                ))}
                {addresses.length === 0 && !showForm && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm mb-4">No addresses saved yet.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-primary font-medium hover:underline text-sm"
                        >
                            Add your first address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressPage;
