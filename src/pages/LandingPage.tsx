import React from 'react';
import {
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Bug,
  FileCode,
  BookOpen,
  ArrowRight,
  Database,
  Lock,
  GitBranch,
  Bot,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Terminal className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wider text-white">NEXUS</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#architecture" className="hover:text-white transition-colors">Spring & PostgreSQL Architecture</a>
            <a href="#workflow" className="hover:text-white transition-colors">Engineering Workflow</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/50"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 overflow-hidden border-b border-slate-900">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-mono text-indigo-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>ENTERPRISE DEVELOPER PRODUCTIVITY PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Build Better Software <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">
              With AI.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            NEXUS AI brings project management, code intelligence, debugging, documentation, and developer assistance into one engineering workspace.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Open Developer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/code-review')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Try AI Code Review</span>
            </button>
          </div>

          {/* Architecture Badge Line */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-emerald-400" /> Java 21 / Spring Boot 3.3 REST</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-cyan-400" /> PostgreSQL 16 Persistence</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-amber-400" /> Stateless RS256 JWT Auth</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Gemini 3.8 Intelligence</span>
          </div>
        </div>

        {/* Hero Preview Card */}
        <div className="relative max-w-5xl mx-auto mt-12 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-400 text-[11px]">nexus-engineering-workbench // active-session</span>
            </div>
            <span className="font-mono text-emerald-400 text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CONNECTED: POSTGRESQL & SPRING BACKEND ADAPTER
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/50">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold mb-2">
                <FileCode className="w-4 h-4" />
                <span>AI CODE REVIEW</span>
              </div>
              <div className="text-xs text-slate-300 font-mono space-y-1">
                <p className="text-slate-500">// Static analysis & AST parsing</p>
                <p className="text-rose-400">✗ Insecure JWT parsing detected (alg: none)</p>
                <p className="text-emerald-400">✓ Suggested RS256 verifyWith() patch</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold mb-2">
                <Bug className="w-4 h-4" />
                <span>AI DEBUGGING ASSISTANT</span>
              </div>
              <div className="text-xs text-slate-300 font-mono space-y-1">
                <p className="text-slate-500">// Stack trace root-cause engine</p>
                <p className="text-amber-400">⚠ LazyInitializationException</p>
                <p className="text-indigo-300">→ @EntityGraph attributePaths added</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold mb-2">
                <Bot className="w-4 h-4" />
                <span>PROJECT RAG INTELLIGENCE</span>
              </div>
              <div className="text-xs text-slate-300 font-mono space-y-1">
                <p className="text-slate-500">// Contextual architecture query</p>
                <p className="text-slate-200">"Where is token blacklist handled?"</p>
                <p className="text-cyan-300">→ RedisClusterManager.java:94</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 AI Engineering Pillars */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400">
            ENGINEERING CAPABILITIES
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Integrated AI Engineering Capabilities
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Engineered specifically for software engineers. No generic chatbot boilerplate—just deep technical intelligence integrated into your daily workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('/code-review')}
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">1. AI Code Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze code for correctness, security vulnerabilities, performance bottlenecks, readability, code smells, and best practices with line-level context and diff improvements.
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-indigo-400 font-mono font-medium pt-2">
              Launch Code Review →
            </span>
          </div>

          <div
            onClick={() => onNavigate('/debugging')}
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <Bug className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">2. AI Debugging Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste stack traces, error messages, and environment context to diagnose probable cause, step-by-step reproduction instructions, suggested code patches, and prevention advice.
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-mono font-medium pt-2">
              Open Debugging Workbench →
            </span>
          </div>

          <div
            onClick={() => onNavigate('/ai-assistant')}
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">3. Project Knowledge (RAG)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask deep architectural and implementation questions grounded in your project's README, API specs, database schemas, and codebase rather than generic LLM answers.
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono font-medium pt-2">
              Explore Project Assistant →
            </span>
          </div>

          <div
            onClick={() => onNavigate('/issues')}
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">4. AI Issue Planner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Convert raw issue tickets into complete cross-stack engineering execution plans: database Flyway migrations, Spring Boot service changes, frontend updates, and security requirements.
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-purple-400 font-mono font-medium pt-2">
              View Issue Planner →
            </span>
          </div>

          <div
            onClick={() => onNavigate('/documentation')}
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">5. AI Documentation Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate complete architecture specifications, OpenAPI REST contracts, developer onboarding manuals, and setup documentation directly into project docs with one click.
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-mono font-medium pt-2">
              Generate Tech Docs →
            </span>
          </div>

          <div
            onClick={() => onNavigate('/github')}
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">6. GitHub Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prepared for GitHub OAuth repository sync. Inspect branches, commits, pull request statuses, and automated repository health scores (with clear demo/mock indicators).
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-mono font-medium pt-2">
              Inspect Repositories →
            </span>
          </div>
        </div>
      </section>

      {/* Production Architecture Roadmap Section */}
      <section id="architecture" className="py-16 px-6 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-xs font-mono text-emerald-300">
              PRODUCTION ARCHITECTURE SPECIFICATION
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Designed for Java, Spring Boot & PostgreSQL
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              The frontend is decoupled from mock data through clean REST service abstractions (/services/api/), ready to connect directly to a Java Spring Boot backend without refactoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-indigo-400 font-semibold flex items-center gap-1.5">
                <Server className="w-4 h-4" />
                <span>Backend Framework</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">Java 21 & Spring Boot 3.3</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stateless REST controllers, Spring Security 6 filter chain, Hibernate ORM, and Actuator health metrics.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                <span>Relational Storage</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">PostgreSQL 16 & Flyway</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ACID transactional guarantees, versioned Flyway database migrations, and HikariCP connection pooling.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Authentication & RBAC</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">Stateless RS256 JWT</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Roles (ADMIN, DEVELOPER, VIEWER) enforced via Spring Security @PreAuthorize method annotations.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>AI Orchestration</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">Secure Server Proxy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Server-side Gemini 3.8 calls with zero browser credential leakage and structured JSON response schemas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Workflow */}
      <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            WORKFLOW LIFECYCLE
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            How Engineering Teams Use NEXUS AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-mono text-2xl font-bold text-indigo-400">01</span>
            <h4 className="text-sm font-semibold text-white">Project Initialization</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create and manage software repositories, assign engineering roles, and track repository health metrics.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-mono text-2xl font-bold text-indigo-400">02</span>
            <h4 className="text-sm font-semibold text-white">Sprint & Issue Triage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize tasks across Kanban states and synthesize structured architectural implementation plans for issues.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-mono text-2xl font-bold text-indigo-400">03</span>
            <h4 className="text-sm font-semibold text-white">AI Review & Debug</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Perform deep static security reviews, analyze runtime exceptions with stack traces, and generate unit tests.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="font-mono text-2xl font-bold text-indigo-400">04</span>
            <h4 className="text-sm font-semibold text-white">Knowledge Synthesis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate architecture documentation, API specifications, and query project architecture with RAG assistant.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-300">NEXUS AI Developer Platform</span>
            <span>—</span>
            <span>Enterprise Engineering Workbench</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/dashboard')} className="hover:text-slate-300 transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate('/code-review')} className="hover:text-slate-300 transition-colors">
              Code Review
            </button>
            <button onClick={() => onNavigate('/debugging')} className="hover:text-slate-300 transition-colors">
              Debugging
            </button>
            <button onClick={() => onNavigate('/documentation')} className="hover:text-slate-300 transition-colors">
              Architecture Docs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

function Server({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}
