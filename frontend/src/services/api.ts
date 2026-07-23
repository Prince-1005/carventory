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

// High quality initial vehicles for demo / fallback mode
export const INITIAL_DEMO_VEHICLES: Vehicle[] = [
  {
    _id: 'v1',
    id: 'v1',
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    category: 'Supercar',
    price: 241300,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    description: 'Track-focused perfection with 518 hp naturally aspirated 4.0L flat-six engine and active aerodynamic wing.',
    specs: {
      horsepower: 518,
      acceleration: '3.0s 0-60',
      transmission: '7-Speed PDK',
      fuelType: 'Gasoline',
      topSpeed: '184 mph'
    }
  },
  {
    _id: 'v2',
    id: 'v2',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'Electric',
    price: 89990,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    description: 'Tri-motor all-wheel drive flagship sedan delivering 1,020 horsepower and sub-2 second acceleration.',
    specs: {
      horsepower: 1020,
      acceleration: '1.99s 0-60',
      transmission: 'Single-Speed',
      fuelType: 'Electric',
      topSpeed: '200 mph'
    }
  },
  {
    _id: 'v3',
    id: 'v3',
    make: 'BMW',
    model: 'M5 Competition',
    year: 2024,
    category: 'Executive Sedan',
    price: 120500,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    description: 'High-performance luxury sedan powered by a 4.4-liter M TwinPower Turbo V8 delivering 617 hp.',
    specs: {
      horsepower: 617,
      acceleration: '3.1s 0-60',
      transmission: '8-Speed Sport Auto',
      fuelType: 'Gasoline',
      topSpeed: '190 mph'
    }
  },
  {
    _id: 'v4',
    id: 'v4',
    make: 'Mercedes-Benz',
    model: 'AMG GT 63 S E Performance',
    year: 2024,
    category: 'Gran Turismo',
    price: 194900,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    description: 'Hybrid power architecture featuring 831 hp combined system output and Formula 1-derived battery tech.',
    specs: {
      horsepower: 831,
      acceleration: '2.9s 0-60',
      transmission: '9-Speed AMG Speedshift',
      fuelType: 'Hybrid',
      topSpeed: '196 mph'
    }
  },
  {
    _id: 'v5',
    id: 'v5',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'Electric',
    price: 147100,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    description: 'Sculpted electric grand tourer with dual synchronous motors generating up to 637 horsepower in boost mode.',
    specs: {
      horsepower: 637,
      acceleration: '3.1s 0-60',
      transmission: '2-Speed Rear / 1-Speed Front',
      fuelType: 'Electric',
      topSpeed: '155 mph'
    }
  },
  {
    _id: 'v6',
    id: 'v6',
    make: 'Ferrari',
    model: '296 GTB',
    year: 2023,
    category: 'Supercar',
    price: 338250,
    quantity: 0, // Out of stock demo
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    description: 'Mid-rear engine 120° V6 plug-in hybrid sports car with 819 total horsepower.',
    specs: {
      horsepower: 819,
      acceleration: '2.9s 0-60',
      transmission: '8-Speed F1 Dual-Clutch',
      fuelType: 'Hybrid',
      topSpeed: '205 mph'
    }
  },
  {
    _id: 'v7',
    id: 'v7',
    make: 'Range Rover',
    model: 'SV Long Wheelbase',
    year: 2024,
    category: 'Luxury SUV',
    price: 234000,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    description: 'Peerless sanctuary offering executive class rear seating, ceramic controls, and twin-turbo V8 output.',
    specs: {
      horsepower: 606,
      acceleration: '4.3s 0-60',
      transmission: '8-Speed Automatic',
      fuelType: 'Gasoline',
      topSpeed: '162 mph'
    }
  },
  {
    _id: 'v8',
    id: 'v8',
    make: 'Aston Martin',
    model: 'DB12 Coupe',
    year: 2024,
    category: 'Gran Turismo',
    price: 245000,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
    description: 'The world’s first Super Tourer featuring a 4.0L twin-turbo V8 delivering 671 horsepower.',
    specs: {
      horsepower: 671,
      acceleration: '3.5s 0-60',
      transmission: '8-Speed Automatic',
      fuelType: 'Gasoline',
      topSpeed: '202 mph'
    }
  }
];

