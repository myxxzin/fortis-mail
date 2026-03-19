import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, Trash2, Edit2 } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { Link } from 'react-router-dom';

export default function Drafts() {
  const { drafts, deleteDraft } = useMail();
  const { contacts } = useContacts();
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  const resolveAlias = (pubKey: string) => {
    if (!pubKey) return 'No Recipient';
    const contact = contacts.find(c => c.publicKey === pubKey);
    return contact ? contact.alias : pubKey.substring(0, 24) + '...';
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-corporate-200 flex flex-col h-full overflow-hidden relative">
      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {draftToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-corporate-900/40 backdrop-blur-sm"
                onClick={() => setDraftToDelete(null)}
              />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden border border-corporate-100"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-corporate-900 mb-2 tracking-tight">Delete Draft</h3>
                <p className="text-sm text-corporate-500 mb-6 leading-relaxed">
                  Are you sure you want to discard this draft permanently? This action cannot be undone.
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setDraftToDelete(null)}
                    className="flex-1 py-2.5 px-4 bg-white border border-corporate-200 hover:bg-corporate-50 rounded-xl text-sm font-semibold text-corporate-700 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (draftToDelete) {
                        deleteDraft(draftToDelete);
                        setDraftToDelete(null);
                      }
                    }}
                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}

      <div className="p-6 border-b border-corporate-100 flex items-center justify-between bg-white shrink-0">
        <h1 className="text-2xl font-bold text-corporate-900 tracking-tight">Drafts</h1>
        <span className="text-sm font-medium px-3 py-1 bg-corporate-100 text-corporate-600 rounded-full">{drafts?.length || 0} Saved</span>
      </div>

      {(!drafts || drafts.length === 0) ? (
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-12 text-center h-64">
          <div className="w-16 h-16 bg-corporate-50 rounded-full flex items-center justify-center mb-4 text-corporate-300">
            <FileEdit size={32} />
          </div>
          <p className="text-corporate-900 font-medium">No saved drafts</p>
          <p className="text-sm text-corporate-500 mt-1">Messages you save while composing will appear here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-corporate-50/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-corporate-200 bg-corporate-50 text-xs uppercase tracking-wider text-corporate-500 font-semibold">
                <th className="px-6 py-4 font-semibold text-corporate-500 w-1/4">Recipient</th>
                <th className="px-6 py-4 font-semibold text-corporate-500 w-1/2">Subject</th>
                <th className="px-6 py-4 font-semibold text-corporate-500 w-1/4">Saved On</th>
                <th className="px-6 py-4 font-semibold text-corporate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-100 bg-white">
              {drafts.map(draft => (
                <tr key={draft.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-corporate-700 block truncate w-48">
                      {resolveAlias(draft.recipientPubKey)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-corporate-900 block truncate lg:w-96 md:w-64">
                      {draft.subject || '(No subject)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-corporate-500">
                    {draft.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <Link to={`/compose?draftId=${draft.id}`} className="p-2 text-corporate-400 hover:text-accent-blue hover:bg-blue-50 rounded-lg transition-colors inline-block">
                         <Edit2 size={16} />
                       </Link>
                       <button onClick={() => setDraftToDelete(draft.id)} className="p-2 text-corporate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
