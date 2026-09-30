import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Project, User } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreate: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'openIssuesCount' | 'pendingTasksCount' | 'recentReviewsCount'>) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Project['category']>('BACKEND');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [defaultBranch, setDefaultBranch] = useState('main');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    onCreate({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      category,
      repositoryUrl: repositoryUrl.trim() || `https://github.com/nexus-org/${name.toLowerCase().replace(/\s+/g, '-')}`,
      defaultBranch,
      health: 'HEALTHY',
      members: [
        {
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          role: currentUser.role,
          joinedAt: new Date().toISOString(),
        },
      ],
    });

    setName('');
    setKey('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Engineering Project"
      subtitle="Configure a new software repository, service, or client module"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Nexus Core Service"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!key) {
                  setKey(e.target.value.slice(0, 4).toUpperCase());
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Key *</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. CORE"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows={3}
            placeholder="Architecture scope, runtime specifications, and primary responsibilities..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="BACKEND">Backend Microservice (Spring Boot / Java)</option>
              <option value="FRONTEND">Frontend SPA (React / TypeScript)</option>
              <option value="FULLSTACK">Full-Stack Platform</option>
              <option value="INFRASTRUCTURE">Infrastructure & Cache (Postgres / Redis)</option>
              <option value="AI_SERVICE">AI Service & Model Gateway</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Git Branch</label>
            <input
              type="text"
              value={defaultBranch}
              onChange={(e) => setDefaultBranch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Repository URL</label>
          <input
            type="url"
            placeholder="https://github.com/organization/repository"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500/50"
          >
            Initialize Project
          </button>
        </div>
      </form>
    </Modal>
  );
};
