import axios from 'axios';
import { Vehicle } from '../types';

// API Base URL - relative '/api' or environment override
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apex_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 & errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('apex_token');
      localStorage.removeItem('token');
      localStorage.removeItem('apex_user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Services object encapsulating all required REST endpoints
export const vehicleService = {
  // GET /api/vehicles
  async getAll(): Promise<Vehicle[]> {
    const res = await apiClient.get('/vehicles');
    if (Array.isArray(res.data)) {
      return res.data;
    }
    if (res.data && Array.isArray(res.data.vehicles)) {
      return res.data.vehicles;
    }
    return [];
  },

  // GET /api/vehicles/search
  async search(params: Record<string, string | number>): Promise<Vehicle[]> {
    const res = await apiClient.get('/vehicles/search', { params });
    if (Array.isArray(res.data)) {
      return res.data;
    }
    if (res.data && Array.isArray(res.data.vehicles)) {
      return res.data.vehicles;
    }
    return [];
  },

  // POST /api/vehicles
  async create(vehicle: Omit<Vehicle, '_id' | 'id'>): Promise<Vehicle> {
    const res = await apiClient.post('/vehicles', vehicle);
    return res.data.vehicle || res.data;
  },

  // PUT /api/vehicles/:id
  async update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const res = await apiClient.put(`/vehicles/${id}`, vehicle);
    return res.data.vehicle || res.data;
  },

  // DELETE /api/vehicles/:id
  async delete(id: string): Promise<{ success: boolean }> {
    await apiClient.delete(`/vehicles/${id}`);
    return { success: true };
  },

  // POST /api/vehicles/:id/purchase
  async purchase(id: string): Promise<Vehicle> {
    const res = await apiClient.post(`/vehicles/${id}/purchase`);
    return res.data.vehicle || res.data;
  },

  // POST /api/vehicles/:id/restock
  async restock(id: string, quantityToAdd: number = 1): Promise<Vehicle> {
    const res = await apiClient.post(`/vehicles/${id}/restock`, { quantity: quantityToAdd });
    return res.data.vehicle || res.data;
  }
};

export const authService = {
  // POST /api/auth/login
  async login(credentials: { email?: string; username?: string; password?: string }) {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  // POST /api/auth/register
  async register(data: { username: string; email: string; password?: string; role?: string }) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  }
};
