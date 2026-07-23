import React from 'react';
import { useVehicles } from '../../context/VehicleContext';
import { ShoppingBag, PackageCheck, Plus, Edit3, Trash2, Clock, Activity } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const { activities } = useVehicles();

  const getIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />;
      case 'restock':
        return <PackageCheck className="w-3.5 h-3.5 text-green-400" />;
      case 'add':
        return <Plus className="w-3.5 h-3.5 text-purple-400" />;
      case 'edit':
        return <Edit3 className="w-3.5 h-3.5 text-zinc-300" />;
      case 'delete':
        return <Trash2 className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-zinc-300" />;
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Recent Activity
        </h3>
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
          Live Audit Log
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                {getIcon(act.type)}
              </div>
              <div>
                <p className="font-medium text-zinc-200">
                  <span className="capitalize text-white font-bold">{act.type}:</span> {act.vehicleTitle}
                </p>
                <p className="text-[10px] text-white/40 mt-0.5">
                  Executed by {act.user}
                </p>
              </div>
            </div>

            <div className="text-right font-mono">
              {act.amount && (
                <span className="text-xs font-bold text-green-400 block">
                  +${act.amount.toLocaleString()}
                </span>
              )}
              {act.quantity && (
                <span className="text-xs font-bold text-blue-400 block">
                  +{act.quantity} Units
                </span>
              )}
              <span className="text-[10px] text-white/40 flex items-center justify-end gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-white/30" />
                {act.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
