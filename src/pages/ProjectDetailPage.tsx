import React, { useState } from 'react';
import {
  FolderGit2,
  CheckSquare,
  AlertCircle,
  FileCode,
  BookOpen,
  GitBranch,
  Bot,
  Activity,
  Plus,
  ExternalLink,
  ShieldCheck,
  Cpu,
  ArrowLeft,
} from 'lucide-react';
import {
  Project,
  Task,
  Issue,
  Document,
  CodeReviewResult,
  ActivityLog,
  User,
} from '../types';
import { HealthBadge, SeverityBadge, StatusBadge } from '../components/common/Badge';

interface ProjectDetailPageProps {
  project: Project;
  tasks: Task[];
  issues: Issue[];
  documents: Document[];
  codeReviews: CodeReviewResult[];
  activityLogs: ActivityLog[];
  currentUser: User;
  onNavigate: (path: string) => void;
  onOpenCreateTask: (projectId: string) => void;
  onOpenCreateIssue: (projectId: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  tasks,
  issues,
  documents,
  codeReviews,
  activityLogs,
  currentUser,
  onNavigate,
  onOpenCreateTask,
  onOpenCreateIssue,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tasks' | 'issues' | 'repository' | 'documentation' | 'ai-assistant' | 'code-review' | 'activity'
  >('overview');

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectIssues = issues.filter((i) => i.projectId === project.id);
  const projectDocs = documents.filter((d) => d.projectId === project.id);
  const projectReviews = codeReviews.filter((r) => r.projectId === project.id);
  const projectActivity = activityLogs.filter((a) => a.projectId === project.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FolderGit2 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: projectTasks.length },
    { id: 'issues', label: 'Issues', icon: AlertCircle, count: projectIssues.length },
    { id: 'repository', label: 'Repository', icon: GitBranch },
    { id: 'documentation', label: 'Documentation', icon: BookOpen, count: projectDocs.length },
    { id: 'ai-assistant', label: 'Project AI', icon: Bot, tag: 'RAG' },
    { id: 'code-review', label: 'Code Review', icon: FileCode, count: projectReviews.length },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Header */}
      <div>
        <button
          onClick={() => onNavigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-sm text-indigo-400">
              {project.key}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{project.name}</h1>
                <HealthBadge health={project.health} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCreateTask(project.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
            <button
              onClick={() => onOpenCreateIssue(project.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900/80 border border-rose-800/80 text-xs font-semibold text-rose-300 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>File Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 font-semibold bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {tab.count}
                </span>
              )}
              {tab.tag && (
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Project Architecture & Specification
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">CATEGORY</span>
                  <span className="text-slate-200 font-semibold">{project.category}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">DEFAULT BRANCH</span>
                  <span className="text-indigo-400 font-semibold">{project.defaultBranch}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">INITIALIZED</span>
                  <span className="text-slate-200">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Task Summary */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Active Tasks ({projectTasks.length})
                </h4>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  View all →
                </button>
              </div>
              <div className="divide-y divide-slate-800/60">
                {projectTasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="py-2 flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate">{t.title}</span>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Members & Details */}
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Assigned Engineering Squad
              </h3>
              <div className="space-y-2.5">
                {project.members.map((m) => (
                  <div key={m.userId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {m.userName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-slate-200 font-medium block">{m.userName}</span>
                        <span className="text-[10px] text-slate-500">{m.userEmail}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Repository Link
              </h3>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-indigo-400 group"
              >
                <div className="flex items-center gap-2 truncate">
                  <GitBranch className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{project.repositoryUrl}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono">Sprint Deliverables</h3>
            <button
              onClick={() => onOpenCreateTask(project.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
            {projectTasks.map((t) => (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{t.id}</span>
                    <h4 className="text-sm font-semibold text-slate-200">{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={t.status} />
                  <span className="text-xs text-slate-400 font-mono">
                    {t.assignee?.name || 'Unassigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Issues */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono">Active Incidents</h3>
            <button
              onClick={() => onOpenCreateIssue(project.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File Incident</span>
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
            {projectIssues.map((iss) => (
              <div key={iss.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">{iss.id}</span>
                    <h4 className="text-sm font-semibold text-slate-200">{iss.title}</h4>
                  </div>
                  <SeverityBadge severity={iss.severity} />
                </div>
                <p className="text-xs text-slate-400">{iss.description}</p>
                {iss.environment && (
                  <span className="text-[10px] font-mono text-slate-500 block">Env: {iss.environment}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Repository */}
      {activeTab === 'repository' && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white font-mono">Git Repository Configuration</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connected to Git upstream. In the full production release, GitHub OAuth integration enables continuous PR linting and commit AST indexing.
          </p>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 font-mono text-xs space-y-2 text-slate-300">
            <div>git remote: {project.repositoryUrl}</div>
            <div>default branch: {project.defaultBranch}</div>
            <div>CI/CD pipeline: GitHub Actions (Passing)</div>
          </div>
        </div>
      )}

      {/* Tab 5: Documentation */}
      {activeTab === 'documentation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono">Project Specifications</h3>
            <button
              onClick={() => onNavigate('/documentation')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Open Full Doc Center →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                  {doc.type}
                </span>
                <h4 className="text-sm font-semibold text-white">{doc.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {doc.content.replace(/#+/g, '').slice(0, 150)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: AI Assistant (Scoped to Project) */}
      {activeTab === 'ai-assistant' && (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold">
            <Bot className="w-4 h-4" />
            <span>Project Knowledge Assistant (RAG)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            This assistant is grounded with the active project specifications, code repositories, and Spring Boot architecture of <strong>{project.name}</strong>.
          </p>
          <button
            onClick={() => onNavigate('/ai-assistant')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
          >
            <span>Launch Scoped AI Assistant</span>
          </button>
        </div>
      )}

      {/* Tab 7: Code Review */}
      {activeTab === 'code-review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white font-mono">Recent AI Code Reviews</h3>
            <button
              onClick={() => onNavigate('/code-review')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Open Review Workspace →
            </button>
          </div>
          <div className="space-y-3">
            {projectReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200">{rev.title}</h4>
                  <span className="text-xs font-mono text-indigo-400">Score: {rev.score}/100</span>
                </div>
                <p className="text-xs text-slate-400">{rev.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Activity */}
      {activeTab === 'activity' && (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
            Project Event Stream
          </h3>
          <div className="space-y-3">
            {projectActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-300 leading-snug">{log.summary}</p>
                  <span className="text-[10px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
