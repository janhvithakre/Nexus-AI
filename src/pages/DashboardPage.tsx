import React from 'react';
import {
  FolderGit2,
  CheckSquare,
  AlertCircle,
  FileCode,
  Bug,
  Sparkles,
  ArrowRight,
  GitBranch,
  Bot,
  Activity,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  Project,
  Task,
  Issue,
  DashboardMetrics,
  ActivityLog,
  CodeReviewResult,
  User,
} from '../types';
import { HealthBadge, SeverityBadge, StatusBadge } from '../components/common/Badge';

interface DashboardPageProps {
  metrics: DashboardMetrics;
  projects: Project[];
  tasks: Task[];
  issues: Issue[];
  codeReviews: CodeReviewResult[];
  activityLogs: ActivityLog[];
  currentUser: User;
  onNavigate: (path: string) => void;
  onOpenCreateProject: () => void;
  onOpenCreateTask: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  projects,
  tasks,
  issues,
  codeReviews,
  activityLogs,
  currentUser,
  onNavigate,
  onOpenCreateProject,
  onOpenCreateTask,
}) => {
  const urgentIssues = issues.filter(
    (i) => (i.severity === 'CRITICAL' || i.severity === 'HIGH') && i.status !== 'CLOSED'
  );
  const activeTasks = tasks.filter((t) => t.status !== 'DONE').slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Engineering Workbench
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              v1.0.0-PROD
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Welcome back, <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role}). System health is optimal across microservices.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/code-review')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>Review Code</span>
          </button>
          <button
            onClick={() => onNavigate('/debugging')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>Debug Error</span>
          </button>
          <button
            onClick={onOpenCreateTask}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Projects */}
        <div
          onClick={() => onNavigate('/projects')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Repositories</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{projects.length}</span>
            <span className="text-[11px] font-mono text-emerald-400">100% Online</span>
          </div>
        </div>

        {/* Metric 2: Pending Tasks */}
        <div
          onClick={() => onNavigate('/tasks')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Sprint Deliverables</span>
            <CheckSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{metrics.pendingTasks}</span>
            <span className="text-[11px] font-mono text-slate-400">{metrics.completedTasksThisWeek} done this sprint</span>
          </div>
        </div>

        {/* Metric 3: Open Issues */}
        <div
          onClick={() => onNavigate('/issues')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Incidents / Bugs</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-300">{metrics.openIssues}</span>
            <span className="text-[11px] font-mono text-amber-400">{urgentIssues.length} P0/P1 Urgent</span>
          </div>
        </div>

        {/* Metric 4: AI Telemetry & Code Reviews */}
        <div
          onClick={() => onNavigate('/code-review')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">AI Reviews Completed</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{codeReviews.length + 15}</span>
            <span className="text-[11px] font-mono text-indigo-400">Avg Score: {metrics.avgReviewScore}/100</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Overview & Urgent Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Projects Portfolio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              Active Projects & Microservices
            </h2>
            <button
              onClick={() => onNavigate('/projects')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
            >
              <span>View all ({projects.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate(`/projects/${p.id}`)}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {p.key}
                    </span>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {p.name}
                    </h3>
                  </div>
                  <HealthBadge health={p.health} />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-cyan-400" />
                    <span>{p.pendingTasksCount} tasks</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>{p.openIssuesCount} issues</span>
                  </span>
                  <span className="text-slate-500">{p.members.length} members</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sprint Tasks Snapshot */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 mt-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                Active Sprint Tasks
              </h3>
              <button
                onClick={() => onNavigate('/tasks')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Open Kanban Board →
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {activeTasks.map((t) => (
                <div key={t.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono text-slate-500 text-[10px] shrink-0">{t.id}</span>
                    <span className="text-slate-200 font-medium truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Urgent Incidents & Live Activity Log */}
        <div className="space-y-6">
          {/* Urgent Issues Box */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>P0 / P1 Active Incidents</span>
              </div>
              <span className="font-mono text-xs text-rose-400 font-bold">{urgentIssues.length} Open</span>
            </div>

            {urgentIssues.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono py-2">No critical incidents pending.</p>
            ) : (
              <div className="space-y-3">
                {urgentIssues.slice(0, 3).map((iss) => (
                  <div
                    key={iss.id}
                    onClick={() => onNavigate('/issues')}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-rose-900/60 transition-colors cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">{iss.id}</span>
                      <SeverityBadge severity={iss.severity} />
                    </div>
                    <p className="text-xs font-medium text-slate-200 leading-snug line-clamp-2">
                      {iss.title}
                    </p>
                    {iss.environment && (
                      <span className="text-[10px] font-mono text-slate-500 block truncate">
                        Env: {iss.environment}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Activity Feed */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold uppercase tracking-wider font-mono">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Recent Activity</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live</span>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-300 leading-snug">{log.summary}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-0.5">
                      <span>{log.user.name}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Workbench Shortcut Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-900/40 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs font-semibold">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Project Knowledge RAG</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have an architecture or implementation question? Query NEXUS AI with live repository, README, and Spring Boot context.
            </p>
            <button
              onClick={() => onNavigate('/ai-assistant')}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
            >
              <span>Ask Project Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
