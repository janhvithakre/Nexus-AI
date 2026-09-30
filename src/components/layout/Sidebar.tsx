import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  AlertCircle,
  FileCode,
  Bug,
  Bot,
  BookOpen,
  Github,
  Settings,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Server,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingTasksCount: number;
  openIssuesCount: number;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  isUrgent?: boolean;
  tag?: string;
  badge?: string;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  pendingTasksCount,
  openIssuesCount,
}) => {
  const navSections: NavSection[] = [
    {
      group: 'Core Engineering',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Projects', path: '/projects', icon: FolderGit2 },
        { label: 'Tasks', path: '/tasks', icon: CheckSquare, count: pendingTasksCount },
        { label: 'Issues', path: '/issues', icon: AlertCircle, count: openIssuesCount, isUrgent: openIssuesCount > 0 },
      ],
    },
    {
      group: 'AI Workbenches',
      items: [
        { label: 'Code Review', path: '/code-review', icon: FileCode, tag: 'AI' },
        { label: 'Debugging Assistant', path: '/debugging', icon: Bug, tag: 'AI' },
        { label: 'Project Intelligence', path: '/ai-assistant', icon: Bot, tag: 'RAG' },
      ],
    },
    {
      group: 'Knowledge & VCS',
      items: [
        { label: 'Documentation', path: '/documentation', icon: BookOpen },
        { label: 'GitHub Intelligence', path: '/github', icon: Github, badge: 'DEMO' },
      ],
    },
    {
      group: 'System',
      items: [
        { label: 'Settings & Backend', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`border-r border-slate-800 bg-slate-900/95 flex flex-col justify-between transition-all duration-300 relative select-none z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4">
          {!collapsed ? (
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-indigo-500 transition-colors">
                <Terminal className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-100 tracking-wider">NEXUS</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Developer Platform</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => onNavigate('/')}
              className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 flex items-center justify-center text-white cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-white" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors ${
              collapsed ? 'hidden' : 'block'
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="py-4 px-2 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
                  {sec.group}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                    } ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-1.5">
                        {item.tag && (
                          <span
                            className={`text-[9px] font-mono px-1 py-0.2 rounded uppercase ${
                              isActive
                                ? 'bg-indigo-700 text-indigo-100'
                                : 'bg-slate-800 text-indigo-300 border border-indigo-900/50'
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 uppercase">
                            {item.badge}
                          </span>
                        )}
                        {typeof item.count === 'number' && item.count > 0 && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                              isActive
                                ? 'bg-indigo-800 text-white'
                                : item.isUrgent
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Architecture Indicator */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        {!collapsed ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Server className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="flex flex-col truncate">
              <span className="text-slate-200 font-semibold truncate">Spring Boot 3.3 API</span>
              <span className="text-[10px] text-emerald-400">REST Contract Active</span>
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="w-full flex justify-center text-slate-500 hover:text-slate-300"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
