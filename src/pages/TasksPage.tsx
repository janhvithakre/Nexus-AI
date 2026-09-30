import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Clock,
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from 'lucide-react';
import { Task, Project, TaskStatus, TaskPriority, User } from '../types';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';

interface TasksPageProps {
  tasks: Task[];
  projects: Project[];
  currentUser: User;
  onOpenCreateTask: () => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  projects,
  currentUser,
  onOpenCreateTask,
  onUpdateTaskStatus,
  onDeleteTask,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.labels.some((l) => l.toLowerCase().includes(search.toLowerCase()));
    const matchesProject = projectFilter === 'ALL' || t.projectId === projectFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesProject && matchesPriority;
  });

  const columns: Array<{ status: TaskStatus; label: string; color: string }> = [
    { status: 'TODO', label: 'To Do', color: 'border-slate-700' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-indigo-500' },
    { status: 'REVIEW', label: 'Code Review', color: 'border-amber-500' },
    { status: 'DONE', label: 'Completed', color: 'border-emerald-500' },
  ];

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'TODO':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'REVIEW';
      case 'REVIEW':
        return 'DONE';
      case 'DONE':
        return null;
    }
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    switch (current) {
      case 'DONE':
        return 'REVIEW';
      case 'REVIEW':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'TODO';
      case 'TODO':
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-cyan-400" />
            <span>Task Management & Sprints</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize engineering stories, backlog items, and code deliverables
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenCreateTask}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, description, or label..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.key} - {p.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col space-y-3"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {col.label}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-3 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-[11px] font-mono text-slate-600">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const next = getNextStatus(task.status);
                      const prev = getPrevStatus(task.status);
                      return (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2.5 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono text-slate-500">{task.id}</span>
                            <PriorityBadge priority={task.priority} />
                          </div>

                          <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                            {task.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Labels */}
                          <div className="flex flex-wrap gap-1">
                            {task.labels.map((l) => (
                              <span
                                key={l}
                                className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800"
                              >
                                #{l}
                              </span>
                            ))}
                          </div>

                          {/* Footer with Assignee and Status Shift Buttons */}
                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[9px] text-slate-300">
                                {task.assignee?.name?.charAt(0) || 'U'}
                              </div>
                              <span className="truncate max-w-[80px]">{task.assignee?.name || 'Unassigned'}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {prev && (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, prev)}
                                  title={`Move to ${prev}`}
                                  className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {next && (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, next)}
                                  title={`Move to ${next}`}
                                  className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-indigo-400"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {currentUser.role === 'ADMIN' && (
                                <button
                                  onClick={() => onDeleteTask(task.id)}
                                  title="Delete task"
                                  className="p-1 rounded hover:bg-slate-800 text-slate-600 hover:text-rose-400 ml-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List Table View */}
      {viewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Task ID</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {t.id}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <div className="font-semibold text-slate-200">{t.title}</div>
                      <div className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{t.description}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                      {t.assignee?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {t.dueDate || 'No due date'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as TaskStatus)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 font-mono text-[10px]"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
