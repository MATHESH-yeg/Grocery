import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';

const CheckoutPage = () => {
  const { items, subtotal, clearLocal } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const discount = subtotal > 999 ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryCharge - discount;

  useEffect(() => {
    const load = async () => {
      const res = await axios.get('/api/users/me', {
        headers: { 'x-auth-token': token }
      });
      setAddresses(res.data.addresses || []);
      if (user) {
        setForm(prev => ({
          ...prev,
          email: user.email,
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ')[1] || ''
        }));
      }
    };
    load();
  }, [token, user]);

  const handlePayment = async () => {
    if (!items.length) return;

    const address = addresses.find((a) => a._id === selectedId) || {
      street: form.street,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country
    };

    if (!address.street || !address.city || !address.zipCode) {
      alert('Please provide a valid delivery address.');
      return;
    }

    setLoading(true);
    try {
      // Direct Order Creation for Manual Payment
      const res = await axios.post(
        '/api/orders',
        {
          address,
          paymentStatus: 'paid', // Assuming user pays before clicking
          paymentReference: 'UPI_MANUAL',
          deliveryInstructions: note,
        },
        { headers: { 'x-auth-token': token } }
      );

      clearLocal();
      navigate(`/orders/confirmation?id=${res.data._id}`, { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || err.message || 'Failed to place order.';
      alert(`Order Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container-responsive py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <p className="text-gray-500 text-sm mt-1">Complete your order details</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        {/* Left Column: Billing Details */}
        <div className="space-y-8">
          {/* Saved Addresses */}
          {addresses.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Saved Addresses</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`flex gap-3 items-start border rounded-xl p-4 cursor-pointer transition-all ${selectedId === a._id
                      ? 'border-primary bg-purple-50 ring-1 ring-primary'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={a._id}
                      checked={selectedId === a._id}
                      onChange={(e) => setSelectedId(e.target.value)}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">Home</p>
                      <p className="text-gray-600 mt-1">
                        {a.street}, {a.city}<br />
                        {a.state} {a.zipCode}<br />
                        {a.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Billing Form */}
          <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${selectedId ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-lg font-bold text-gray-800 mb-6">Billing Details</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Street Address</label>
                <input
                  type="text"
                  placeholder="House number and street name"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Town / City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Postcode / ZIP</label>
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-medium text-gray-600">Order Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Your Order</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm font-semibold text-gray-600 border-b border-gray-100 pb-2">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product?._id} className="flex justify-between items-start text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} <strong className="text-gray-800">× {item.quantity}</strong>
                    </span>
                    <span className="font-medium text-gray-800">
                      ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-800">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">
                  {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3 mt-2">
                <span className="text-gray-800">Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <input type="radio" checked readOnly className="text-primary focus:ring-primary" />
                  <span className="font-semibold text-gray-800">Scan & Pay (GPay/UPI)</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">Scan QR Code to Pay</p>
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                    <QRCodeCanvas
                      value={`upi://pay?pa=matheshwaranmathesh432@oksbi&pn=MatheshWaran%20A.S.&am=${total.toFixed(2)}&cu=INR`}
                      size={180}
                      level={"H"}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Use any UPI app (GPay, PhonePe, Paytm) to scan and pay <span className="font-bold text-gray-800">₹{total.toFixed(2)}</span>
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  By placing the order, you confirm that you have completed the payment transaction.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-100 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'I Have Paid - Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
