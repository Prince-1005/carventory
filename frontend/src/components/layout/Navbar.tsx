import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import { 
  Car, 
  Plus, 
  LogOut, 
  Shield, 
  User as UserIcon, 
  ChevronDown, 
  Sparkles,
  Search,
  LayoutDashboard,
  BarChart3
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { user, isAdmin, logout, toggleRole } = useAuth();
  const { filters, setFilters } = useVehicles();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <div className="w-5 h-5 bg-black rotate-45 transition-transform duration-300 group-hover:rotate-90"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                APEX <span className="text-[10px] bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full border border-white/10 font-mono uppercase tracking-widest">EXECUTIVE</span>
              </span>
              <span className="text-[10px] text-white/40 font-mono tracking-wider uppercase -mt-0.5">
                Fleet & Inventory
              </span>
            </div>
          </Link>

          {/* Quick Search input in Header (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 text-sm text-zinc-100 placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/50 hover:text-white bg-white/10 px-2 py-0.5 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            
            {/* Demo Role Switcher Toggle */}
            <button
              onClick={toggleRole}
              title="Click to toggle between Admin and Customer perspective"
              className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isAdmin
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-blue-400' : 'text-zinc-400'}`} />
              <span>Role: <strong className="uppercase">{user?.role || 'Guest'}</strong></span>
              <span className="text-[10px] text-zinc-500 underline ml-0.5">(Switch)</span>
            </button>

            {/* Add Vehicle Button for Admin */}
            {isAdmin && onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-lg shadow-white/5 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Vehicle</span>
              </button>
            )}

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20 flex items-center justify-center text-white font-bold text-xs">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden lg:flex flex-col text-left mr-1">
                  <span className="text-xs font-semibold text-zinc-200 leading-tight">
                    {user?.username || 'Executive'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    onClick={() => setDropdownOpen(false)}
                    className="fixed inset-0 z-30"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl py-2 z-40 text-xs backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-xs font-semibold text-white">{user?.username}</p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{user?.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Access Level</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${isAdmin ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-white/10 text-zinc-300 border-white/10'}`}>
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        toggleRole();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-blue-400" />
                      Switch Role ({isAdmin ? 'to Customer' : 'to Admin'})
                    </button>

                    <div className="border-t border-white/5 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
