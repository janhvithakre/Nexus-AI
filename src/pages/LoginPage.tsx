import React, { useState } from 'react';
import { Terminal, Lock, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { authService } from '../services/auth/authService';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('alex.chen@nexusai.dev');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await authService.login({ email, password });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('••••••••••••');
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await authService.sendPasswordResetEmail(forgotEmail);
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
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
          <p className="text-xs font-mono text-slate-400">Enterprise Developer Productivity Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Sign In to Workbench</h2>
            <p className="text-xs text-slate-400 mt-1">Authenticate with your engineering credentials or use demo personas below</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="developer@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-md transition-all focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying RSA JWT...' : 'Authenticate & Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-mono text-slate-500 block uppercase tracking-wider">
              One-Click Demo Personas:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.chen@nexusai.dev')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <span className="text-xs font-semibold text-slate-200 block truncate">Alex (Admin)</span>
                <span className="text-[10px] font-mono text-indigo-400 block">Lead Arch</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.j@nexusai.dev')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <span className="text-xs font-semibold text-slate-200 block truncate">Sarah (Dev)</span>
                <span className="text-[10px] font-mono text-emerald-400 block">Backend</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('elena.r@nexusai.dev')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <span className="text-xs font-semibold text-slate-200 block truncate">Elena (Viewer)</span>
                <span className="text-[10px] font-mono text-purple-400 block">Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          New engineer?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-indigo-400 hover:text-indigo-300 font-medium ml-1 underline cursor-pointer"
          >
            Register developer account
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reset Engineering Password</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your corporate email. In the Java Spring Boot architecture, a signed, 15-minute single-use reset token will be dispatched to your inbox.
            </p>

            {forgotSent ? (
              <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Password reset token dispatched successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="developer@nexusai.dev"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                  >
                    Send Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
