import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/products', {
          params: { category: decodeURIComponent(category) }
        });
        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  return (
    <div className="container-responsive">
      <h1 className="text-xl font-semibold mb-4">
        {decodeURIComponent(category)}{' '}
        <span className="text-gray-500 text-sm font-normal">(category)</span>
      </h1>
      {loading ? (
        <p className="text-sm text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {products.length === 0 && (
            <p className="text-sm text-gray-500">No products in this category yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;









