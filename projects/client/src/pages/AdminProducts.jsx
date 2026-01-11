import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  stock: ''
};

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);

  const headers = { 'x-auth-token': token };

  const load = async () => {
    setLoading(true);
    const res = await axios.get('/api/products');
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      imageUrl: p.imageUrl,
      stock: p.stock
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };
    if (editing) {
      await axios.put(`/api/products/${editing}`, payload, { headers });
    } else {
      await axios.post('/api/products', payload, { headers });
    }
    await load();
    setEditing(null);
    setForm(emptyProduct);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`/api/products/${id}`, { headers });
    await load();
  };

  return (
    <div className="grid md:grid-cols-[2fr,1fr] gap-6">
      <div>
        <h1 className="text-xl font-semibold mb-3 text-purple-800">Farm Produce</h1>
        {loading ? (
          <p className="text-sm text-gray-500">Loading produce...</p>
        ) : (
          <div className="space-y-2">
            {products.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-3 bg-white border border-purple-50 rounded-xl p-3 shadow-md hover:shadow-lg hover:border-purple-200 transition-all"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold text-gray-800">{p.name}</span>
                    <span className="text-primary font-semibold">
                      ₹{p.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {p.description}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {p.category} · Harvest Stock: {p.stock}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-gray-500">No produce added yet.</p>
            )}
          </div>
        )}
      </div>
      <aside className="bg-white border border-purple-100 rounded-xl p-4 space-y-3 h-fit shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm text-purple-800">
            {editing ? 'Edit Produce' : 'Add New Harvest'}
          </h2>
          <button onClick={startCreate} className="text-xs text-primary hover:underline">
            New
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2 text-xs">
          {['name', 'description', 'category', 'imageUrl'].map((field) => (
            <div key={field} className="space-y-1">
              <label className="block capitalize text-gray-700">{field}</label>
              <input
                required
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-gray-700">Price (₹)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-700">Stock Qty</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-1 inline-flex justify-center px-4 py-2 rounded-full bg-primary text-white text-sm hover:bg-primaryDark transition-colors"
          >
            {editing ? 'Save Changes' : 'Add to Shop'}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default AdminProducts;









