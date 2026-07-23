import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';
import { Vehicle } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { VehicleFilter } from '../components/vehicle/VehicleFilter';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { VehicleDetailModal } from '../components/vehicle/VehicleDetailModal';
import { AddEditVehicleModal } from '../components/vehicle/AddEditVehicleModal';
import { RestockModal } from '../components/vehicle/RestockModal';
import { DeleteConfirmModal } from '../components/vehicle/DeleteConfirmModal';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { VehicleCardSkeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { 
  Car, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal,
  PackageCheck,
  SearchX,
  Zap,
  ShoppingBag
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { filteredVehicles, loading, viewMode, resetFilters, actionLoading } = useVehicles();

  const safeFilteredVehicles = Array.isArray(filteredVehicles) ? filteredVehicles : [];

  // Modal States
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [vehicleToRestock, setVehicleToRestock] = useState<Vehicle | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  // Handlers
  const handleOpenDetail = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setVehicleToEdit(null);
    setAddEditModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setAddEditModalOpen(true);
  };

  const handleOpenRestockModal = (vehicle: Vehicle) => {
    setVehicleToRestock(vehicle);
    setRestockModalOpen(true);
  };

  const handleOpenDeleteModal = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f2f2f2] flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Top Navbar */}
      <Navbar onOpenAddModal={handleOpenAddModal} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] bg-white/10 text-white/80 px-2.5 py-0.5 rounded-full border border-white/10 font-mono tracking-widest uppercase">
                EXECUTIVE SUITE
              </span>
              {isAdmin && (
                <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-mono flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> ADMIN
                </span>
              )}
            </div>

            <h1 className="text-3xl font-light tracking-tight text-white">
              Available Vehicles
            </h1>
            <p className="text-sm opacity-40 mt-1">
              Premium fleet real-time management & inventory
            </p>
          </div>

          {/* Quick Action */}
          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Vehicle
            </button>
          )}
        </div>

        {/* Key Metrics Overview */}
        <StatsOverview />

        {/* Search & Filter Bar */}
        <VehicleFilter />

        {/* Main Inventory Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Vehicle List Grid (3 cols desktop) */}
          <div className="lg:col-span-3">
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <VehicleCardSkeleton key={n} />
                ))}
              </div>
            ) : safeFilteredVehicles.length === 0 ? (
              /* Empty State */
              <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center my-6">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-4">
                  <SearchX className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-xl font-light text-white mb-1">
                  No Vehicles Match Criteria
                </h3>
                <p className="text-xs text-white/40 max-w-sm mb-6 font-mono">
                  Try adjusting search keywords or clearing active filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-white text-black font-bold text-xs rounded-full hover:bg-zinc-200 transition-all shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeFilteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id || vehicle.id || Math.random().toString()}
                    vehicle={vehicle}
                    onSelect={handleOpenDetail}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                    onRestock={handleOpenRestockModal}
                  />
                ))}
              </div>
            ) : (
              /* Table / List Layout */
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/60 text-white/40 font-mono uppercase text-[10px] tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Vehicle</th>
                        <th className="p-4">Year & Tier</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {safeFilteredVehicles.map((v) => (
                        <tr
                          key={v._id || v.id}
                          onClick={() => handleOpenDetail(v)}
                          className="hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.imageUrl || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'}
                                alt={v.model}
                                className="w-12 h-9 object-cover rounded-xl border border-white/10 shrink-0"
                              />
                              <div>
                                <span className="font-medium text-white block text-sm">
                                  {v.make} {v.model}
                                </span>
                                <span className="text-[10px] text-white/40 font-mono">
                                  {v.specs?.horsepower ? `${v.specs.horsepower} HP` : 'High Spec'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 font-mono">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-white font-medium">{v.year}</span>
                              <span className="text-white/40 text-[11px]">{v.category}</span>
                            </div>
                          </td>

                          <td className="p-4 font-mono text-white text-sm font-light">
                            ${v.price?.toLocaleString()}
                          </td>

                          <td className="p-4">
                            {v.quantity <= 0 ? (
                              <span className="px-2.5 py-0.5 bg-white/10 text-white/40 border border-white/20 text-[10px] font-bold uppercase rounded-full">
                                Out of Stock
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase rounded-full">
                                {v.quantity} Units
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetail(v);
                              }}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-medium transition-colors"
                            >
                              View Specs
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Recent Activity */}
          <div className="flex flex-col gap-6">
            <RecentActivity />
          </div>

        </div>

      </main>

      {/* Modals */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onRestock={handleOpenRestockModal}
      />

      <AddEditVehicleModal
        vehicle={vehicleToEdit}
        isOpen={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
      />

      <RestockModal
        vehicle={vehicleToRestock}
        isOpen={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
      />

      <DeleteConfirmModal
        vehicle={vehicleToDelete}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
};
