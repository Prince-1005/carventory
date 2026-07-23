import React from 'react';
import { Car, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Car className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-200 font-serif">APEX MOTORS</p>
              <p className="text-[11px] text-zinc-500">Luxury & High-Performance Vehicle Inventory System</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              REST API Connected
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              JWT Auth Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              React 19 & Tailwind CSS
            </span>
          </div>

          <p className="text-zinc-600 text-[11px]">
            © {new Date().getFullYear()} Apex Motors Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
