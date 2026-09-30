import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Search,
  CheckSquare,
  AlertCircle,
  ExternalLink,
  Users,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { Project, User } from '../types';
import { HealthBadge } from '../components/common/Badge';

interface ProjectsPageProps {
  projects: Project[];
  currentUser: User;
  onNavigate: (path: string) => void;
  onOpenCreateProject: () => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  currentUser,
  onNavigate,
  onOpenCreateProject,
  onDeleteProject,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.key.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-indigo-400" />
            <span>Project & Service Repositories</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage microservices, frontend portals, and infrastructure packages across engineering squads
          </p>
        </div>

        {currentUser.role === 'ADMIN' && (
          <button
            onClick={onOpenCreateProject}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects by key, name, or stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'BACKEND', 'FRONTEND', 'INFRASTRUCTURE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-indigo-300">
                    {project.key}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {project.category}
                  </span>
                </div>
                <HealthBadge health={project.health} />
              </div>

              <div>
                <h3
                  onClick={() => onNavigate(`/projects/${project.id}`)}
                  className="text-base font-semibold text-white hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Members */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {project.members.map((m, idx) => (
                    <div
                      key={idx}
                      title={`${m.userName} (${m.role})`}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-800 text-[10px] font-bold text-center leading-6 text-slate-300"
                    >
                      {m.userName.charAt(0)}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {project.members.length} engineers
                </span>
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 hover:text-slate-200">
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{project.pendingTasksCount}</span>
                </span>
                <span className="flex items-center gap-1 hover:text-slate-200">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{project.openIssuesCount}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentUser.role === 'ADMIN' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete project "${project.name}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    title="Delete Project (Admin only)"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onNavigate(`/projects/${project.id}`)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Manage →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
