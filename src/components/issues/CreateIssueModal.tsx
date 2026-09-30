import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Issue, Project, User, IssueSeverity, TaskPriority } from '../../types';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  teamMembers: User[];
  currentUser: User;
  defaultProjectId?: string;
  onCreate: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  projects,
  teamMembers,
  currentUser,
  defaultProjectId,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || (projects[0]?.id ?? ''));
  const [severity, setSeverity] = useState<IssueSeverity>('HIGH');
  const [priority, setPriority] = useState<TaskPriority>('HIGH');
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [environment, setEnvironment] = useState('Spring Boot 3.3, Java 21, PostgreSQL 16');
  const [stackTrace, setStackTrace] = useState('');
  const [labelsStr, setLabelsStr] = useState('bug, exception');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    const assignee = teamMembers.find((m) => m.id === assigneeId);
    const labels = labelsStr
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    onCreate({
      title: title.trim(),
      description: description.trim(),
      projectId,
      severity,
      priority,
      status: 'OPEN',
      assignee,
      reporter: currentUser,
      labels,
      environment: environment.trim(),
      stackTrace: stackTrace.trim() || undefined,
    });

    setTitle('');
    setDescription('');
    setStackTrace('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="File Issue / Incident"
      subtitle="Report defect, runtime exception, or regression with environment telemetry"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Summary *</label>
          <input
            type="text"
            required
            placeholder="e.g. LazyInitializationException in UserService during DTO serialization"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project *</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.key} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="CRITICAL">P0 Critical (Outage / Breach)</option>
              <option value="HIGH">P1 High (Core flow blocked)</option>
              <option value="MEDIUM">P2 Medium (Degraded behavior)</option>
              <option value="LOW">P3 Low (Minor cosmetic/log)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="CRITICAL">Immediate</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Environment</label>
            <input
              type="text"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Description</label>
          <textarea
            rows={3}
            placeholder="Observed behavior, reproduction steps, expected outcome..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Stack Trace or Logs (Optional)</label>
          <textarea
            rows={4}
            placeholder="Paste exception stack trace, error logs, or curl request..."
            value={stackTrace}
            onChange={(e) => setStackTrace(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors focus:ring-2 focus:ring-rose-500/50"
          >
            Log Issue
          </button>
        </div>
      </form>
    </Modal>
  );
};
