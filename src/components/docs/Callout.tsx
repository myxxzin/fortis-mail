import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';

type CalloutType = 'info' | 'warning' | 'success';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = {
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      containerClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      titleClass: 'text-blue-800 dark:text-blue-300',
      textClass: 'text-blue-800/80 dark:text-blue-300/80'
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      containerClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      titleClass: 'text-amber-800 dark:text-amber-300',
      textClass: 'text-amber-800/80 dark:text-amber-300/80'
    },
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      containerClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      titleClass: 'text-green-800 dark:text-green-300',
      textClass: 'text-green-800/80 dark:text-green-300/80'
    }
  };

  const { icon, containerClass, titleClass, textClass } = config[type];

  return (
    <div className={`my-6 flex gap-4 p-4 rounded-xl border ${containerClass}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        {title && <h5 className={`font-semibold mb-1 text-sm ${titleClass}`}>{title}</h5>}
        <div className={`text-sm leading-relaxed ${textClass}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
