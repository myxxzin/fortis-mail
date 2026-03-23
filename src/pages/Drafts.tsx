import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, Trash2, Edit2 } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function Drafts() {
  const { drafts, deleteDraft } = useMail();
  const { contacts } = useContacts();
  const { t } = useLanguage();
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  const resolveAlias = (pubKey: string) => {
    if (!pubKey) return 'No Recipient';
    const contact = contacts.find(c => c.publicKey === pubKey);
    return contact ? contact.alias : pubKey.substring(0, 24) + '...';
  };

  return (
    <div className="bg-surface dark:bg-[#020617] rounded-2xl shadow-sm border border-corporate-200 dark:border-white/10 flex flex-col h-full overflow-hidden relative transition-colors duration-300">
      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {draftToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-corporate-900/40 dark:bg-black/60 backdrop-blur-sm"
                onClick={() => setDraftToDelete(null)}
              />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#020617] rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden border border-corporate-100 dark:border-slate-700"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-corporate-900 dark:text-white mb-2 tracking-tight">{t('mail.deleteDraft')}</h3>
                <p className="text-sm text-corporate-500 dark:text-white mb-6 leading-relaxed">
                  {t('mail.discardConfirm')}
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setDraftToDelete(null)}
                    className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-corporate-200 dark:border-slate-700 hover:bg-corporate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold text-corporate-700 dark:text-white transition-colors shadow-sm"
                  >
                    {t('mail.cancel')}
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
                    {t('mail.yesDelete')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}

      <div className="p-6 border-b border-corporate-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#020617] shrink-0 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-corporate-900 dark:text-white tracking-tight">{t('sidebar.drafts')}</h1>
        <span className="text-sm font-medium px-3 py-1 bg-corporate-100 dark:bg-white/10 text-corporate-600 dark:text-white rounded-full">{drafts?.length || 0} Saved</span>
      </div>

      {(!drafts || drafts.length === 0) ? (
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-12 text-center h-64 bg-corporate-50/20 dark:bg-transparent transition-colors duration-300">
          <div className="w-16 h-16 bg-corporate-50 dark:bg-white/5 border border-corporate-200 dark:border-white/10 rounded-full flex items-center justify-center mb-4 text-corporate-300 dark:text-white">
            <FileEdit size={32} />
          </div>
          <p className="text-corporate-900 dark:text-white font-medium">{t('mail.emptyDrafts')}</p>
          <p className="text-sm text-corporate-500 dark:text-white mt-1">{t('mail.emptyDraftsDesc')}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-corporate-50/30 dark:bg-transparent transition-colors duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-corporate-200 dark:border-white/10 bg-corporate-50 dark:bg-white/5 text-xs uppercase tracking-wider text-corporate-500 font-semibold transition-colors duration-300">
                <th className="px-6 py-4 font-semibold text-corporate-500 dark:text-white w-1/4">{t('mail.recipient')}</th>
                <th className="px-6 py-4 font-semibold text-corporate-500 dark:text-white w-1/2">{t('mail.subject')}</th>
                <th className="px-6 py-4 font-semibold text-corporate-500 dark:text-white w-1/4">{t('mail.savedOn')}</th>
                <th className="px-6 py-4 font-semibold text-corporate-500 dark:text-white text-right">{t('mail.operations')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-corporate-100 dark:divide-white/5 bg-white dark:bg-transparent">
              {drafts.map(draft => (
                <tr key={draft.id} className="hover:bg-blue-50/30 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 w-1/4">
                    <span className="text-sm font-medium text-corporate-700 dark:text-white block truncate">
                      {resolveAlias(draft.recipientPubKey)}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-1/2">
                    <span className={`text-sm font-medium block truncate ${draft.subject ? 'text-corporate-900 dark:text-white' : 'text-corporate-400 dark:text-white italic'}`}>
                      {draft.subject || t('mail.noSubject')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-corporate-500 dark:text-white w-1/4">
                    {draft.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                       <Link to={`/compose?draftId=${draft.id}`} className="p-2 text-corporate-400 dark:text-white hover:text-accent-blue hover:bg-blue-50 dark:hover:bg-accent-blue/10 rounded-lg transition-colors inline-block">
                         <Edit2 size={16} />
                       </Link>
                       <button onClick={() => setDraftToDelete(draft.id)} className="p-2 text-corporate-400 dark:text-white hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors inline-block">
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
