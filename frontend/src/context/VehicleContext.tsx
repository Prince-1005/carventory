import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Vehicle, FilterState, ActivityLog } from '../types';
import { vehicleService } from '../services/api';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface VehicleContextType {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  loading: boolean;
  actionLoading: boolean;
  filters: FilterState;
  activities: ActivityLog[];
  viewMode: 'grid' | 'list';
  categories: string[];
  makes: string[];
  setViewMode: (mode: 'grid' | 'list') => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  refreshVehicles: () => Promise<void>;
  purchaseVehicle: (vehicle: Vehicle) => Promise<boolean>;
  restockVehicle: (vehicle: Vehicle, quantity: number) => Promise<boolean>;
  addVehicle: (data: Omit<Vehicle, '_id' | 'id'>) => Promise<boolean>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<boolean>;
  deleteVehicle: (vehicle: Vehicle) => Promise<boolean>;
}

const initialFilters: FilterState = {
  search: '',
  make: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  sortBy: 'year-desc',
  inStockOnly: false,
};

const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act_1',
    type: 'purchase',
    vehicleTitle: 'Porsche 911 GT3 RS',
    timestamp: '10 minutes ago',
    user: 'VIP Client (Geneva)',
    amount: 241300,
  },
  {
    id: 'act_2',
    type: 'restock',
    vehicleTitle: 'Tesla Model S Plaid',
    timestamp: '1 hour ago',
    user: 'Inventory Manager',
    quantity: 5,
  },
  {
    id: 'act_3',
    type: 'purchase',
    vehicleTitle: 'Mercedes-Benz AMG GT 63 S',
    timestamp: '3 hours ago',
    user: 'Executive Client',
    amount: 194900,
  },
];

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);

  const { showToast } = useToast();
  const { user } = useAuth();

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAll();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      showToast('Failed to load inventory: ' + (err.message || 'Error'), 'error');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

  // Derived categories & makes
  const categories = Array.from(new Set(safeVehicles.map((v) => v.category))).filter(Boolean);
  const makes = Array.from(new Set(safeVehicles.map((v) => v.make))).filter(Boolean);

  // Instant local filtering & sorting
  useEffect(() => {
    let result = Array.isArray(vehicles) ? [...vehicles] : [];

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (v) =>
          (v.make && v.make.toLowerCase().includes(query)) ||
          (v.model && v.model.toLowerCase().includes(query)) ||
          (v.category && v.category.toLowerCase().includes(query)) ||
          (v.year && v.year.toString().includes(query))
      );
    }

    if (filters.make) {
      result = result.filter((v) => v.make && v.make.toLowerCase() === filters.make.toLowerCase());
    }

    if (filters.category) {
      result = result.filter((v) => v.category && v.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.minPrice !== '') {
      result = result.filter((v) => v.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice !== '') {
      result = result.filter((v) => v.price <= Number(filters.maxPrice));
    }

    if (filters.inStockOnly) {
      result = result.filter((v) => v.quantity > 0);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'year-asc':
          return (a.year || 0) - (b.year || 0);
        case 'year-desc':
          return (b.year || 0) - (a.year || 0);
        case 'make-asc':
          return (a.make || '').localeCompare(b.make || '');
        default:
          return 0;
      }
    });

    setFilteredVehicles(result);
  }, [vehicles, filters]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const addActivity = (
    type: 'purchase' | 'restock' | 'add' | 'edit' | 'delete',
    vehicleTitle: string,
    amount?: number,
    quantity?: number
  ) => {
    const newLog: ActivityLog = {
      id: 'act_' + Date.now(),
      type,
      vehicleTitle,
      timestamp: 'Just now',
      user: user?.username || 'Dealership User',
      amount,
      quantity,
    };
    setActivities((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  // Purchase vehicle action
  const purchaseVehicle = async (vehicle: Vehicle): Promise<boolean> => {
    const id = vehicle._id || vehicle.id;
    if (!id) return false;

    if (vehicle.quantity <= 0) {
      showToast(`${vehicle.make} ${vehicle.model} is currently out of stock!`, 'error');
      return false;
    }

    setActionLoading(true);
    try {
      const updated = await vehicleService.purchase(id);
      setVehicles((prev) =>
        prev.map((v) => ((v._id === id || v.id === id) ? updated : v))
      );
      showToast(`Successfully purchased ${vehicle.year} ${vehicle.make} ${vehicle.model}!`, 'success');
      addActivity('purchase', `${vehicle.make} ${vehicle.model}`, vehicle.price);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Purchase transaction failed.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Restock vehicle action
  const restockVehicle = async (vehicle: Vehicle, quantityToAdd: number): Promise<boolean> => {
    const id = vehicle._id || vehicle.id;
    if (!id) return false;

    setActionLoading(true);
    try {
      const updated = await vehicleService.restock(id, quantityToAdd);
      setVehicles((prev) =>
        prev.map((v) => ((v._id === id || v.id === id) ? updated : v))
      );
      showToast(`Restocked +${quantityToAdd} units of ${vehicle.make} ${vehicle.model}`, 'success');
      addActivity('restock', `${vehicle.make} ${vehicle.model}`, undefined, quantityToAdd);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Restock operation failed.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Add vehicle action
  const addVehicle = async (data: Omit<Vehicle, '_id' | 'id'>): Promise<boolean> => {
    setActionLoading(true);
    try {
      const created = await vehicleService.create(data);
      setVehicles((prev) => [created, ...prev]);
      showToast(`Added ${created.year} ${created.make} ${created.model} to inventory!`, 'success');
      addActivity('add', `${created.make} ${created.model}`, created.price, created.quantity);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to add vehicle.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Update vehicle action
  const updateVehicle = async (id: string, data: Partial<Vehicle>): Promise<boolean> => {
    setActionLoading(true);
    try {
      const updated = await vehicleService.update(id, data);
      setVehicles((prev) =>
        prev.map((v) => ((v._id === id || v.id === id) ? updated : v))
      );
      showToast(`Updated ${updated.make} ${updated.model} specifications`, 'success');
      addActivity('edit', `${updated.make} ${updated.model}`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update vehicle.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Delete vehicle action
  const deleteVehicle = async (vehicle: Vehicle): Promise<boolean> => {
    const id = vehicle._id || vehicle.id;
    if (!id) return false;

    setActionLoading(true);
    try {
      await vehicleService.delete(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id && v.id !== id));
      showToast(`Removed ${vehicle.make} ${vehicle.model} from inventory.`, 'info');
      addActivity('delete', `${vehicle.make} ${vehicle.model}`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to delete vehicle.', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        filteredVehicles,
        loading,
        actionLoading,
        filters,
        activities,
        viewMode,
        categories,
        makes,
        setViewMode,
        setFilters,
        resetFilters,
        refreshVehicles: fetchVehicles,
        purchaseVehicle,
        restockVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within VehicleProvider');
  }
  return context;
};
