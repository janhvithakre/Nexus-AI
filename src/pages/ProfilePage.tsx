import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Building2,
  ShieldCheck,
  Github,
  Calendar,
  CheckSquare,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';
import { User, Task } from '../types';
import { mockStore } from '../data/mockStore';

interface ProfilePageProps {
  currentUser: User;
  tasks: Task[];
  onUpdateUser: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  tasks,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [department, setDepartment] = useState(currentUser.department || 'Core Platform Engineering');
  const [githubUsername, setGithubUsername] = useState(currentUser.githubUsername || 'alexchen-dev');
  const [saved, setSaved] = useState(false);

  const assignedTasks = tasks.filter((t) => t.assignee?.id === currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = mockStore.updateProfile({
      name,
      department,
      githubUsername,
    });
    onUpdateUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <UserIcon className="w-6 h-6 text-indigo-400" />
          <span>Developer Profile & Telemetry</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your engineering identity, organizational department, and assigned deliverables
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-center">
          <div className="w-20 h-20 rounded-full mx-auto overflow-hidden bg-slate-800 border-2 border-indigo-500/60 flex items-center justify-center text-xl font-bold text-slate-200 shadow-md">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>

          <div>
            <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
            <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentUser.role} ROLE</span>
          </div>

          <div className="pt-4 border-t border-slate-800 text-left text-xs font-mono space-y-2 text-slate-400">
            <div className="flex items-center justify-between">
              <span>Department:</span>
              <span className="text-slate-200">{currentUser.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GitHub:</span>
              <span className="text-indigo-400">@{currentUser.githubUsername}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Member Since:</span>
              <span className="text-slate-200">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Details & Assigned Deliverables */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Edit Developer Attributes
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Username</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : 'Update Profile'}</span>
              </button>
            </div>
          </form>

          {/* Assigned Sprint Tasks */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Assigned Deliverables ({assignedTasks.length})</span>
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            </h3>

            {assignedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono py-2">No active tasks assigned.</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {assignedTasks.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block">{t.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {t.id} • {t.projectName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
