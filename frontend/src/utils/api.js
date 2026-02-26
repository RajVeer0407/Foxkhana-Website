import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fk_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fk_token');
      localStorage.removeItem('fk_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =================== AUTH ===================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// =================== PRODUCTS ===================
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  // Admin
  adminGetAll: () => api.get('/admin/products'),
  create: (data) => api.post('/admin/products', data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`)
};

// =================== ORDERS ===================
export const orderAPI = {
  createPayment: (data) => api.post('/orders/create-payment', data),
  verifyPayment: (data) => api.post('/orders/verify-payment', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/admin/orders', { params }),
  adminUpdate: (id, data) => api.put(`/admin/orders/${id}`, data)
};

// =================== BULK ORDERS ===================
export const bulkOrderAPI = {
  create: (data) => api.post('/bulk-orders', data),
  adminGetAll: (params) => api.get('/admin/bulk-orders', { params }),
  adminUpdate: (id, data) => api.put(`/admin/bulk-orders/${id}`, data)
};

// =================== COUPONS ===================
export const couponAPI = {
  validate: (data) => api.post('/coupons/validate', data),
  adminCreate: (data) => api.post('/admin/coupons', data),
  adminGetAll: () => api.get('/admin/coupons'),
  adminUpdate: (id, data) => api.put(`/admin/coupons/${id}`, data)
};

export default api;
