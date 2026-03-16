import { FileEdit } from 'lucide-react';

export default function Drafts() {
  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-corporate-200 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-corporate-100 flex items-center justify-between bg-white shrink-0">
        <h1 className="text-2xl font-bold text-corporate-900 tracking-tight">Drafts</h1>
      </div>

      <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-12 text-center h-64">
         <div className="w-16 h-16 bg-corporate-50 rounded-full flex items-center justify-center mb-4 text-corporate-300">
            <FileEdit size={32} />
         </div>
         <p className="text-corporate-900 font-medium">No saved drafts</p>
         <p className="text-sm text-corporate-500 mt-1">Messages you are composing will be saved here automatically.</p>
      </div>
    </div>
  );
}
