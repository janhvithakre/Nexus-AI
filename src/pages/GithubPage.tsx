import React, { useState } from 'react';
import {
  Github,
  GitBranch,
  GitPullRequest,
  GitCommit,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { Repository, Commit, PullRequest } from '../types';
import { githubService, RepoAnalysisResult } from '../services/github/githubService';

interface GithubPageProps {
  repositories: Repository[];
  commits: Commit[];
  pullRequests: PullRequest[];
}

export const GithubPage: React.FC<GithubPageProps> = ({
  repositories,
  commits,
  pullRequests,
}) => {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(repositories[0]?.id || '');
  const [analysisResult, setAnalysisResult] = useState<RepoAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'commits' | 'prs' | 'analysis'>('overview');

  const selectedRepo = repositories.find((r) => r.id === selectedRepoId) || repositories[0];
  const repoCommits = commits.filter((c) => c.repositoryId === selectedRepo?.id);
  const repoPRs = pullRequests.filter((pr) => pr.repositoryId === selectedRepo?.id);

  const handleRunAnalysis = async () => {
    if (!selectedRepo) return;
    setIsAnalyzing(true);
    try {
      const res = await githubService.analyzeRepository(selectedRepo.name);
      setAnalysisResult(res);
      setActiveTab('analysis');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Explicit Mock / Demo Mode Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-900/60 border border-amber-700/60 flex items-center justify-center text-amber-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                MOCK / DEMO DATA INTEGRATION ACTIVE
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-900/80 text-amber-300 border border-amber-700">
                OAUTH PENDING
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              In accordance with engineering integrity standards, GitHub data displayed below is realistic simulated metadata. The architecture provides clean service abstractions (<code>/services/github/githubService.ts</code>) ready for GitHub OAuth and Octokit REST integration.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('GitHub OAuth App registration is prepared for production backend deployment.')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shrink-0 cursor-pointer"
        >
          <Github className="w-4 h-4" />
          <span>Connect GitHub App</span>
        </button>
      </div>

      {/* Header & Repo Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Github className="w-6 h-6 text-slate-100" />
            <span>GitHub Repository Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Telemetry, commit history, pull request status, and automated repository security analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedRepoId}
            onChange={(e) => {
              setSelectedRepoId(e.target.value);
              setAnalysisResult(null);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {repositories.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fullName}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Analyzing Repo...' : 'Analyze Repo'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: Github },
          { id: 'commits', label: `Commits (${repoCommits.length})`, icon: GitCommit },
          { id: 'prs', label: `Pull Requests (${repoPRs.length})`, icon: GitPullRequest },
          { id: 'analysis', label: 'AI Health Analysis', icon: Sparkles },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && selectedRepo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">{selectedRepo.fullName}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {selectedRepo.defaultBranch}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedRepo.description}</p>
              <div className="pt-2 flex items-center gap-6 text-xs font-mono text-slate-400">
                <span>⭐ {selectedRepo.starsCount} stars</span>
                <span>🍴 {selectedRepo.forksCount} forks</span>
                <span>⚠ {selectedRepo.openIssuesCount} issues</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Recent Commits
              </h4>
              <div className="divide-y divide-slate-800">
                {repoCommits.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-indigo-400">{c.sha}</span>
                      <span className="text-slate-300 truncate">{c.message}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] shrink-0">{c.author.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Pull Requests ({repoPRs.length})
              </h4>
              <div className="space-y-2">
                {repoPRs.map((pr) => (
                  <div key={pr.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-slate-400">#{pr.number}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {pr.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-200 leading-snug">{pr.title}</p>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {pr.sourceBranch} → {pr.targetBranch}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Commits */}
      {activeTab === 'commits' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          {repoCommits.map((c) => (
            <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-indigo-400 font-bold">{c.sha}</span>
                  <span className="font-medium text-slate-200">{c.message}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3">
                  <span>Author: {c.author.name} ({c.author.email})</span>
                  <span>•</span>
                  <span>Branch: {c.branch}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-emerald-400">+{c.additions}</span>
                <span className="text-rose-400">-{c.deletions}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Pull Requests */}
      {activeTab === 'prs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          {repoPRs.map((pr) => (
            <div key={pr.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 font-bold">#{pr.number}</span>
                  <h4 className="text-sm font-semibold text-slate-200">{pr.title}</h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {pr.reviewStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{pr.description}</p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span>By {pr.author.name}</span>
                <span>•</span>
                <span>{pr.sourceBranch} → {pr.targetBranch}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: AI Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          {analysisResult ? (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Repository Health & Security Telemetry: {analysisResult.repositoryName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Automated code inspection and vulnerability assessment</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {analysisResult.codeHealthScore}/100
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500">HEALTH SCORE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">TEST COVERAGE</span>
                  <span className="text-slate-200 font-semibold">{analysisResult.testCoverageEstimate}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">RISK LEVEL</span>
                  <span className="text-emerald-400 font-semibold">{analysisResult.securityRiskLevel}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-slate-500 block text-[10px]">CI/CD PIPELINE</span>
                  <span className="text-cyan-400 font-semibold">{analysisResult.ciCdPipelineStatus}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-2">
                  Key Recommendations
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysisResult.topRecommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-xl space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-200">Run Automated Repository Health Inspection</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Evaluates branch protections, test coverage, and automated static security posture.
              </p>
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Execute Analysis'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
