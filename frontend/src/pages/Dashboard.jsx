import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import client from '../api/client';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    make: '', model: '', category: '', minPrice: '', maxPrice: ''
  });

  // Admin Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    make: '', model: '', category: '', price: '', quantity: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      fetchVehicles();
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const fetchVehicles = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(currentFilters).forEach(([k, v]) => {
        if (v) queryParams.append(k, v);
      });
      const res = await client.get(`/vehicles/search?${queryParams.toString()}`);
      setVehicles(res.data.vehicles);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handlePurchase = async (id) => {
    try {
      await client.post(`/vehicles/${id}/purchase`);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error purchasing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await client.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert('Error deleting vehicle');
    }
  };

  const handleRestock = async (id) => {
    const qty = window.prompt('Enter quantity to restock:');
    if (!qty || isNaN(qty) || Number(qty) <= 0) return;
    try {
      await client.post(`/vehicles/${id}/restock`, { quantity: Number(qty) });
      fetchVehicles();
    } catch (err) {
      alert('Error restocking vehicle');
    }
  };

  const openModal = (vehicle = null) => {
    if (vehicle) {
      setEditingId(vehicle._id);
      setFormData({
        make: vehicle.make, model: vehicle.model, 
        category: vehicle.category, price: vehicle.price, 
        quantity: vehicle.quantity
      });
    } else {
      setEditingId(null);
      setFormData({ make: '', model: '', category: '', price: '', quantity: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await client.put(`/vehicles/${editingId}`, formData);
      } else {
        await client.post('/vehicles', formData);
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving vehicle');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Carventory Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            {user?.email} ({user?.role})
          </span>
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

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input placeholder="Make" className="border p-2 rounded" value={filters.make} onChange={e => setFilters({...filters, make: e.target.value})} />
            <input placeholder="Model" className="border p-2 rounded" value={filters.model} onChange={e => setFilters({...filters, model: e.target.value})} />
            <input placeholder="Category" className="border p-2 rounded" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} />
            <input type="number" placeholder="Min Price" className="border p-2 rounded" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
            <input type="number" placeholder="Max Price" className="border p-2 rounded" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Search</button>
          </form>
        </div>

        {/* Vehicle List */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">No vehicles found.</p>
            ) : (
              vehicles.map(vehicle => (
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
                        <button onClick={() => openModal(vehicle)} className="bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300">Edit</button>
                        <button onClick={() => handleRestock(vehicle._id)} className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded hover:bg-yellow-200">Restock</button>
                        <button onClick={() => handleDelete(vehicle._id)} className="bg-red-100 text-red-800 px-3 py-2 rounded hover:bg-red-200">Delete</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Admin Modal */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Make" className="w-full border p-2 rounded" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
              <input required placeholder="Model" className="w-full border p-2 rounded" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
              <input required placeholder="Category" className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <input required type="number" placeholder="Price" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input required type="number" placeholder="Quantity" className="w-full border p-2 rounded" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
