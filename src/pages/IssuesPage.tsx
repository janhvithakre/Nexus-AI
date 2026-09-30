import React, { useState } from 'react';
import {
  AlertCircle,
  Plus,
  Search,
  Sparkles,
  MessageSquare,
  Send,
  Terminal,
  Clock,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Issue, Project, User, IssueStatus, IssueSeverity, EngineeringPlan } from '../types';
import { SeverityBadge, PriorityBadge } from '../components/common/Badge';
import { aiService } from '../services/ai/aiService';
import { EngineeringPlanModal } from '../components/issues/EngineeringPlanModal';

interface IssuesPageProps {
  issues: Issue[];
  projects: Project[];
  currentUser: User;
  onOpenCreateIssue: () => void;
  onUpdateIssueStatus: (issueId: string, status: IssueStatus) => void;
  onAddComment: (issueId: string, content: string) => void;
  onAttachPlan: (issueId: string, plan: EngineeringPlan) => void;
}

export const IssuesPage: React.FC<IssuesPageProps> = ({
  issues,
  projects,
  currentUser,
  onOpenCreateIssue,
  onUpdateIssueStatus,
  onAddComment,
  onAttachPlan,
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(issues[0]?.id ?? null);
  const [newComment, setNewComment] = useState('');
  
  // AI Plan Generation State
  const [selectedPlan, setSelectedPlan] = useState<EngineeringPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const filtered = issues.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      (i.stackTrace && i.stackTrace.toLowerCase().includes(search.toLowerCase()));
    const matchesSeverity = severityFilter === 'ALL' || i.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleGeneratePlan = async (issue: Issue) => {
    if (issue.engineeringPlan) {
      setSelectedPlan(issue.engineeringPlan);
      setIsPlanModalOpen(true);
      return;
    }

    setIsGeneratingPlan(true);
    setIsPlanModalOpen(true);
    setSelectedPlan(null);

    try {
      const plan = await aiService.planIssue({
        issueTitle: issue.title,
        issueDescription: `${issue.description}\nEnvironment: ${issue.environment || ''}`,
        projectId: issue.projectId,
      });
      setSelectedPlan(plan);
      onAttachPlan(issue.id, plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleCommentSubmit = (issueId: string) => {
    if (!newComment.trim()) return;
    onAddComment(issueId, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <AlertCircle className="w-6 h-6 text-rose-400" />
            <span>Incident & Issue Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track runtime exceptions, database failures, security regressions, and synthesize AI engineering plans
          </p>
        </div>

        <button
          onClick={onOpenCreateIssue}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>File Issue</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search exceptions, stack traces, or tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">P0 Critical</option>
            <option value="HIGH">P1 High</option>
            <option value="MEDIUM">P2 Medium</option>
            <option value="LOW">P3 Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filtered.map((issue) => {
          const isExpanded = expandedIssueId === issue.id;
          return (
            <div
              key={issue.id}
              className={`rounded-xl border transition-all ${
                isExpanded ? 'bg-slate-900/90 border-slate-700 shadow-md' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Issue Summary Row */}
              <div
                onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500 shrink-0 mt-0.5 sm:mt-0">
                    {issue.id}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <SeverityBadge severity={issue.severity} />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {issue.status}
                      </span>
                      {issue.projectName && (
                        <span className="text-[10px] font-mono text-indigo-400">
                          [{issue.projectName}]
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 hover:text-indigo-300 transition-colors">
                      {issue.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{issue.comments.length}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGeneratePlan(issue);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-800/80 text-xs font-mono font-semibold text-indigo-300 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{issue.engineeringPlan ? 'View AI Plan' : 'Plan with AI'}</span>
                  </button>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-5 animate-in fade-in duration-150">
                  {/* Problem Description */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1">
                      Description & Reproduction
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                      {issue.description}
                    </p>
                  </div>

                  {/* Environment & Stack Trace */}
                  {issue.stackTrace && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          Runtime Stack Trace ({issue.environment || 'Server Runtime'})
                        </h4>
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto whitespace-pre leading-relaxed">
                        {issue.stackTrace}
                      </pre>
                    </div>
                  )}

                  {/* Status Toggle Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">Current Status:</span>
                      {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as IssueStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => onUpdateIssueStatus(issue.id, st)}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold transition-colors ${
                            issue.status === st
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="text-slate-500 font-mono text-[11px]">
                      Reported by {issue.reporter.name} • {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Comments Thread */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                      Engineering Discussion ({issue.comments.length})
                    </h4>

                    {issue.comments.length > 0 ? (
                      <div className="space-y-2">
                        {issue.comments.map((comm) => (
                          <div key={comm.id} className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-200">{comm.author.name}</span>
                              <span className="text-slate-500 font-mono">{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{comm.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-mono">No comments logged yet.</p>
                    )}

                    {/* New Comment Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add technical comment or reproduction note..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCommentSubmit(issue.id);
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(issue.id)}
                        className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Engineering Plan Modal */}
      <EngineeringPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plan={selectedPlan}
        isLoading={isGeneratingPlan}
      />
    </div>
  );
};
