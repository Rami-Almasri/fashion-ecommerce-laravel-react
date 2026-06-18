import axios from 'axios';
import { getProducts, getProductBySlug, CATEGORIES } from '../data/products';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 6000,
});

// Attach Sanctum token if present.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('pm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The Laravel API wraps payloads in { data, message, success }. Normalise that,
// and fall back to the bundled catalog whenever the backend is unreachable so the
// storefront always renders beautifully.
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const api = {
  async listProducts() {
    try {
      const res = await http.get('/product');
      const data = unwrap(res);
      if (Array.isArray(data) && data.length) return { data, source: 'api' };
    } catch (_) {
      /* fall through to local catalog */
    }
    return { data: getProducts(), source: 'local' };
  },

  async getProduct(slug) {
    try {
      const res = await http.get(`/product/${slug}`);
      const data = unwrap(res);
      if (data && data.id) return { data, source: 'api' };
    } catch (_) {
      /* fall through */
    }
    return { data: getProductBySlug(slug), source: 'local' };
  },

  async listCategories() {
    try {
      const res = await http.get('/category');
      const data = unwrap(res);
      if (Array.isArray(data) && data.length) return { data, source: 'api' };
    } catch (_) {
      /* fall through */
    }
    return { data: CATEGORIES, source: 'local' };
  },

  async login(credentials) {
    const res = await http.post('/auth/login', credentials);
    return unwrap(res);
  },

  async signup(payload) {
    const res = await http.post('/auth/signup', payload);
    return unwrap(res);
  },

  async logout() {
    try {
      await http.post('/auth/logout');
    } catch (_) {
      /* ignore */
    }
  },

  // ----- branches & analytics -----
  async listBranches() {
    try {
      const res = await http.get('/branch');
      const data = unwrap(res);
      if (Array.isArray(data)) return { data, source: 'api' };
    } catch (_) {
      /* ignore */
    }
    return { data: [], source: 'none' };
  },

  async getDashboard() {
    // Requires an admin/manager token. Throws on 401/403 so the UI can react.
    const res = await http.get('/analytics/dashboard');
    return unwrap(res);
  },

  // ----- orders -----
  async createOrder(payload) {
    const res = await http.post('/orders', payload);
    return unwrap(res);
  },

  async myOrders() {
    try {
      const res = await http.get('/orders');
      return unwrap(res) || [];
    } catch (_) {
      return [];
    }
  },
};

export default api;
