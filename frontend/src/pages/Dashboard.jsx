import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import client from '../api/client';

// ─── Toast notification component (replaces window.alert) ───────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colours = type === 'error'
    ? 'bg-red-100 text-red-800 border-red-300'
    : 'bg-green-100 text-green-800 border-green-300';

  return (
    <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded border shadow-md text-sm font-medium ${colours}`}>
      {message}
      <button onClick={onClose} className="ml-4 opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

// ─── Restock modal (replaces window.prompt) ──────────────────────────────────
function RestockModal({ onConfirm, onCancel }) {
  const [qty, setQty] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-bold mb-4">Restock Vehicle</h3>
        <input
          type="number"
          min="1"
          placeholder="Enter quantity"
          value={qty}
          onChange={e => setQty(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button
            onClick={() => onConfirm(Number(qty))}
            disabled={!qty || isNaN(qty) || Number(qty) <= 0}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            Restock
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirmation modal (replaces window.confirm) ─────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
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

  // Admin vehicle form modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ make: '', model: '', category: '', price: '', quantity: '' });
  const [formLoading, setFormLoading] = useState(false); // Issue 14

  // Restock modal state (Issue 13)
  const [restockTarget, setRestockTarget] = useState(null);

  // Delete confirmation modal state (Issue 13)
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast notification state (Issue 13)
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

  const handleRestockConfirmed = async (qty) => {
    try {
      await client.post(`/vehicles/${restockTarget}/restock`, { quantity: qty });
      showToast(`Restocked ${qty} units successfully!`);
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
    <div className="min-h-screen bg-gray-50">
      {/* Toast (Issue 13) */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Restock modal (Issue 13) */}
      {restockTarget && (
        <RestockModal onConfirm={handleRestockConfirmed} onCancel={() => setRestockTarget(null)} />
      )}

      {/* Delete confirmation modal (Issue 13) */}
      {deleteTarget && (
        <ConfirmModal
          message="Are you sure you want to delete this vehicle? This action cannot be undone."
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Carventory Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">{user?.email} ({user?.role})</span>
          <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">Vehicle Inventory</h2>
          {isAdmin && (
            <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 font-medium">
              + Add Vehicle
            </button>
          )}
        </div>

        {/* Search Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input placeholder="Make"     className="border p-2 rounded" value={filters.make}     onChange={e => setFilters({...filters, make: e.target.value})} />
            <input placeholder="Model"    className="border p-2 rounded" value={filters.model}    onChange={e => setFilters({...filters, model: e.target.value})} />
            <input placeholder="Category" className="border p-2 rounded" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} />
            <input type="number" placeholder="Min Price" className="border p-2 rounded" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
            <input type="number" placeholder="Max Price" className="border p-2 rounded" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Search</button>
          </form>
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">No vehicles found.</p>
            ) : vehicles.map(vehicle => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h3>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{vehicle.category}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-4">${vehicle.price.toLocaleString()}</p>
                  <p className={`text-sm font-medium ${vehicle.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {vehicle.quantity > 0 ? `${vehicle.quantity} in stock` : 'Out of stock'}
                  </p>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePurchase(vehicle._id)}
                    disabled={vehicle.quantity === 0}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Purchase
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => openModal(vehicle)}          className="bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300">Edit</button>
                      <button onClick={() => setRestockTarget(vehicle._id)} className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded hover:bg-yellow-200">Restock</button>
                      <button onClick={() => setDeleteTarget(vehicle._id)}  className="bg-red-100 text-red-800 px-3 py-2 rounded hover:bg-red-200">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Admin Add/Edit Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Make"     className="w-full border p-2 rounded" value={formData.make}     onChange={e => setFormData({...formData, make: e.target.value})} />
              <input required placeholder="Model"    className="w-full border p-2 rounded" value={formData.model}    onChange={e => setFormData({...formData, model: e.target.value})} />
              <input required placeholder="Category" className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <input required type="number" placeholder="Price"    className="w-full border p-2 rounded" value={formData.price}    onChange={e => setFormData({...formData, price: e.target.value})} />
              <input required type="number" placeholder="Quantity" className="w-full border p-2 rounded" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {formLoading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
