import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Lock, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Inbox() {
  const { mails, deleteMail, markAsRead } = useMail();
  const { contacts } = useContacts();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const resolveAlias = (pubKey: string) => {
    if (pubKey === 'System Key') return 'System';
    const contact = contacts.find(c => c.publicKey === pubKey);
    return contact ? contact.alias : pubKey.substring(0, 24) + '...';
  };

  const [mailToDelete, setMailToDelete] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMailToDelete(id);
  };

  const confirmDelete = () => {
    if (mailToDelete) {
      deleteMail(mailToDelete);
      setMailToDelete(null);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#020617] rounded-2xl shadow-sm border border-corporate-200 dark:border-white/10 flex flex-col h-full overflow-hidden relative transition-colors duration-300">
      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {mailToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); setMailToDelete(null) }}
              />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#020617] rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden border border-corporate-100 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-corporate-900 dark:text-white mb-2 tracking-tight">{t('mail.deleteTitle')}</h3>
                <p className="text-sm text-corporate-500 dark:text-white mb-6 leading-relaxed">
                  {t('mail.deleteConfirm')}
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMailToDelete(null) }}
                    className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-corporate-200 dark:border-slate-700 hover:bg-corporate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold text-corporate-700 dark:text-white transition-colors shadow-sm"
                  >
                    {t('mail.cancel')}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); confirmDelete() }}
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
        <h1 className="text-2xl font-bold text-corporate-900 dark:text-white tracking-tight">{t('sidebar.inbox')}</h1>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-3 py-1.5 border border-corporate-200 dark:border-white/10 rounded-lg text-sm font-medium text-corporate-700 dark:text-white hover:bg-corporate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Filter size={16} />
            <span>{t('mail.filter')}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative bg-corporate-50/20 dark:bg-transparent">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-corporate-100 dark:border-white/10 text-xs uppercase tracking-wider text-corporate-400 dark:text-white bg-corporate-50/50 dark:bg-white/5 sticky top-0 z-10 backdrop-blur-md transition-colors duration-300">
              <th className="px-6 py-4 font-semibold w-1/4">{t('mail.sender')}</th>
              <th className="px-6 py-4 font-semibold w-2/4">{t('mail.subject')}</th>
              <th className="px-6 py-4 font-semibold text-right w-1/4">{t('mail.operations')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-corporate-100 dark:divide-white/5 relative">
            <AnimatePresence>
              {mails.map((mail) => (
                <motion.tr
                  key={mail.id}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scaleY: 0.9, backgroundColor: '#fef2f2' }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                     if(mail.isUnread && mail.id !== 'msg-welcome') markAsRead(mail.id);
                     navigate(`/mail/${mail.id}`);
                  }}
                  className={`group cursor-pointer transition-colors border-b border-corporate-100 dark:border-white/5 last:border-0 ${mail.isUnread ? 'bg-blue-50 dark:bg-accent-blue/10 hover:bg-blue-100/50 dark:hover:bg-accent-blue/20' : 'bg-white dark:bg-transparent hover:bg-corporate-50/50 dark:hover:bg-white/5'} flex flex-col md:table-row relative py-2 md:py-0`}
                >
                  <td className="px-4 md:px-6 md:py-3 whitespace-nowrap block md:table-cell">
                    <div className="flex items-center space-x-3">
                      <div className={mail.isUnread ? "text-accent-blue" : "text-corporate-400 dark:text-white"}><Lock size={16} /></div>
                      <div className="flex flex-col min-w-0 max-w-[200px] xl:max-w-xs">
                        <span className={`text-sm truncate ${mail.isUnread ? 'font-bold text-corporate-900 dark:text-white' : 'font-medium text-corporate-700 dark:text-white'}`}>
                            {mail.senderDisplay || 'Unknown'}
                        </span>
                        <span className="text-xs text-corporate-400 dark:text-white truncate">({resolveAlias(mail.senderPubKey)})</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-1 md:py-3 min-w-0 md:min-w-[200px] block md:table-cell">
                    <div className={`text-sm truncate w-full ${mail.isUnread ? 'font-bold text-corporate-900 dark:text-white' : 'text-corporate-600 dark:text-white'} group-hover:text-accent-blue dark:group-hover:text-accent-blue transition-colors pl-7 md:pl-0`}>
                      {mail.subject}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-1 md:py-3 whitespace-nowrap md:text-right block md:table-cell">
                    <div className="flex items-center md:justify-end justify-between space-x-3 pl-7 md:pl-0">
                      <span className={`text-[10px] md:text-xs ${mail.isUnread ? 'font-bold text-corporate-900 dark:text-white' : 'text-corporate-500 dark:text-white'}`}>{mail.date}</span>
                      <button
                        onClick={(e) => handleDeleteClick(e, mail.id)}
                        className="opacity-100 md:opacity-0 group-hover:opacity-100 p-1.5 text-corporate-400 dark:text-white hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-all focus:opacity-100"
                        title="Delete message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {mails.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="w-16 h-16 bg-corporate-50 dark:bg-white/5 border border-corporate-200 dark:border-white/10 rounded-full flex items-center justify-center mb-4 text-corporate-300 dark:text-white">
              <Lock size={32} />
            </div>
            <p className="text-corporate-900 dark:text-white font-medium">{t('mail.emptyInbox')}</p>
            <p className="text-sm text-corporate-500 dark:text-white mt-1">{t('mail.emptyInboxDesc')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
