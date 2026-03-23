import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Key, Trash2, ShieldCheck, Edit2, Check, X } from 'lucide-react';
import { useContacts } from '../context/ContactContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

export default function Contacts() {
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ alias: '', publicKey: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ alias: '', publicKey: '' });
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const handleEditStart = (contact: any) => {
    setEditingId(contact.id);
    setEditData({ alias: contact.alias, publicKey: contact.publicKey });
  };

  const handleEditSubmit = async (id: string) => {
    if (!editData.alias || !editData.publicKey) return;
    try {
      await updateContact(id, { alias: editData.alias.trim(), publicKey: editData.publicKey.trim() });
      setEditingId(null);
      toast.success(t('contacts.msgUpdated'));
    } catch (err) {
      console.error("Failed to update contact", err);
      toast.error(t('contacts.msgUpdateError'));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.alias || !newContact.publicKey) return;
    
    try {
      await addContact({ 
        alias: newContact.alias.trim(), 
        publicKey: newContact.publicKey.trim() 
      });
      setNewContact({ alias: '', publicKey: '' });
      setIsAdding(false);
      toast.success(t('contacts.msgAdded'));
    } catch (err) {
      console.error("Failed to add contact", err);
      toast.error(t('contacts.msgAddError'));
    }
  };

  return (
    <div className="h-full flex flex-col w-full relative transition-colors duration-300">
      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {contactToDelete && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
                onClick={() => setContactToDelete(null)}
              />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#020617] rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden border border-corporate-100 dark:border-slate-800"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-corporate-900 dark:text-white mb-2 tracking-tight">{t('contacts.deleteTitle')}</h3>
                <p className="text-sm text-corporate-500 dark:text-white mb-6 leading-relaxed">
                  {t('contacts.deleteConfirm')}
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setContactToDelete(null)}
                    className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-corporate-200 dark:border-slate-700 hover:bg-corporate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold text-corporate-700 dark:text-white transition-colors shadow-sm"
                  >
                    {t('contacts.cancel')}
                  </button>
                  <button
                    onClick={() => {
                      if (contactToDelete) {
                        deleteContact(contactToDelete);
                        setContactToDelete(null);
                        toast.success(t('contacts.msgDeleted'));
                      }
                    }}
                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm"
                  >
                    {t('contacts.yesDelete')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-corporate-900 dark:text-white tracking-tight flex items-center">
            <Users className="text-accent-blue mr-3" size={28} />
            {t('contacts.title')}
          </h1>
          <p className="text-sm text-corporate-500 dark:text-white mt-1">{t('contacts.desc')}</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white border border-corporate-200 text-corporate-900 dark:bg-white/10 hover:bg-corporate-50 dark:hover:bg-white/20 dark:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center"
        >
          {isAdding ? <Users size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
          {isAdding ? t('contacts.cancelAdd') : t('contacts.addContact')}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <form onSubmit={handleAdd} className="bg-white dark:bg-[#020617] border border-corporate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-colors duration-300">
              <h3 className="text-sm font-semibold text-corporate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center">
                <ShieldCheck size={16} className="text-accent-blue mr-2" />
                {t('contacts.newIdentity')}
              </h3>
              <div className="mb-4">
                <div>
                  <label className="block text-xs font-semibold text-corporate-500 dark:text-white uppercase tracking-wider mb-1">{t('contacts.aliasName')}</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 text-corporate-400 dark:text-white" size={16} />
                    <input
                      required
                      type="text"
                      placeholder={t('contacts.aliasPlaceholder')}
                      value={newContact.alias}
                      onChange={e => setNewContact({...newContact, alias: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-corporate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-corporate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-corporate-500 dark:text-white uppercase tracking-wider mb-1">{t('contacts.publicKey')}</label>
                <div className="relative">
                  <Key className="absolute left-3 top-4 text-corporate-400 dark:text-white" size={16} />
                  <textarea
                    required
                    rows={3}
                    placeholder={t('contacts.publicKeyPlaceholder')}
                    value={newContact.publicKey}
                    onChange={e => setNewContact({...newContact, publicKey: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-corporate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-corporate-900 dark:text-white rounded-xl text-xs font-mono focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-accent-blue hover:bg-accent-blue-hover text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm">
                  {t('contacts.saveContact')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#020617] border border-corporate-200 dark:border-white/10 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-sm transition-colors duration-300">
        {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="w-8 h-8 border-2 border-corporate-200 dark:border-slate-700 border-t-accent-blue rounded-full animate-spin" />
           </div>
        ) : contacts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-accent-blue" />
            </div>
            <h3 className="text-lg font-bold text-corporate-900 dark:text-white mb-2">{t('contacts.noContacts')}</h3>
            <p className="text-sm text-corporate-500 dark:text-white max-w-sm mb-6">
              {t('contacts.noContactsDesc')}
            </p>
            <button onClick={() => setIsAdding(true)} className="text-accent-blue hover:text-accent-blue-hover font-semibold text-sm">
              {t('contacts.addFirstContact')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-corporate-50 dark:bg-white/5 border-b border-corporate-100 dark:border-white/10 text-xs uppercase tracking-wider text-corporate-500 dark:text-white font-semibold transition-colors duration-300">
                  <th className="py-3 px-6 whitespace-nowrap">{t('contacts.tableAlias')}</th>
                  <th className="py-3 px-6 whitespace-nowrap">{t('contacts.tablePubKey')}</th>
                  <th className="py-3 px-6 text-right whitespace-nowrap">{t('contacts.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-corporate-100 dark:border-white/5 hover:bg-corporate-50/50 dark:hover:bg-white/5 transition-colors group">
                    {editingId === contact.id ? (
                      <>
                        <td className="py-2 px-6">
                           <input
                             type="text"
                             value={editData.alias}
                             onChange={e => setEditData({...editData, alias: e.target.value})}
                             className="w-full px-2 py-1 border border-corporate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-corporate-900 dark:text-white rounded text-sm focus:outline-none focus:border-accent-blue transition-colors"
                           />
                        </td>
                        <td className="py-2 px-6">
                           <input
                             type="text"
                             value={editData.publicKey}
                             onChange={e => setEditData({...editData, publicKey: e.target.value})}
                             className="w-full px-2 py-1 border border-corporate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-corporate-900 dark:text-white rounded text-xs font-mono focus:outline-none focus:border-accent-blue transition-colors"
                           />
                        </td>
                        <td className="py-2 px-6 text-right whitespace-nowrap">
                          <button onClick={() => handleEditSubmit(contact.id)} className="text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 p-2 rounded-lg transition-all mr-1" title="Save"><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="text-corporate-400 dark:text-white hover:bg-corporate-100 dark:hover:bg-white/10 p-2 rounded-lg transition-all" title="Cancel"><X size={16} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 text-sm font-semibold text-corporate-900 dark:text-white whitespace-nowrap">
                          {contact.alias}
                        </td>
                        <td className="py-4 px-6 text-xs text-corporate-400 dark:text-white font-mono text-ellipsis overflow-hidden max-w-[200px]">
                          {contact.publicKey.substring(0, 24)}...
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button 
                            onClick={() => handleEditStart(contact)}
                            className="text-corporate-400 dark:text-white hover:text-accent-blue opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-accent-blue/10 mr-1"
                            title="Edit Contact"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setContactToDelete(contact.id)}
                            className="text-corporate-400 dark:text-white hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Delete Contact"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
