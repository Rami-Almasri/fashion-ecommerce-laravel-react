import { useEffect, useState } from 'react';
import api from '../lib/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);

  useEffect(() => {
    let alive = true;
    api.listProducts().then(({ data, source }) => {
      if (!alive) return;
      setProducts(data);
      setSource(source);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { products, loading, source };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.getProduct(slug).then(({ data }) => {
      if (!alive) return;
      setProduct(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  return { product, loading };
}
