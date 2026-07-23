export interface Vehicle {
  _id?: string;
  id?: string;
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  description?: string;
  specs?: {
    horsepower?: number;
    acceleration?: string; // e.g. "2.9s 0-60"
    transmission?: string; // e.g. "8-Speed PDK"
    fuelType?: string; // e.g. "Gasoline", "Electric", "Hybrid"
    topSpeed?: string; // e.g. "191 mph"
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'customer';
}

export interface AuthResponse {
  token: string;
  user?: User;
  message?: string;
}

export interface FilterState {
  search: string;
  make: string;
  category: string;
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'make-asc';
  inStockOnly: boolean;
}

export interface ActivityLog {
  id: string;
  type: 'purchase' | 'restock' | 'add' | 'edit' | 'delete';
  vehicleTitle: string;
  timestamp: string;
  user: string;
  amount?: number;
  quantity?: number;
}
