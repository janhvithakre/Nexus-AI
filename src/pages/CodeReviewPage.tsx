import React, { useState } from 'react';
import {
  FileCode,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  History,
  Code2,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import { CodeEditor } from '../components/common/CodeEditor';
import { aiService } from '../services/ai/aiService';
import { CodeReviewResult, CodeReviewFinding, Project } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface CodeReviewPageProps {
  projects: Project[];
  codeReviews: CodeReviewResult[];
  onSaveReview: (review: CodeReviewResult) => void;
}

const TEMPLATES: Record<string, { name: string; language: string; code: string }> = {
  jwtSecurity: {
    name: 'Insecure JWT Authentication Filter (Java)',
    language: 'java',
    code: `public class JwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // Insecure: parsing payload without verifying RS256 signature
            Claims claims = Jwts.parser().parseClaimsJwt(token.substring(0, token.lastIndexOf('.') + 1)).getBody();
            String username = claims.getSubject();
            SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>())
            );
        }
        filterChain.doFilter(request, response);
    }
}`,
  },
  sqlInjection: {
    name: 'SQL Concatenation & Resource Leak (Java)',
    language: 'java',
    code: `public User getUserById(String tenantId, String userId) throws SQLException {
    Connection conn = dataSource.getConnection();
    Statement stmt = conn.createStatement();
    // Vulnerable to SQL Injection and missing connection close
    String query = "SELECT * FROM users WHERE tenant_id = '" + tenantId + "' AND id = '" + userId + "'";
    ResultSet rs = stmt.executeQuery(query);
    if (rs.next()) {
        return new User(rs.getString("id"), rs.getString("name"), rs.getString("email"));
    }
    return null;
}`,
  },
  reactRaceCondition: {
    name: 'React useEffect Data Race Condition (TSX)',
    language: 'typescript',
    code: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Missing cleanup/abort controller: out-of-order race condition on rapid userId change
    fetch('/api/users/' + userId)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  return <div>{user?.name}</div>;
}`,
  },
};

export const CodeReviewPage: React.FC<CodeReviewPageProps> = ({
  projects,
  codeReviews,
  onSaveReview,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('jwtSecurity');
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState(TEMPLATES.jwtSecurity.code);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeReview, setActiveReview] = useState<CodeReviewResult | null>(codeReviews[0] || null);
  const [copiedImproved, setCopiedImproved] = useState(false);

  const handleTemplateChange = (key: string) => {
    setSelectedTemplate(key);
    const tmpl = TEMPLATES[key];
    if (tmpl) {
      setLanguage(tmpl.language);
      setCode(tmpl.code);
    }
  };

  const handleTriggerReview = async () => {
    if (!code.trim()) return;
    setIsReviewing(true);

    try {
      const result = await aiService.reviewCode({
        code,
        language,
        projectId,
        context: 'Enterprise Microservice Code Review',
      });
      setActiveReview(result);
      onSaveReview(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCopyImproved = () => {
    if (!activeReview?.improvedCode) return;
    navigator.clipboard.writeText(activeReview.improvedCode);
    setCopiedImproved(true);
    setTimeout(() => setCopiedImproved(false), 2000);
  };

  const getSeverityBadgeClass = (sev: CodeReviewFinding['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'HIGH':
        return 'bg-red-950/70 text-red-300 border-red-800/80';
      case 'MEDIUM':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/80';
      case 'LOW':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileCode className="w-6 h-6 text-indigo-400" />
            <span>AI Code Review Workspace</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated AST analysis, security vulnerability detection, complexity profiling, and production refactoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Template Loader */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Sample:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="jwtSecurity">Insecure JWT Token Filter (Java)</option>
              <option value="sqlInjection">SQL Injection & Resource Leak (Java)</option>
              <option value="reactRaceCondition">React Race Condition (TypeScript)</option>
            </select>
          </div>

          <button
            onClick={handleTriggerReview}
            disabled={isReviewing || !code.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isReviewing ? 'Analyzing AST...' : 'Run AI Review'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Control Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Col: Code Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
                Source Code
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none"
              >
                <option value="java">Java (Spring Boot)</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="sql">SQL / DDL</option>
                <option value="go">Go</option>
              </select>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              {code.split('\n').length} lines
            </span>
          </div>

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            minHeight="380px"
            maxHeight="520px"
          />

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Server Model: Gemini 3.8 Flash • AST Rule Engine</span>
            <button
              onClick={() => setCode('')}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear Editor
            </button>
          </div>
        </div>

        {/* Right Col: Findings Panel & Diff Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Inspection Findings & Diff
            </span>

            {activeReview && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Quality Score:</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    activeReview.score >= 80
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : activeReview.score >= 60
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {activeReview.score}/100
                </span>
              </div>
            )}
          </div>

          {isReviewing ? (
            <div className="p-12 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <LoadingSpinner size="lg" text="Deconstructing Abstract Syntax Tree & Checking Vulnerabilities..." />
            </div>
          ) : activeReview ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {/* Review Summary */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
                  AI Review Summary
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{activeReview.summary}</p>
              </div>

              {/* Findings List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
                  Detected Findings ({activeReview.findings.length})
                </h4>

                {activeReview.findings.map((f, idx) => (
                  <div
                    key={f.id || idx}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadgeClass(
                            f.severity
                          )}`}
                        >
                          {f.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {f.category}
                        </span>
                      </div>
                      {f.lineStart && (
                        <span className="text-[10px] font-mono text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Line {f.lineStart}
                          {f.lineEnd ? `-${f.lineEnd}` : ''}
                        </span>
                      )}
                    </div>

                    <h5 className="text-xs font-semibold text-slate-100">{f.title}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{f.explanation}</p>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono text-emerald-400">
                      <span className="text-slate-500 block text-[10px] uppercase">
                        Recommended Fix:
                      </span>
                      {f.suggestedImprovement}
                    </div>
                  </div>
                ))}
              </div>

              {/* Refactored / Improved Code Output */}
              {activeReview.improvedCode && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Production-Refactored Implementation
                    </h4>
                    <button
                      onClick={handleCopyImproved}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
                    >
                      {copiedImproved ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedImproved ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <CodeEditor
                    value={activeReview.improvedCode}
                    language={activeReview.language}
                    readOnly
                    minHeight="220px"
                    maxHeight="360px"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-slate-900 border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
              Paste or select sample code on the left and click "Run AI Review" to begin inspection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
