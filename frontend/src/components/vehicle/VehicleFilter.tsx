import React from 'react';
import { useVehicles } from '../../context/VehicleContext';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Grid, 
  List, 
  DollarSign, 
  Sparkles,
  ArrowUpDown,
  Filter
} from 'lucide-react';

export const VehicleFilter: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    categories, 
    makes, 
    viewMode, 
    setViewMode,
    filteredVehicles,
    vehicles 
  } = useVehicles();

  const safeFilteredVehicles = Array.isArray(filteredVehicles) ? filteredVehicles : [];
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeMakes = Array.isArray(makes) ? makes : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, make: e.target.value }));
  };

  const handleCategoryClick = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? '' : cat,
    }));
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const num = value === '' ? '' : Number(value);
    setFilters((prev) => ({ ...prev, [field]: num }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
  };

  const handleStockToggle = () => {
    setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  };

  const activeFiltersCount = [
    filters.search,
    filters.make,
    filters.category,
    filters.minPrice !== '',
    filters.maxPrice !== '',
    filters.inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-md shadow-xl">
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-zinc-100 placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Dropdown Filters & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Make Filter */}
          <div className="relative">
            <select
              value={filters.make}
              onChange={handleMakeChange}
              className="appearance-none bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
            >
              <option value="" className="bg-zinc-950 text-white">All Makes</option>
              {safeMakes.map((m) => (
                <option key={m} value={m} className="bg-zinc-950 text-white">
                  {m}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="appearance-none bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
            >
              <option value="year-desc" className="bg-zinc-950 text-white">Sort: Newest First</option>
              <option value="price-asc" className="bg-zinc-950 text-white">Sort: Price (Low → High)</option>
              <option value="price-desc" className="bg-zinc-950 text-white">Sort: Price (High → Low)</option>
              <option value="make-asc" className="bg-zinc-950 text-white">Sort: Make (A → Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* In Stock Toggle */}
          <button
            onClick={handleStockToggle}
            className={`px-4 py-2 rounded-full border text-xs font-medium transition-all flex items-center gap-2 ${
              filters.inStockOnly
                ? 'bg-green-500/10 border-green-500/30 text-green-400 font-semibold'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${filters.inStockOnly ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
            In Stock Only
          </button>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset ({activeFiltersCount})
            </button>
          )}

        </div>
      </div>

      {/* Category Pills & Price Filter Row */}
      <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mr-1">
            Filter Tier:
          </span>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !filters.category
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            All
          </button>
          {safeCategories.map((cat) => {
            const isActive = filters.category.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Price Min/Max Inputs */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
            Price ($):
          </span>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-100 placeholder-white/30 focus:outline-none focus:border-blue-500/50 font-mono text-center"
          />
          <span className="text-white/20 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-100 placeholder-white/30 focus:outline-none focus:border-blue-500/50 font-mono text-center"
          />
        </div>

      </div>

      {/* Results Count Bar */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
        <span>
          Showing <strong className="text-white font-bold">{safeFilteredVehicles.length}</strong> of{' '}
          <strong className="text-white/70">{safeVehicles.length}</strong> vehicles in stock
        </span>
        {filters.search && (
          <span className="text-white/40 italic">
            Matching "{filters.search}"
          </span>
        )}
      </div>

    </div>
  );
};
