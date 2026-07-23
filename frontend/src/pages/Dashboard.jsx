import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, LogOut, Edit2, Trash2, 
  PackagePlus, CheckCircle2, AlertCircle, ShoppingCart, Loader2
} from 'lucide-react';
import client from '../api/client';

// ─── Toast notification component ─────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === 'error';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
        isError ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
      }`}
    >
      {isError ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">✕</button>
    </motion.div>
  );
}

// ─── Shared Modal Wrapper ───────────────────────────────────────────────────
function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ make: '', model: '', category: '', price: '', quantity: '' });
  const [formLoading, setFormLoading] = useState(false);
  
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchVehicles();
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const fetchVehicles = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(currentFilters).forEach(([k, v]) => { if (v) queryParams.append(k, v); });
      const res = await client.get(`/vehicles/search?${queryParams.toString()}`);
      setVehicles(res.data.vehicles);
    } catch (err) {
      showToast('Error fetching vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchVehicles(); };

  const handlePurchase = async (id) => {
    try {
      await client.post(`/vehicles/${id}/purchase`);
      showToast('Purchase successful!');
      fetchVehicles();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error purchasing', 'error');
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await client.delete(`/vehicles/${deleteTarget}`);
      showToast('Vehicle deleted.');
      fetchVehicles();
    } catch {
      showToast('Error deleting vehicle', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRestockConfirmed = async () => {
    try {
      await client.post(`/vehicles/${restockTarget}/restock`, { quantity: Number(restockQty) });
      showToast(`Restocked ${restockQty} units successfully!`);
      setRestockQty('');
      fetchVehicles();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error restocking', 'error');
    } finally {
      setRestockTarget(null);
    }
  };

  const openModal = (vehicle = null) => {
    if (vehicle) {
      setEditingId(vehicle._id);
      setFormData({ make: vehicle.make, model: vehicle.model, category: vehicle.category, price: vehicle.price, quantity: vehicle.quantity });
    } else {
      setEditingId(null);
      setFormData({ make: '', model: '', category: '', price: '', quantity: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      if (editingId) {
        await client.put(`/vehicles/${editingId}`, formData);
        showToast('Vehicle updated!');
      } else {
        await client.post('/vehicles', formData);
        showToast('Vehicle added!');
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving vehicle', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {/* Restock Modal */}
        {restockTarget && (
          <ModalWrapper onClose={() => setRestockTarget(null)}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <PackagePlus className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Restock Vehicle</h3>
              <p className="text-sm text-slate-400 mt-2">Enter the quantity to add to inventory.</p>
            </div>
            <input
              type="number" min="1" placeholder="Quantity"
              value={restockQty} onChange={e => setRestockQty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setRestockTarget(null)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">Cancel</button>
              <button
                onClick={handleRestockConfirmed}
                disabled={!restockQty || isNaN(restockQty) || Number(restockQty) <= 0}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors disabled:opacity-50 font-medium"
              >
                Confirm
              </button>
            </div>
          </ModalWrapper>
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <ModalWrapper onClose={() => setDeleteTarget(null)}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Delete Vehicle?</h3>
              <p className="text-sm text-slate-400 mt-2">This action cannot be undone. This vehicle will be permanently removed.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">Cancel</button>
              <button onClick={handleDeleteConfirmed} className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl transition-colors font-medium">Delete</button>
            </div>
          </ModalWrapper>
        )}

        {/* Add/Edit Modal */}
        {showModal && isAdmin && (
          <ModalWrapper onClose={() => setShowModal(false)}>
            <h3 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Make" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
                <input required placeholder="Model" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
              </div>
              <input required placeholder="Category (e.g. SUV, Sedan)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price ($)" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input required type="number" placeholder="Quantity" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors disabled:opacity-50 font-medium flex justify-center items-center">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Carventory
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-sm font-medium text-slate-300">{user?.email}</span>
                {isAdmin && <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider ml-2">Admin</span>}
              </div>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Inventory Overview</h2>
            <p className="text-slate-400">Manage and browse your vehicle collection</p>
          </div>
          {isAdmin && (
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => openModal()} 
              className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-xl shadow-white/10 hover:shadow-white/20 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Vehicle
            </motion.button>
          )}
        </div>

        {/* Search Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 mb-10 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <input placeholder="Make" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" value={filters.make} onChange={e => setFilters({...filters, make: e.target.value})} />
            <input placeholder="Model" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" value={filters.model} onChange={e => setFilters({...filters, model: e.target.value})} />
            <input placeholder="Category" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} />
            <input type="number" placeholder="Min Price" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
            <input type="number" placeholder="Max Price" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors font-medium">
              <Search className="w-4 h-4" /> Search
            </button>
          </form>
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {vehicles.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-slate-800/50 rounded-3xl border-dashed"
                >
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No vehicles found</h3>
                  <p className="text-slate-400 text-center max-w-sm">Try adjusting your search filters or add a new vehicle to the inventory.</p>
                </motion.div>
              ) : vehicles.map((vehicle, i) => (
                <motion.div 
                  key={vehicle._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col"
                >
                  <div className="p-6 flex-grow relative">
                    <div className="absolute top-6 right-6">
                      <span className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {vehicle.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white pr-20 mb-2 truncate">{vehicle.make} {vehicle.model}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-lg text-slate-500">$</span>
                      <span className="text-3xl font-extrabold text-blue-400">{vehicle.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-950/50 w-fit px-4 py-2 rounded-xl border border-slate-800/50">
                      <div className={`w-2 h-2 rounded-full ${vehicle.quantity > 0 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                      <span className={`text-sm font-semibold ${vehicle.quantity > 0 ? 'text-slate-300' : 'text-red-400'}`}>
                        {vehicle.quantity > 0 ? `${vehicle.quantity} Units Available` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-950/50 border-t border-slate-800/50 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handlePurchase(vehicle._id)}
                      disabled={vehicle.quantity === 0}
                      className="flex-1 bg-white hover:bg-slate-200 text-slate-900 px-4 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      Purchase
                    </button>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={() => openModal(vehicle)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors" title="Edit">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => setRestockTarget(vehicle._id)} className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-xl transition-colors border border-blue-500/20" title="Restock">
                          <PackagePlus className="w-5 h-5" />
                        </button>
                        <button onClick={() => setDeleteTarget(vehicle._id)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors border border-red-500/20" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
