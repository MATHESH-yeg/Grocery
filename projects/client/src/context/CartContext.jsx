import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setItems([]);
        return;
      }
      const res = await axios.get('/api/cart', {
        headers: { 'x-auth-token': token }
      });
      setItems(res.data || []);
    };
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await axios.post(
      '/api/cart',
      { productId, quantity },
      { headers: { 'x-auth-token': token } }
    );
    setItems(res.data);
  };

  const updateItem = async (productId, quantity) => {
    const res = await axios.put(
      `/api/cart/${productId}`,
      { quantity },
      { headers: { 'x-auth-token': token } }
    );
    setItems(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await axios.delete(`/api/cart/${productId}`, {
      headers: { 'x-auth-token': token }
    });
    setItems(res.data);
  };

  const clearLocal = () => setItems([]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateItem, removeFromCart, clearLocal, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);









