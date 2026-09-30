import React from 'react';
import { Modal } from '../common/Modal';
import { EngineeringPlan } from '../../types';
import {
  Sparkles,
  Database,
  Server,
  Layout,
  Network,
  ShieldCheck,
  CheckCircle,
  ListOrdered,
  Copy,
  Check,
} from 'lucide-react';

interface EngineeringPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: EngineeringPlan | null;
  isLoading?: boolean;
}

export const EngineeringPlanModal: React.FC<EngineeringPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  isLoading,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    if (!plan) return;
    const md = `# Engineering Plan: ${plan.issueTitle}

## Problem Understanding
${plan.problemUnderstanding}

## Assumptions
${plan.assumptions.map((a) => `- ${a}`).join('\n')}

## Affected Modules
${plan.affectedModules.map((m) => `- ${m}`).join('\n')}

## Database Changes
${plan.databaseChanges.map((d) => `- ${d}`).join('\n')}

## Backend Changes
${plan.backendChanges.map((b) => `- ${b}`).join('\n')}

## Frontend Changes
${plan.frontendChanges.map((f) => `- ${f}`).join('\n')}

## API Changes
${plan.apiChanges.map((a) => `- ${a}`).join('\n')}

## Security Considerations
${plan.securityConsiderations.map((s) => `- ${s}`).join('\n')}

## Testing Requirements
${plan.testingRequirements.map((t) => `- ${t}`).join('\n')}

## Implementation Steps
${plan.implementationSteps.map((s) => `${s.step}. **${s.title}**: ${s.details}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? `AI Engineering Plan: ${plan.issueTitle}` : 'Generating Engineering Plan...'}
      subtitle="AI-synthesized cross-stack architectural blueprint and execution roadmap"
      maxWidth="4xl"
    >
      {isLoading ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center mx-auto text-indigo-400 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">Synthesizing Architecture Plan...</h3>
          <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
            Analyzing database schemas, Spring Security filters, REST controller interfaces, and test requirements...
          </p>
        </div>
      ) : plan ? (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs">
            <div className="flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Full-Stack Architecture Plan synthesized by <strong>NEXUS Gemini Engine</strong></span>
            </div>
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-mono text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy as Markdown'}</span>
            </button>
          </div>

          {/* Problem Understanding */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Problem Scope & Objective
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{plan.problemUnderstanding}</p>
          </div>

          {/* Key Assumptions & Affected Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                Assumptions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {plan.assumptions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                Affected Modules
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-indigo-300">
                {plan.affectedModules.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Database, Backend, Frontend, and API Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Database Changes */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Database / Flyway Changes
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                {plan.databaseChanges.map((item, idx) => (
                  <li key={idx} className="bg-slate-900/60 p-2 rounded border border-slate-850">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend Changes */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Spring Boot Backend Changes
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {plan.backendChanges.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frontend Changes */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" />
                Frontend UI / Client Changes
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {plan.frontendChanges.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* API Contract Changes */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                REST API Contract Endpoints
              </h4>
              <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                {plan.apiChanges.map((item, idx) => (
                  <li key={idx} className="bg-slate-900/60 p-2 rounded border border-slate-850">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Security & Testing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Security Considerations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {plan.securityConsiderations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Testing & Validation Strategy
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {plan.testingRequirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Implementation Steps */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-indigo-400" />
              Step-by-Step Implementation Roadmap
            </h4>
            <div className="space-y-3">
              {plan.implementationSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-mono text-xs font-bold text-indigo-300 shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-100">{step.title}</h5>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
