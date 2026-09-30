import React from 'react';
import { Terminal, ArrowLeft, LayoutDashboard, Search } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400 font-mono font-bold text-2xl shadow-xl">
        404
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-xl font-bold text-white tracking-tight">Endpoint / Route Not Found</h1>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          The requested engineering resource or URI path is not registered on this gateway router.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Product Overview</span>
        </button>
      </div>
    </div>
  );
};
