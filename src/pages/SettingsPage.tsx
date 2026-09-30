import React, { useState } from 'react';
import {
  Settings,
  Server,
  Database,
  Lock,
  Cpu,
  Shield,
  RefreshCw,
  Check,
  Save,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { authService } from '../services/auth/authService';
import { mockStore } from '../data/mockStore';

interface SettingsPageProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  onRoleChange,
}) => {
  const [backendUrl, setBackendUrl] = useState('http://localhost:8080/api/v1');
  const [dbUrl, setDbUrl] = useState('jdbc:postgresql://localhost:5432/nexus_db');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [jwtAlgorithm, setJwtAlgorithm] = useState('RS256');
  const [tokenExpiry, setTokenExpiry] = useState('86400');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    authService.switchRole(selectedRole);
    onRoleChange(selectedRole);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo state to pristine initial seed data?')) {
      mockStore.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Platform & Backend Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure production Java Spring Boot endpoints, PostgreSQL connection specifications, and authorization rules
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Backend REST Configuration */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono text-indigo-400">
            <Server className="w-4 h-4" />
            <span>Java Spring Boot REST Gateway</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Backend URL
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                The frontend API client routes all /api/* requests through this adapter abstraction.
              </span>
            </div>
          </div>
        </div>

        {/* Database Target Specification */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono text-emerald-400">
            <Database className="w-4 h-4" />
            <span>PostgreSQL 16 & Flyway Migration Specs</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                JDBC DataSource URL
              </label>
              <input
                type="text"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                Connection pool: HikariCP with 10 minimum-idle and 30 max connections.
              </span>
            </div>
          </div>
        </div>

        {/* Security & Authorization Roles */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono text-amber-400">
            <Shield className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC) & JWT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Active User Role (Test UI Boundaries)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ADMIN">ADMIN (Full create, delete, configure permissions)</option>
                <option value="DEVELOPER">DEVELOPER (Code review, debug, task updates)</option>
                <option value="VIEWER">VIEWER (Read-only project and documentation view)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                JWT Signing Algorithm
              </label>
              <select
                value={jwtAlgorithm}
                onChange={(e) => setJwtAlgorithm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="RS256">RS256 (Asymmetric RSA Public/Private Key - Recommended)</option>
                <option value="HS512">HS512 (HMAC SHA-512 Symmetric Key)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Model Intelligence Gateway */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono text-purple-400">
            <Cpu className="w-4 h-4" />
            <span>AI Model & Telemetry Gateway</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All AI operations (Code Review, Debugging, Knowledge Assistant, Planning, Docs, and Tests) are processed via secure server-side abstractions in <code>server.ts</code> using <strong>Gemini 3.8 Flash</strong>. No client-side keys are ever exposed.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-rose-400 border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Store to Factory Seeds</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved' : 'Save Configurations'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
