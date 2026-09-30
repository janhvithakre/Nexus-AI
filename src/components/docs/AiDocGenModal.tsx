import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DocumentType, Project, User } from '../../types';
import { aiService } from '../../services/ai/aiService';
import { Sparkles, BookOpen, Check, Copy } from 'lucide-react';

interface AiDocGenModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const AiDocGenModal: React.FC<AiDocGenModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentUser,
  onSaveDocument,
}) => {
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [docType, setDocType] = useState<DocumentType>('README');
  const [techStack, setTechStack] = useState('Java 21, Spring Boot 3.3, PostgreSQL 16, React 19, TypeScript');
  const [keyFeatures, setKeyFeatures] = useState('Stateless JWT Auth, Project Tracking, AI Workbenches, Git Sync');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedProject = projects.find((p) => p.id === projectId);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsGenerating(true);
    try {
      const content = await aiService.generateDocumentation({
        docType,
        projectName: selectedProject.name,
        projectDescription: selectedProject.description,
        techStack,
        keyFeatures,
      });

      setGeneratedContent(content);
      setDocTitle(`${selectedProject.name} - ${docType.replace('_', ' ')}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDocs = () => {
    if (!generatedContent || !selectedProject) return;
    onSaveDocument({
      projectId: selectedProject.id,
      title: docTitle || `${selectedProject.name} ${docType}`,
      type: docType,
      content: generatedContent,
      author: currentUser,
      tags: ['ai-generated', docType.toLowerCase(), 'documentation'],
      version: '1.0.0',
    });
    setGeneratedContent('');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Documentation Generator"
      subtitle="Synthesize architectural specifications, developer onboarding guides, and API documentation"
      maxWidth="2xl"
    >
      {!generatedContent ? (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="README">README (Repository Guide & Quickstart)</option>
                <option value="ARCHITECTURE">System Architecture Specification</option>
                <option value="API_SPEC">REST API Specification</option>
                <option value="ONBOARDING">Developer Onboarding & Setup</option>
                <option value="TECH_NOTE">Technical Architecture Note (ADR)</option>
                <option value="FEATURE_SPEC">Feature Functional Specification</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technology Stack</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Key Modules & Capabilities</label>
            <textarea
              rows={3}
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              placeholder="List key modules, security aspects, database schemas..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate Documentation'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-100 flex-1 mr-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-96 overflow-y-auto">
            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {generatedContent}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setGeneratedContent('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ← Back to Generator Form
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
              <button
                onClick={handleSaveToDocs}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Save to Project Documentation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
