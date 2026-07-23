import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Vehicle } from '../../types';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import { 
  ShoppingBag, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  Zap, 
  Gauge, 
  Info,
  PackageCheck,
  CheckCircle2
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
}

// Fallback luxury car images based on category or make if image fails to load
const DEFAULT_CAR_IMAGES: Record<string, string> = {
  porsche: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
  tesla: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
  ferrari: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
  supercar: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
};

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const { isAdmin } = useAuth();
  const { purchaseVehicle, actionLoading } = useVehicles();
  const [purchasingThis, setPurchasingThis] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePurchase = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vehicle.quantity <= 0) return;

    setPurchasingThis(true);
    await purchaseVehicle(vehicle);
    setPurchasingThis(false);
  };

  const getImageSrc = () => {
    if (imageError || !vehicle.imageUrl) {
      const makeKey = vehicle.make?.toLowerCase();
      return DEFAULT_CAR_IMAGES[makeKey] || DEFAULT_CAR_IMAGES[vehicle.category?.toLowerCase()] || DEFAULT_CAR_IMAGES.default;
    }
    return vehicle.imageUrl;
  };

  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect(vehicle)}
      className="group bg-white/5 border border-white/10 hover:bg-white/[0.08] rounded-3xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 cursor-pointer shadow-xl"
    >
      {/* Availability Badge - Top Right */}
      <div className="absolute top-8 right-8 z-10">
        {isOutOfStock ? (
          <span className="px-3 py-1 bg-white/10 text-white/40 border border-white/20 text-[10px] font-bold uppercase rounded-full tracking-wider">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold uppercase rounded-full tracking-wider">
            Low Stock ({vehicle.quantity})
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase rounded-full tracking-wider">
            In Stock ({vehicle.quantity})
          </span>
        )}
      </div>

      {/* Top Image Box */}
      <div className="h-44 w-full rounded-2xl mb-5 relative overflow-hidden bg-gradient-to-b from-zinc-800 to-black shrink-0">
        <img
          src={getImageSrc()}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />

        {/* Category & Year Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 rounded-full">
            {vehicle.category || 'Luxury'}
          </span>
          <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70 rounded-full">
            {vehicle.year}
          </span>
        </div>
      </div>

      {/* Main Info Box */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div>
          <h4 className="text-xl font-medium leading-tight text-white group-hover:text-blue-400 transition-colors">
            {vehicle.make} {vehicle.model}
          </h4>
          <p className="text-xs text-white/40 mt-1 font-mono">
            {vehicle.year} • {vehicle.category} {vehicle.specs?.horsepower ? `• ${vehicle.specs.horsepower} HP` : ''}
          </p>
        </div>
        <p className="text-xl font-light text-white font-mono whitespace-nowrap">
          {formatPrice(vehicle.price)}
        </p>
      </div>

      {/* Description Snippet */}
      {vehicle.description && (
        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-6 font-sans">
          {vehicle.description}
        </p>
      )}

      {/* Bottom Action Bar */}
      <div className="mt-auto flex gap-3 pt-2">
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || purchasingThis || actionLoading}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              : purchasingThis
              ? 'bg-blue-500 text-white opacity-90'
              : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/5'
          }`}
        >
          {purchasingThis ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Buying...
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              Purchase
            </>
          )}
        </button>

        {/* Specs / Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(vehicle);
          }}
          title="View Full Specifications"
          className="w-11 h-11 border border-white/10 rounded-xl flex items-center justify-center text-zinc-300 hover:bg-white/10 hover:text-white transition-colors shrink-0"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Admin Action Bar */}
      {isAdmin && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40"
        >
          <span className="uppercase tracking-wider font-mono text-[10px]">Management</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRestock(vehicle)}
              className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
            >
              <PackageCheck className="w-3 h-3" /> Restock
            </button>
            <button
              onClick={() => onEdit(vehicle)}
              className="p-1.5 rounded-lg border border-white/10 text-zinc-300 hover:bg-white/10 transition-colors"
              title="Edit Vehicle"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(vehicle)}
              className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              title="Delete Vehicle"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
