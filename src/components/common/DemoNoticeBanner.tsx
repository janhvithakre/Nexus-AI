import React from 'react';
import { Shield, Database, RefreshCw, Cpu } from 'lucide-react';
import { UserRole } from '../../types';
import { authService } from '../../services/auth/authService';
import { mockStore } from '../../data/mockStore';

interface DemoNoticeBannerProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onDataReset?: () => void;
}

export const DemoNoticeBanner: React.FC<DemoNoticeBannerProps> = ({
  currentRole,
  onRoleChange,
  onDataReset,
}) => {
  const handleRoleSelect = (role: UserRole) => {
    authService.switchRole(role);
    onRoleChange(role);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo projects, tasks, issues, and reviews to pristine state?')) {
      mockStore.resetToDefaults();
      onDataReset?.();
      window.location.reload();
    }
  };

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-400 font-medium">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>GEMINI 3.8 SERVER INTELLIGENCE: READY</span>
        </div>
        <span className="hidden sm:inline text-slate-600">|</span>
        <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>ARCH: Java 21 / Spring Boot 3.3 REST Adapter (PostgreSQL Ready)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium mr-1">Active Role:</span>
          {(['ADMIN', 'DEVELOPER', 'VIEWER'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleSelect(r)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold transition-all ${
                currentRole === r
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Reset State Button */}
        <button
          onClick={handleReset}
          title="Reset local seed database"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Seeds</span>
        </button>
      </div>
    </div>
  );
};
