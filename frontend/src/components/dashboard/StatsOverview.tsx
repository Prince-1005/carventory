import React from 'react';
import { useVehicles } from '../../context/VehicleContext';
import { Car, DollarSign, AlertCircle, Layers, TrendingUp, ShieldAlert } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { vehicles } = useVehicles();
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

  const totalUnits = safeVehicles.reduce((acc, v) => acc + (v.quantity || 0), 0);
  const totalValue = safeVehicles.reduce((acc, v) => acc + ((v.price || 0) * (v.quantity || 0)), 0);
  const outOfStockCount = safeVehicles.filter((v) => v.quantity <= 0).length;
  const avgPrice = safeVehicles.length > 0 
    ? Math.round(safeVehicles.reduce((acc, v) => acc + (v.price || 0), 0) / safeVehicles.length) 
    : 0;

  const formatMillions = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Total Inventory Valuation */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
            Total Value
          </p>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-light text-white tracking-tight">
          {formatMillions(totalValue)}
        </h3>
        <p className="text-[11px] text-white/40 mt-2 flex items-center gap-1 font-mono">
          <TrendingUp className="w-3 h-3 text-green-400" />
          Across {vehicles.length} vehicle models
        </p>
      </div>

      {/* Active Inventory / Units */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
            Active Inventory
          </p>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
            <Car className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-light text-white tracking-tight">
          {totalUnits} <span className="text-xs text-green-400 font-medium ml-2">+12%</span>
        </h3>
        <p className="text-[11px] text-white/40 mt-2 font-mono">
          Available fleet units
        </p>
      </div>

      {/* Avg Margin / Unit MSRP */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
            Avg. Unit MSRP
          </p>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-light text-white tracking-tight">
          ${avgPrice.toLocaleString()}
        </h3>
        <p className="text-[11px] text-white/40 mt-2 font-mono">
          Luxury & Supercar Tier
        </p>
      </div>

      {/* Pending Sales / Depleted Stock */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-white/40 uppercase tracking-wider font-mono">
            Depleted Stock
          </p>
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${outOfStockCount > 0 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-light text-white tracking-tight">
          {outOfStockCount} <span className="text-xs text-white/40 font-normal">Models</span>
        </h3>
        <p className="text-[11px] text-white/40 mt-2 font-mono">
          {outOfStockCount > 0 ? `${outOfStockCount} items require restock` : 'All models in stock'}
        </p>
      </div>

    </div>
  );
};
