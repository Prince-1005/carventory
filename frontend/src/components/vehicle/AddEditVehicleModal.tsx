import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Vehicle } from '../../types';
import { useVehicles } from '../../context/VehicleContext';
import { Plus, Edit3, Image as ImageIcon, Sparkles, RefreshCw, Car } from 'lucide-react';

interface AddEditVehicleModalProps {
  vehicle?: Vehicle | null; // null = Add mode, vehicle object = Edit mode
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_HIGHRES_IMAGES = [
  { label: 'Porsche 911', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tesla S', url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80' },
  { label: 'BMW M5', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mercedes AMG', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Ferrari 296', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Range Rover', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80' },
];

export const AddEditVehicleModal: React.FC<AddEditVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const { addVehicle, updateVehicle, actionLoading } = useVehicles();
  const isEditMode = Boolean(vehicle);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Supercar',
    price: 150000,
    quantity: 3,
    imageUrl: '',
    description: '',
    horsepower: 500,
    acceleration: '3.2s 0-60',
    transmission: '8-Speed Automatic',
    fuelType: 'Gasoline',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        category: vehicle.category || 'Supercar',
        price: vehicle.price || 0,
        quantity: vehicle.quantity || 0,
        imageUrl: vehicle.imageUrl || '',
        description: vehicle.description || '',
        horsepower: vehicle.specs?.horsepower || 500,
        acceleration: vehicle.specs?.acceleration || '3.2s 0-60',
        transmission: vehicle.specs?.transmission || '8-Speed Automatic',
        fuelType: vehicle.specs?.fuelType || 'Gasoline',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        category: 'Supercar',
        price: 150000,
        quantity: 3,
        imageUrl: PRESET_HIGHRES_IMAGES[0].url,
        description: '',
        horsepower: 500,
        acceleration: '3.2s 0-60',
        transmission: '8-Speed Automatic',
        fuelType: 'Gasoline',
      });
    }
    setErrors({});
  }, [vehicle, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'quantity' || name === 'horsepower'
        ? Number(value)
        : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.make.trim()) errs.make = 'Make is required (e.g. Porsche, Tesla)';
    if (!formData.model.trim()) errs.model = 'Model is required (e.g. 911 GT3)';
    if (!formData.year || formData.year < 1900 || formData.year > 2030) errs.year = 'Enter a valid year';
    if (!formData.category.trim()) errs.category = 'Category is required';
    if (formData.price < 0) errs.price = 'Price cannot be negative';
    if (formData.quantity < 0) errs.quantity = 'Quantity cannot be negative';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      make: formData.make.trim(),
      model: formData.model.trim(),
      year: formData.year,
      category: formData.category,
      price: formData.price,
      quantity: formData.quantity,
      imageUrl: formData.imageUrl || PRESET_HIGHRES_IMAGES[0].url,
      description: formData.description,
      specs: {
        horsepower: formData.horsepower,
        acceleration: formData.acceleration,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
      },
    };

    let success = false;
    if (isEditMode && vehicle) {
      const id = vehicle._id || vehicle.id;
      if (id) {
        success = await updateVehicle(id, payload);
      }
    } else {
      success = await addVehicle(payload);
    }

    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Vehicle Specifications' : 'Add New Inventory Vehicle'}
      subtitle={isEditMode ? 'Update pricing, quantity, and technical specifications' : 'Register a new luxury or performance vehicle into the inventory'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Make & Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Vehicle Make <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              name="make"
              placeholder="e.g. Porsche, Tesla, BMW"
              value={formData.make}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 bg-zinc-950 border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 ${errors.make ? 'border-rose-500' : 'border-zinc-800'}`}
            />
            {errors.make && <p className="text-[11px] text-rose-400 mt-1">{errors.make}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Vehicle Model <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              name="model"
              placeholder="e.g. 911 GT3 RS, Model S"
              value={formData.model}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 bg-zinc-950 border rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 ${errors.model ? 'border-rose-500' : 'border-zinc-800'}`}
            />
            {errors.model && <p className="text-[11px] text-rose-400 mt-1">{errors.model}</p>}
          </div>
        </div>

        {/* Year, Category, Price, Quantity */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-2.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="Supercar">Supercar</option>
              <option value="Luxury SUV">Luxury SUV</option>
              <option value="Electric">Electric</option>
              <option value="Executive Sedan">Executive Sedan</option>
              <option value="Gran Turismo">Gran Turismo</option>
              <option value="Hypercar">Hypercar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Stock Qty</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Image URL & Quick Presets */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
            <span>Image URL</span>
            <span className="text-[10px] text-zinc-500">Or pick preset gallery photo below</span>
          </label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://images.unsplash.com/..."
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />

          <div className="flex flex-wrap gap-1.5 mt-2">
            {PRESET_HIGHRES_IMAGES.map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() => setFormData((prev) => ({ ...prev, imageUrl: preset.url }))}
                className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 rounded-lg text-[10px] text-zinc-400 hover:text-white transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specs Row */}
        <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Performance Specs
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] text-zinc-400">Horsepower (HP)</label>
              <input
                type="number"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400">0-60 MPH Acceleration</label>
              <input
                type="text"
                name="acceleration"
                value={formData.acceleration}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400">Transmission</label>
              <input
                type="text"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400">Fuel / Power Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Key highlights, options, track specs..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs rounded-xl shadow-lg shadow-amber-400/20 transition-all active:scale-95"
          >
            {actionLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : isEditMode ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add to Inventory
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};
