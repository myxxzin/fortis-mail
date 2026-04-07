import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  filename?: string;
  code: string;
}

export default function CodeBlock({ language, filename, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 bg-[#1d1f21] shadow-sm">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2f31] border-b border-slate-700/50">
          <span className="text-xs font-mono text-slate-300">{filename}</span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
      {!filename && (
        <div className="flex items-center justify-end px-4 pt-2 bg-[#1d1f21]">
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
      <div className="text-sm font-mono p-1">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
