import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Terminal,
  FileCode,
  BookOpen,
  Layers,
  Database,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Project, AIMessage, Document } from '../types';
import { aiService } from '../services/ai/aiService';
import { CodeEditor } from '../components/common/CodeEditor';

interface AiAssistantPageProps {
  projects: Project[];
  documents: Document[];
  activeProjectId?: string;
  onSelectProject: (projectId: string) => void;
}

const DEFAULT_QUERIES = [
  'What authentication mechanism does this project use?',
  'Where is JWT validation implemented in the Spring filter chain?',
  'Explain the architecture and database model of this project.',
  'How do we prevent Hibernate LazyInitializationException in DTO responses?',
];

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  projects,
  documents,
  activeProjectId,
  onSelectProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    activeProjectId && activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || ''
  );
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init',
      sender: 'ASSISTANT',
      text: `Hello! I am your **NEXUS Project Knowledge Assistant**. 

I am indexed with the project's **README**, **Architecture Specification (Java 21 / Spring Boot 3.3)**, **PostgreSQL schema**, and **Spring Security filter chain**.

Ask me any technical question regarding architecture, security boundaries, database design, or implementation details!`,
      citations: ['doc-001 (Architecture Spec)', 'JwtAuthenticationFilter.java', 'flyway/V1__init.sql'],
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const relevantDocs = documents.filter((d) => d.projectId === selectedProjectId);

  const handleSend = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await aiService.chatProjectKnowledge({
        projectId: selectedProjectId,
        userPrompt: text.trim(),
        messages: messages.map((m) => ({
          role: m.sender === 'USER' ? 'user' : 'assistant',
          content: m.text,
        })),
        contextScope: 'PROJECT_KNOWLEDGE',
      });

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-emerald-400" />
            <span>Project Knowledge Assistant (RAG Engine)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Context-aware engineering assistant grounded in project specifications, architecture documents, and codebase
          </p>
        </div>

        {/* Project Context Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Context Scope:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              onSelectProject(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-300 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.key} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RAG Context Index Summary Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-300 font-medium">
            Active Context Index: <strong>{selectedProject?.name}</strong>
          </span>
          <span className="text-slate-500">({relevantDocs.length} specs loaded)</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span>Architecture Specs</span>
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>PostgreSQL Flyway</span>
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Spring Security 6</span>
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
          Recommended Architecture Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 transition-colors text-left"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-5 min-h-[420px] max-h-[580px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'USER' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ASSISTANT' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'USER'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-950 border border-slate-850 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans leading-relaxed">
                {msg.text}
              </div>

              {/* Citations Tag */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500">Citations:</span>
                  {msg.citations.map((c, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'USER' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0 mt-0.5">
                U
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Querying project index & synthesizing architectural response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask about ${selectedProject?.name || 'project'} architecture, security, or implementation...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
