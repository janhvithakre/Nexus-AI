import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Plus,
  Search,
  Copy,
  Check,
  FileText,
  FileCode,
  ShieldCheck,
  Terminal,
  Code2,
} from 'lucide-react';
import { Document, DocumentType, Project, User } from '../types';
import { AiDocGenModal } from '../components/docs/AiDocGenModal';
import { AiTestGenModal } from '../components/tests/AiTestGenModal';

interface DocumentationPageProps {
  documents: Document[];
  projects: Project[];
  currentUser: User;
  onSaveDocument: (doc: {
    projectId: string;
    title: string;
    type: DocumentType;
    content: string;
    author: User;
    tags: string[];
    version: string;
  }) => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({
  documents,
  projects,
  currentUser,
  onSaveDocument,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isDocGenModalOpen, setIsDocGenModalOpen] = useState(false);
  const [isTestGenModalOpen, setIsTestGenModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase());
    const matchesType = docTypeFilter === 'ALL' || d.type === docTypeFilter;
    return matchesSearch && matchesType;
  });

  const activeDoc = documents.find((d) => d.id === selectedDocId) || filteredDocs[0] || null;

  const handleCopyContent = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Architecture & Documentation Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System architecture specifications, OpenAPI REST contracts, and AI-synthesized developer onboarding guides
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTestGenModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-indigo-300 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Test Suite Generator</span>
          </button>

          <button
            onClick={() => setIsDocGenModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Docs with AI</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Document Index, Right Markdown Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter & Doc List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search documents or specs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {['ALL', 'ARCHITECTURE', 'API_SPEC', 'ONBOARDING', 'README', 'TECH_NOTE'].map((t) => (
              <button
                key={t}
                onClick={() => setDocTypeFilter(t)}
                className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider transition-colors ${
                  docTypeFilter === t
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Documents List */}
          <div className="space-y-2">
            {filteredDocs.map((doc) => {
              const isSelected = activeDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500/60 shadow-xs'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {doc.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">v{doc.version}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">{doc.title}</h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{doc.author.name}</span>
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Markdown Document Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          {activeDoc ? (
            <>
              {/* Doc Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {activeDoc.type}
                    </span>
                    <span className="text-xs font-mono text-slate-400">v{activeDoc.version}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{activeDoc.title}</h2>
                </div>

                <button
                  onClick={handleCopyContent}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors shrink-0 self-start sm:self-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
                </button>
              </div>

              {/* Doc Content Display */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 overflow-x-auto max-h-[640px] overflow-y-auto">
                <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {activeDoc.content}
                </pre>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] font-mono text-slate-500">
                <span>Tags:</span>
                {activeDoc.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs font-mono text-slate-500">
              Select or generate a document to view details.
            </div>
          )}
        </div>
      </div>

      {/* AI Documentation Generator Modal */}
      <AiDocGenModal
        isOpen={isDocGenModalOpen}
        onClose={() => setIsDocGenModalOpen(false)}
        projects={projects}
        currentUser={currentUser}
        onSaveDocument={onSaveDocument}
      />

      {/* AI Test Generator Modal */}
      <AiTestGenModal
        isOpen={isTestGenModalOpen}
        onClose={() => setIsTestGenModalOpen(false)}
      />
    </div>
  );
};
