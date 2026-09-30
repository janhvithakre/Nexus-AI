import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CodeEditor } from '../common/CodeEditor';
import { aiService, GeneratedTestsResult } from '../../services/ai/aiService';
import { Sparkles, CheckCircle2, AlertTriangle, Layers, Copy, Check } from 'lucide-react';

interface AiTestGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCode?: string;
  defaultLanguage?: string;
}

export const AiTestGenModal: React.FC<AiTestGenModalProps> = ({
  isOpen,
  onClose,
  defaultCode = '',
  defaultLanguage = 'java',
}) => {
  const [code, setCode] = useState(defaultCode || `public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;

    public OrderService(OrderRepository orderRepository, PaymentGateway paymentGateway) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    public OrderResponse processOrder(OrderRequest request) {
        if (request == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order items cannot be empty");
        }
        PaymentResult payment = paymentGateway.charge(request.getPaymentMethod(), request.getTotalAmount());
        if (!payment.isSuccessful()) {
            throw new PaymentFailedException("Transaction declined: " + payment.getErrorCode());
        }
        Order order = new Order(request.getCustomerId(), request.getItems(), OrderStatus.CONFIRMED);
        return OrderMapper.toResponse(orderRepository.save(order));
    }
}`);
  const [language, setLanguage] = useState(defaultLanguage);
  const [framework, setFramework] = useState('JUnit 5 / Mockito');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedTestsResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsGenerating(true);
    try {
      const testResult = await aiService.generateTests({
        code,
        language,
        framework,
      });
      setResult(testResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyTests = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.unitTests);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Test Suite & Edge-Case Generator"
      subtitle="Synthesize comprehensive unit tests, boundary conditions, and integration test plans"
      maxWidth="4xl"
    >
      {!result ? (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              >
                <option value="java">Java (Spring Boot / JUnit 5)</option>
                <option value="typescript">TypeScript (Jest / Vitest)</option>
                <option value="python">Python (pytest / unittest)</option>
                <option value="go">Go (testing / testify)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Testing Framework</label>
              <input
                type="text"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="e.g. JUnit 5 / Mockito / Testcontainers"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Source Code Under Test</label>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              minHeight="220px"
              maxHeight="340px"
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
              <span>{isGenerating ? 'Synthesizing Test Cases...' : 'Generate Tests with Gemini'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Generated {framework} test suite with boundary and edge-case validation.</span>
            </div>
            <button
              onClick={handleCopyTests}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-mono text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Tests'}</span>
            </button>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono">
              Generated Unit & Regression Tests
            </h4>
            <CodeEditor
              value={result.unitTests}
              language={language}
              readOnly
              minHeight="260px"
              maxHeight="400px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Edge Cases Validated
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.edgeCases.map((e, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Integration Testing Suggestions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.integrationSuggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setResult(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ← Test Another Code Snippet
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
