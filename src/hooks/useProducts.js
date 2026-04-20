import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        if (isMounted) {
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, categories, loading, error };
}
