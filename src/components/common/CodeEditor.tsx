import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange?: (val: string) => void;
  language?: string;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  filename?: string;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'java',
  readOnly = false,
  minHeight = '280px',
  maxHeight = '500px',
  filename,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = value.split('\n');

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-sm ${className}`}>
      {/* Code Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/90 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          </div>
          {filename && <span className="text-slate-300 font-medium">{filename}</span>}
          <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase text-[10px] tracking-wider font-semibold border border-indigo-900/40">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Body */}
      <div className="relative flex overflow-auto" style={{ minHeight, maxHeight }}>
        {/* Line Numbers Gutter */}
        <div className="select-none py-3 px-3 text-right bg-slate-950/70 border-r border-slate-800/60 text-slate-600 text-xs font-mono leading-relaxed min-w-[3rem]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area or Display */}
        {readOnly ? (
          <pre className="p-3 text-xs md:text-sm text-slate-200 leading-relaxed font-mono overflow-x-auto w-full">
            <code>{value}</code>
          </pre>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            spellCheck={false}
            className="w-full p-3 bg-transparent text-xs md:text-sm text-slate-100 font-mono leading-relaxed resize-none focus:outline-none focus:ring-0 border-0 overflow-x-auto whitespace-pre"
            placeholder="// Paste or write source code here..."
          />
        )}
      </div>
    </div>
  );
};
