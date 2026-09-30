import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DemoNoticeBanner } from '../common/DemoNoticeBanner';
import { CommandPalette } from '../common/CommandPalette';
import { User, Project, UserRole } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
  user: User;
  projects: Project[];
  activeProjectId?: string;
  onSelectProject: (projectId: string) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
  pendingTasksCount: number;
  openIssuesCount: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  user,
  projects,
  activeProjectId,
  onSelectProject,
  currentPath,
  onNavigate,
  onLogout,
  onRoleChange,
  pendingTasksCount,
  openIssuesCount,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Demo & Architecture Notice Banner */}
      <DemoNoticeBanner
        currentRole={user.role}
        onRoleChange={onRoleChange}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          pendingTasksCount={pendingTasksCount}
          openIssuesCount={openIssuesCount}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar
            user={user}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={onSelectProject}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onNavigate={onNavigate}
            onLogout={onLogout}
          />

          <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
