import React from 'react';
import { Modal } from '../ui/Modal';
import { Vehicle } from '../../types';
import { useVehicles } from '../../context/VehicleContext';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

interface DeleteConfirmModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const { deleteVehicle, actionLoading } = useVehicles();

  if (!vehicle) return null;

  const handleDelete = async () => {
    const success = await deleteVehicle(vehicle);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Vehicle Record"
      subtitle="Confirm permanent removal from inventory database"
      maxWidth="md"
    >
      <div className="flex flex-col gap-5">
        
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200 leading-relaxed">
            <p className="font-semibold text-rose-300 mb-1">Warning: Irreversible Operation</p>
            You are about to remove <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong> from the dealer inventory catalog.
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-500 block font-mono">Category</span>
            <span className="font-bold text-white">{vehicle.category}</span>
          </div>
          <div>
            <span className="text-zinc-500 block font-mono">Stock Remaining</span>
            <span className="font-bold text-amber-400">{vehicle.quantity} Units</span>
          </div>
          <div>
            <span className="text-zinc-500 block font-mono">Price</span>
            <span className="font-bold text-white font-serif">${vehicle.price?.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all active:scale-95"
          >
            {actionLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Delete Vehicle
              </>
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
};
