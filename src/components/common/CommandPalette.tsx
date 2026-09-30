import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  AlertCircle,
  FileCode,
  Bug,
  BookOpen,
  Github,
  Bot,
  User,
  Settings,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { label: 'Engineering Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Project Portfolio', path: '/projects', icon: FolderGit2, category: 'Navigation' },
    { label: 'Task Management & Kanban', path: '/tasks', icon: CheckSquare, category: 'Engineering' },
    { label: 'Issue Tracker & Exceptions', path: '/issues', icon: AlertCircle, category: 'Engineering' },
    { label: 'AI Code Review Workspace', path: '/code-review', icon: FileCode, category: 'AI Intelligence' },
    { label: 'AI Debugging Workbench', path: '/debugging', icon: Bug, category: 'AI Intelligence' },
    { label: 'Project Knowledge Assistant', path: '/ai-assistant', icon: Bot, category: 'AI Intelligence' },
    { label: 'Architecture & API Docs', path: '/documentation', icon: BookOpen, category: 'Knowledge' },
    { label: 'GitHub Repository Intelligence', path: '/github', icon: Github, category: 'Integrations' },
    { label: 'Developer Profile & Stats', path: '/profile', icon: User, category: 'Account' },
    { label: 'Platform & Spring Backend Settings', path: '/settings', icon: Settings, category: 'Account' },
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-900/90 gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to workspace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching modules or actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/40">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-200">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigation Quick-Jump</span>
          <div className="flex items-center gap-2">
            <span>ESC to close</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