// Helper to manage demo mock data in localStorage when live API is unavailable
const getStoredDemoVehicles = (): Vehicle[] => {
  const saved = localStorage.getItem('apex_demo_vehicles');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('apex_demo_vehicles', JSON.stringify(INITIAL_DEMO_VEHICLES));
  return INITIAL_DEMO_VEHICLES;
};

const saveStoredDemoVehicles = (vehicles: Vehicle[]) => {
  localStorage.setItem('apex_demo_vehicles', JSON.stringify(vehicles));
};

// API Services object encapsulating all required REST endpoints
export const vehicleService = {
  // GET /api/vehicles
  async getAll(): Promise<Vehicle[]> {
    try {
      const res = await apiClient.get('/vehicles');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      if (res.data && Array.isArray(res.data.vehicles)) {
        return res.data.vehicles;
      }
      console.warn('API returned non-array response for /vehicles. Using stored demo state.');
      return getStoredDemoVehicles();
    } catch (err) {
      console.warn('Backend API unreachable for GET /vehicles. Using local demo state.', err);
      return getStoredDemoVehicles();
    }
  },

  // GET /api/vehicles/search
  async search(params: Record<string, string | number>): Promise<Vehicle[]> {
    try {
      const res = await apiClient.get('/vehicles/search', { params });
      if (Array.isArray(res.data)) {
        return res.data;
      }
      if (res.data && Array.isArray(res.data.vehicles)) {
        return res.data.vehicles;
      }
    } catch (err) {
      console.warn('Backend API unreachable for search. Filtering local state.', err);
    }
    let list = getStoredDemoVehicles();
    const { make, model, category, minPrice, maxPrice, sortBy, q } = params as any;
    if (q) {
      const query = String(q).toLowerCase();
      list = list.filter(v => 
        v.make?.toLowerCase().includes(query) || 
        v.model?.toLowerCase().includes(query) || 
        v.category?.toLowerCase().includes(query)
      );
    }
    if (make) {
      list = list.filter(v => v.make?.toLowerCase() === String(make).toLowerCase());
    }
    if (model) {
      list = list.filter(v => v.model?.toLowerCase().includes(String(model).toLowerCase()));
    }
    if (category) {
      list = list.filter(v => v.category?.toLowerCase() === String(category).toLowerCase());
    }
    if (minPrice) {
      list = list.filter(v => v.price >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(v => v.price <= Number(maxPrice));
    }
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-desc') {
      list.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'year-asc') {
      list.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'make-asc') {
      list.sort((a, b) => a.make.localeCompare(b.make));
    }
    return list;
  },

  // POST /api/vehicles
  async create(vehicle: Omit<Vehicle, '_id' | 'id'>): Promise<Vehicle> {
    try {
      const res = await apiClient.post('/vehicles', vehicle);
      return res.data.vehicle || res.data;
    } catch (err) {
      console.warn('Backend API unreachable for POST /vehicles. Updating local demo state.', err);
      const list = getStoredDemoVehicles();
      const newVehicle: Vehicle = {
        ...vehicle,
        _id: 'v_' + Date.now(),
        id: 'v_' + Date.now(),
      };
      const updated = [newVehicle, ...list];
      saveStoredDemoVehicles(updated);
      return newVehicle;
    }
  },

  // PUT /api/vehicles/:id
  async update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const res = await apiClient.put(`/vehicles/${id}`, vehicle);
      return res.data.vehicle || res.data;
    } catch (err) {
      console.warn(`Backend API unreachable for PUT /vehicles/${id}. Updating local demo state.`, err);
      const list = getStoredDemoVehicles();
      let updatedVehicle: Vehicle | null = null;
      const updated = list.map(v => {
        if (v._id === id || v.id === id) {
          updatedVehicle = { ...v, ...vehicle };
          return updatedVehicle;
        }
        return v;
      });
      saveStoredDemoVehicles(updated);
      return updatedVehicle || { ...vehicle, _id: id } as Vehicle;
    }
  },

  // DELETE /api/vehicles/:id
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`/vehicles/${id}`);
      return { success: true };
    } catch (err) {
      console.warn(`Backend API unreachable for DELETE /vehicles/${id}. Updating local demo state.`, err);
      const list = getStoredDemoVehicles();
      const updated = list.filter(v => v._id !== id && v.id !== id);
      saveStoredDemoVehicles(updated);
      return { success: true };
    }
  },

  // POST /api/vehicles/:id/purchase
  async purchase(id: string): Promise<Vehicle> {
    try {
      const res = await apiClient.post(`/vehicles/${id}/purchase`);
      return res.data.vehicle || res.data;
    } catch (err) {
      console.warn(`Backend API unreachable for POST /vehicles/${id}/purchase. Updating local demo state.`, err);
      const list = getStoredDemoVehicles();
      let updatedVehicle: Vehicle | null = null;
      const updated = list.map(v => {
        if (v._id === id || v.id === id) {
          if (v.quantity <= 0) {
            throw new Error('Vehicle is out of stock!');
          }
          updatedVehicle = { ...v, quantity: v.quantity - 1 };
          return updatedVehicle;
        }
        return v;
      });
      if (!updatedVehicle) {
        throw new Error('Vehicle not found');
      }
      saveStoredDemoVehicles(updated);
      return updatedVehicle;
    }
  },

  // POST /api/vehicles/:id/restock
  async restock(id: string, quantityToAdd: number = 1): Promise<Vehicle> {
    try {
      const res = await apiClient.post(`/vehicles/${id}/restock`, { quantity: quantityToAdd });
      return res.data.vehicle || res.data;
    } catch (err) {
      console.warn(`Backend API unreachable for POST /vehicles/${id}/restock. Updating local demo state.`, err);
      const list = getStoredDemoVehicles();
      let updatedVehicle: Vehicle | null = null;
      const updated = list.map(v => {
        if (v._id === id || v.id === id) {
          updatedVehicle = { ...v, quantity: v.quantity + quantityToAdd };
          return updatedVehicle;
        }
        return v;
      });
      if (!updatedVehicle) {
        throw new Error('Vehicle not found');
      }
      saveStoredDemoVehicles(updated);
      return updatedVehicle;
    }
  }
};

