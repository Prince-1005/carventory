import React from 'react';

export const VehicleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden animate-pulse flex flex-col">
      <div className="h-52 bg-zinc-800/60 w-full relative" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-zinc-800 rounded w-1/3" />
          <div className="h-5 bg-zinc-800 rounded-full w-16" />
        </div>
        <div className="h-6 bg-zinc-800 rounded w-2/3" />
        <div className="h-4 bg-zinc-800/60 rounded w-full mt-1" />
        <div className="h-4 bg-zinc-800/60 rounded w-4/5" />
        <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between mt-auto">
          <div>
            <div className="h-3 bg-zinc-800 rounded w-12 mb-1" />
            <div className="h-6 bg-zinc-800 rounded w-24" />
          </div>
          <div className="h-10 bg-zinc-800 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 bg-zinc-800 rounded w-24" />
            <div className="h-8 w-8 bg-zinc-800 rounded-lg" />
          </div>
          <div className="h-8 bg-zinc-800 rounded w-32 mb-2" />
          <div className="h-3 bg-zinc-800/60 rounded w-20" />
        </div>
      ))}
    </div>
  );
};
