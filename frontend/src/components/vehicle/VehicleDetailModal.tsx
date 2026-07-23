import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Vehicle } from '../../types';
import { Badge } from '../ui/Badge';
import { useVehicles } from '../../context/VehicleContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  PackageCheck, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  RefreshCw,
  Calendar,
  Flame,
  Award
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onRestock: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onRestock,
}) => {
  const { purchaseVehicle, actionLoading } = useVehicles();
  const { isAdmin } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  if (!vehicle) return null;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Estimated monthly financing payment preview (60 months @ 6.5% APR)
  const estimatedMonthly = Math.round((vehicle.price * 0.02) + (vehicle.price / 60));

  const handlePurchase = async () => {
    if (vehicle.quantity <= 0) return;
    setPurchasing(true);
    const success = await purchaseVehicle(vehicle);
    setPurchasing(false);
    if (success) {
      onClose();
    }
  };

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex flex-col gap-6 -m-6">
        {/* Banner Photo */}
        <div className="relative h-72 w-full bg-zinc-950 overflow-hidden">
          <img
            src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="amber" size="sm" className="font-mono">
                  {vehicle.year}
                </Badge>
                <Badge variant="slate" size="sm">
                  {vehicle.category}
                </Badge>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {vehicle.make} {vehicle.model}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-zinc-400 font-mono block">MSRP</span>
              <span className="text-2xl font-black text-white font-serif">
                {formatPrice(vehicle.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Content Padding */}
        <div className="p-6 pt-2 flex flex-col gap-6">
          
          {/* Stock Status Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isOutOfStock ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">
                  {isOutOfStock ? 'Currently Unavailable' : 'Available in Showroom Inventory'}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {isOutOfStock ? 'Contact manager to schedule restock.' : `${vehicle.quantity} units ready for immediate acquisition.`}
                </p>
              </div>
            </div>

            {isOutOfStock ? (
              <Badge variant="rose">Out of Stock</Badge>
            ) : (
              <Badge variant="emerald">{vehicle.quantity} Units Left</Badge>
            )}
          </div>

          {/* Performance Specs Grid */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Technical Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Power</span>
                <span className="text-sm font-bold text-white font-mono flex items-center gap-1 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {vehicle.specs?.horsepower || '500+'} HP
                </span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">0-60 MPH</span>
                <span className="text-sm font-bold text-white font-mono flex items-center gap-1 mt-0.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  {vehicle.specs?.acceleration || '3.2s'}
                </span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Drivetrain</span>
                <span className="text-sm font-bold text-white font-mono truncate block mt-0.5">
                  {vehicle.specs?.transmission || 'Sport Auto'}
                </span>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Fuel / Power</span>
                <span className="text-sm font-bold text-white font-mono truncate block mt-0.5">
                  {vehicle.specs?.fuelType || 'Gasoline'}
                </span>
              </div>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              Vehicle Overview
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
              {vehicle.description || `The ${vehicle.year} ${vehicle.make} ${vehicle.model} combines precision engineering, extraordinary luxury finishes, and uncompromised athletic performance. Fully inspected and certified by Apex Motors.`}
            </p>
          </div>

          {/* Financing Estimation Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Apex Financial Services</span>
                <span className="text-[11px] text-zinc-400">Estimated Monthly Lease / Loan</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-amber-400 font-mono">
                ${estimatedMonthly.toLocaleString()} / mo
              </span>
              <span className="text-[10px] text-zinc-500 block">Estimated 60 mo</span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onRestock(vehicle);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-semibold border border-zinc-700 transition-all"
                >
                  <PackageCheck className="w-4 h-4" />
                  Restock
                </button>
              )}

              <button
                onClick={handlePurchase}
                disabled={isOutOfStock || purchasing || actionLoading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
                  isOutOfStock
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-400/20'
                }`}
              >
                {purchasing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing Order...
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Acquire Vehicle ({formatPrice(vehicle.price)})
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
};
