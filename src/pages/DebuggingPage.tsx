import React, { useState } from 'react';
import {
  Bug,
  Sparkles,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { DebugSession, Project } from '../types';
import { aiService } from '../services/ai/aiService';
import { CodeEditor } from '../components/common/CodeEditor';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface DebuggingPageProps {
  projects: Project[];
  debugSessions: DebugSession[];
  onSaveSession: (session: DebugSession) => void;
}

const DEBUG_SAMPLES: Record<
  string,
  {
    name: string;
    errorMessage: string;
    environment: string;
    expectedBehavior: string;
    actualBehavior: string;
    stackTrace: string;
    codeSnippet: string;
  }
> = {
  lazyInit: {
    name: 'Hibernate LazyInitializationException (Spring Data JPA)',
    errorMessage: 'org.hibernate.LazyInitializationException: could not initialize proxy [com.nexus.entity.Project#42] - no Session',
    environment: 'Spring Boot 3.3.0, PostgreSQL 16, Java 21, Hibernate 6.5',
    expectedBehavior: 'Serialize UserDTO containing project counts or eager collection without throwing session error.',
    actualBehavior: 'Throws LazyInitializationException when accessing user.getProjects() after repository session has closed.',
    stackTrace: `org.hibernate.LazyInitializationException: could not initialize proxy [com.nexus.entity.Project#42] - no Session
    at org.hibernate.proxy.AbstractLazyInitializer.initialize(AbstractLazyInitializer.java:169)
    at com.nexus.service.UserService.getUserWithProjects(UserService.java:87)
    at com.nexus.controller.UserController.getUserProfile(UserController.java:45)`,
    codeSnippet: `@GetMapping("/users/{id}")
public UserDTO getUser(@PathVariable String id) {
    User user = userRepository.findById(id).orElseThrow();
    // Accessing lazy relationship outside active session boundary:
    return new UserDTO(user.getName(), user.getProjects().size());
}`,
  },
  redisFailover: {
    name: 'Lettuce Redis Cluster Failover Timeout',
    errorMessage: 'io.lettuce.core.RedisConnectionException: Unable to connect to redis-cluster-node-01:6379',
    environment: 'Redis 7.2 Cluster, AWS ElastiCache, Lettuce 6.3, Spring Boot',
    expectedBehavior: 'Driver should automatically discover promoted master replica within 2 seconds without dropping queries.',
    actualBehavior: 'Driver retains stale node IP and drops client requests with connection timeouts for 60 seconds.',
    stackTrace: `io.lettuce.core.RedisConnectionException: Unable to connect to redis-cluster-node-01:6379
    at io.lettuce.core.RedisClient.connect(RedisClient.java:214)
    at com.nexus.cache.RedisClusterManager.acquireLock(RedisClusterManager.java:94)`,
    codeSnippet: `@Bean
public RedisClusterClient redisClusterClient() {
    RedisURI redisUri = RedisURI.create("redis://redis-cluster-node-01:6379");
    // Missing ClusterTopologyRefreshOptions with adaptive refresh triggers
    return RedisClusterClient.create(redisUri);
}`,
  },
};

export const DebuggingPage: React.FC<DebuggingPageProps> = ({
  projects,
  debugSessions,
  onSaveSession,
}) => {
  const [selectedSample, setSelectedSample] = useState('lazyInit');
  const [errorMessage, setErrorMessage] = useState(DEBUG_SAMPLES.lazyInit.errorMessage);
  const [environment, setEnvironment] = useState(DEBUG_SAMPLES.lazyInit.environment);
  const [expectedBehavior, setExpectedBehavior] = useState(DEBUG_SAMPLES.lazyInit.expectedBehavior);
  const [actualBehavior, setActualBehavior] = useState(DEBUG_SAMPLES.lazyInit.actualBehavior);
  const [stackTrace, setStackTrace] = useState(DEBUG_SAMPLES.lazyInit.stackTrace);
  const [codeSnippet, setCodeSnippet] = useState(DEBUG_SAMPLES.lazyInit.codeSnippet);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');

  const [isDebugging, setIsDebugging] = useState(false);
  const [activeSession, setActiveSession] = useState<DebugSession | null>(debugSessions[0] || null);
  const [copiedFix, setCopiedFix] = useState(false);

  const handleSampleChange = (key: string) => {
    setSelectedSample(key);
    const s = DEBUG_SAMPLES[key];
    if (s) {
      setErrorMessage(s.errorMessage);
      setEnvironment(s.environment);
      setExpectedBehavior(s.expectedBehavior);
      setActualBehavior(s.actualBehavior);
      setStackTrace(s.stackTrace);
      setCodeSnippet(s.codeSnippet);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorMessage.trim()) return;

    setIsDebugging(true);
    try {
      const session = await aiService.debugIssue({
        errorMessage: errorMessage.trim(),
        stackTrace: stackTrace.trim(),
        codeSnippet: codeSnippet.trim(),
        environment: environment.trim(),
        expectedBehavior: expectedBehavior.trim(),
        actualBehavior: actualBehavior.trim(),
        projectId,
      });

      setActiveSession(session);
      onSaveSession(session);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDebugging(false);
    }
  };

  const handleCopyFix = () => {
    if (!activeSession?.suggestedFix) return;
    navigator.clipboard.writeText(activeSession.suggestedFix);
    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Bug className="w-6 h-6 text-rose-400" />
            <span>AI Debugging & Root-Cause Workbench</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Diagnose stack traces, persistence exceptions, concurrency faults, and receive concrete code patches
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Scenario:</span>
          <select
            value={selectedSample}
            onChange={(e) => handleSampleChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="lazyInit">Hibernate LazyInitializationException</option>
            <option value="redisFailover">Lettuce Redis Cluster Failover Timeout</option>
          </select>
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Form: Input Error Context */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Error Message / Exception Type *
              </label>
              <input
                type="text"
                required
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="e.g. org.hibernate.LazyInitializationException"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Runtime Environment
                </label>
                <input
                  type="text"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  placeholder="e.g. Java 21, Spring Boot 3.3, PostgreSQL 16"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Target Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Stack Trace
              </label>
              <textarea
                rows={4}
                value={stackTrace}
                onChange={(e) => setStackTrace(e.target.value)}
                placeholder="Paste full stack trace here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Relevant Code Snippet
              </label>
              <CodeEditor
                value={codeSnippet}
                onChange={setCodeSnippet}
                language="java"
                minHeight="140px"
                maxHeight="220px"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Expected Behavior
                </label>
                <input
                  type="text"
                  value={expectedBehavior}
                  onChange={(e) => setExpectedBehavior(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Actual Behavior
                </label>
                <input
                  type="text"
                  value={actualBehavior}
                  onChange={(e) => setActualBehavior(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isDebugging}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-all focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isDebugging ? 'Diagnosing Root Cause...' : 'Diagnose Root Cause & Suggest Patch'}</span>
            </button>
          </div>
        </form>

        {/* Right Panel: Diagnosis & Resolution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Root Cause & Recommended Patch
            </span>

            {activeSession && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                DIAGNOSIS ACTIVE
              </span>
            )}
          </div>

          {isDebugging ? (
            <div className="p-12 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <LoadingSpinner size="lg" text="Analyzing stack frames, thread traces, and persistence context..." />
            </div>
          ) : activeSession ? (
            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
              {/* Probable Cause Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Probable Root Cause
                </span>
                <p className="text-xs font-medium text-slate-100">{activeSession.probableCause}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{activeSession.explanation}</p>
              </div>

              {/* Debugging Steps */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
                  Step-by-Step Triage Instructions
                </span>
                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside font-mono">
                  {activeSession.debuggingSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Suggested Code Fix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recommended Code Patch
                  </span>
                  <button
                    onClick={handleCopyFix}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
                  >
                    {copiedFix ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFix ? 'Copied' : 'Copy Patch'}</span>
                  </button>
                </div>
                <CodeEditor
                  value={activeSession.suggestedFix}
                  language="java"
                  readOnly
                  minHeight="180px"
                  maxHeight="300px"
                />
              </div>

              {/* Prevention Advice */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                  Prevention & Architecture Hygiene
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeSession.preventionAdvice}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-slate-900 border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
              Fill in the error details on the left and click "Diagnose Root Cause" to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
