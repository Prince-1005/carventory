import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, ShieldAlert } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 mb-4 shadow-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-white font-serif tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-zinc-200 mb-2">Page Not Found</h2>
        <p className="text-xs text-zinc-400 mb-8 max-w-xs">
          The requested route does not exist in the Apex Motors inventory management system.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-xl shadow-amber-400/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Showroom
        </Link>
      </div>
    </div>
  );
};
