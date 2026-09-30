import React, { useState } from 'react';
import { Terminal, Lock, Mail, User as UserIcon, Building2, ArrowRight } from 'lucide-react';
import { authService } from '../services/auth/authService';
import { User, UserRole } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigate,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DEVELOPER');
  const [department, setDepartment] = useState('Core Engineering');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await authService.register({
        name,
        email,
        password,
        role,
        department,
      });
      onRegisterSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Terminal className="w-5 h-5 text-indigo-100" />
            </div>
            <span className="font-bold text-xl text-white tracking-wider">NEXUS AI</span>
          </div>
          <p className="text-xs font-mono text-slate-400">Join Platform Engineering Workbench</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Create Developer Account</h2>
            <p className="text-xs text-slate-400 mt-1">Configure your engineer credentials and initial authorization role</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="jordan.m@nexusai.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-md transition-all focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-indigo-400 hover:text-indigo-300 font-medium ml-1 underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
