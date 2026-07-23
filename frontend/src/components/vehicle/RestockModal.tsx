import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Vehicle } from '../../types';
import { useVehicles } from '../../context/VehicleContext';
import { PackageCheck, Plus, RefreshCw, Layers } from 'lucide-react';

interface RestockModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const { restockVehicle, actionLoading } = useVehicles();
  const [quantity, setQuantity] = useState(1);

  if (!vehicle) return null;

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 1) return;

    const success = await restockVehicle(vehicle, quantity);
    if (success) {
      onClose();
    }
  };

  const currentStock = vehicle.quantity || 0;
  const newStock = currentStock + Number(quantity);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restock Inventory"
      subtitle={`Increase available stock units for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      maxWidth="md"
    >
      <form onSubmit={handleRestock} className="flex flex-col gap-5">
        
        {/* Current & New Stock Preview Card */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">Current Stock</span>
            <span className="text-xl font-bold text-white font-mono">{currentStock} Units</span>
          </div>

          <div className="text-zinc-600 font-bold text-lg">+</div>

          <div>
            <span className="text-[10px] text-emerald-400 font-mono uppercase block">Adding</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">+{quantity} Units</span>
          </div>

          <div className="text-zinc-600 font-bold text-lg">=</div>

          <div>
            <span className="text-[10px] text-amber-400 font-mono uppercase block">New Total</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{newStock} Units</span>
          </div>
        </div>

        {/* Quantity Preset Buttons */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Select Quantity to Add
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[1, 3, 5, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuantity(num)}
                className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                  quantity === num
                    ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-md shadow-amber-400/20'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                +{num}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="relative">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              placeholder="Or enter custom quantity"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            {actionLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Restocking...
              </>
            ) : (
              <>
                <PackageCheck className="w-3.5 h-3.5" />
                Confirm Restock (+{quantity})
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};
