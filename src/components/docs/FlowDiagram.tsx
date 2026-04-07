import { ArrowRight, ArrowDown } from 'lucide-react';
import { ReactNode } from 'react';

interface FlowNode {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  isSecondary?: boolean;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  direction?: 'horizontal' | 'vertical';
}

export default function FlowDiagram({ nodes, direction = 'horizontal' }: FlowDiagramProps) {
  return (
    <div className={`my-8 flex ${direction === 'horizontal' ? 'flex-col md:flex-row items-center' : 'flex-col'} gap-4`}>
      {nodes.map((node, index) => (
        <div key={node.id} className="flex flex-col md:flex-row items-center gap-4 w-full">
          {/* Node */}
          <div className={`
            flex items-start gap-4 p-4 rounded-xl border w-full
            ${node.isSecondary 
              ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
              : 'bg-white dark:bg-[#0f172a] border-blue-100 dark:border-blue-900 shadow-sm'}
            transition-transform hover:-translate-y-1 duration-300
          `}>
            {node.icon && (
              <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                {node.icon}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-corporate-900 dark:text-white text-sm mb-1">{node.title}</h4>
              {node.description && (
                <p className="text-xs text-corporate-600 dark:text-slate-400 leading-relaxed">
                  {node.description}
                </p>
              )}
            </div>
          </div>

          {/* Arrow */}
          {index < nodes.length - 1 && (
            <div className={`text-slate-300 dark:text-slate-600 flex justify-center 
              ${direction === 'horizontal' ? 'md:-rotate-90 md:mx-2 rotate-0 my-2' : 'my-2'}`}
            >
              <ArrowDown className="w-5 h-5 md:hidden" />
              {direction === 'horizontal' ? <ArrowRight className="w-5 h-5 hidden md:block" /> : <ArrowDown className="w-5 h-5" />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