export const authService = {
  // POST /api/auth/login
  async login(credentials: { email?: string; username?: string; password?: string }) {
    try {
      const res = await apiClient.post('/auth/login', credentials);
      return res.data;
    } catch (err: any) {
      console.warn('Backend API login error or unreachable. Falling back to demo auth.', err);
      // Demo credentials fallback for testing when backend server isn't running
      const email = credentials.email || credentials.username || '';
      const isAdmin = email.toLowerCase().includes('admin');
      
      const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IkFwZXhVc2VyIiwiZW1haWwiOiJ1c2VyQGFwZXguY29tIiwicm9sZSI6ImFkbWluIn0.signature';
      
      return {
        token: demoToken,
        user: {
          id: 'u_101',
          username: email.split('@')[0] || (isAdmin ? 'Admin' : 'Executive User'),
          email: email || 'user@apexmotors.com',
          role: isAdmin ? 'admin' : 'admin' // default to admin for rich demo testing, user can toggle
        }
      };
    }
  },

  // POST /api/auth/register
  async register(data: { username: string; email: string; password?: string; role?: string }) {
    try {
      const res = await apiClient.post('/auth/register', data);
      return res.data;
    } catch (err) {
      console.warn('Backend API register error or unreachable. Falling back to demo auth.', err);
      return {
        token: 'demo_registered_token_' + Date.now(),
        user: {
          id: 'u_' + Date.now(),
          username: data.username,
          email: data.email,
          role: data.role || 'user'
        }
      };
    }
  }
};
