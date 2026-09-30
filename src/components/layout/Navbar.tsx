import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Command,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { User, Project } from '../../types';
import { authService } from '../../services/auth/authService';

interface NavbarProps {
  user: User;
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (projectId: string) => void;
  onOpenCommandPalette: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  projects,
  activeProjectId,
  onSelectProject,
  onOpenCommandPalette,
  onNavigate,
  onLogout,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Project Selector and Quick Search */}
      <div className="flex items-center gap-4">
        {/* Project Selector Dropdown */}
        <div className="relative">
          <select
            value={activeProjectId || 'all'}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-slate-800 text-xs font-mono font-medium text-slate-200 border border-slate-700/80 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">⚡ Global Workspace (All Projects)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                📁 {p.key} - {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search / Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search or command...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 font-mono text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right: AI Indicator, Notifications, and Profile */}
      <div className="flex items-center gap-3">
        {/* AI Engine Status Indicator */}
        <div
          onClick={() => onNavigate('/ai-assistant')}
          className="cursor-pointer hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-800/40 text-xs font-mono text-indigo-300 hover:bg-indigo-900/30 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Nexus Core AI</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">System Notifications</span>
                <span className="text-[10px] font-mono text-indigo-400">3 unread</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                <div className="p-3 text-xs hover:bg-slate-800/50 cursor-pointer">
                  <div className="flex items-center gap-2 text-indigo-300 font-medium mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Review Completed</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">JwtFilter.java analysis identified 1 Critical security vulnerability.</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">5 minutes ago</span>
                </div>
                <div className="p-3 text-xs hover:bg-slate-800/50 cursor-pointer">
                  <div className="flex items-center gap-2 text-emerald-300 font-medium mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PR #42 Merged to main</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Token rotation & Spring Security stateless chain merged by Sarah.</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-200">{user.name}</span>
              <span className="text-[10px] font-mono text-indigo-400">{user.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-mono text-indigo-400">{user.role} Authorization</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Developer Profile</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Platform & Spring Settings</span>
                </button>
              </div>

              <div className="border-t border-slate-800 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
