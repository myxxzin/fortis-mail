import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Key, Trash2, ShieldCheck, Edit2, Check, X } from 'lucide-react';
import { useContacts } from '../context/ContactContext';
import { toast } from 'react-hot-toast';

export default function Contacts() {
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ alias: '', publicKey: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ alias: '', publicKey: '' });

  const handleEditStart = (contact: any) => {
    setEditingId(contact.id);
    setEditData({ alias: contact.alias, publicKey: contact.publicKey });
  };

  const handleEditSubmit = async (id: string) => {
    if (!editData.alias || !editData.publicKey) return;
    try {
      await updateContact(id, { alias: editData.alias.trim(), publicKey: editData.publicKey.trim() });
      setEditingId(null);
      toast.success("Contact updated securely.");
    } catch (err) {
      console.error("Failed to update contact", err);
      toast.error("Error updating contact.");
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
      toast.success("Identity added to vault.");
    } catch (err) {
      console.error("Failed to add contact", err);
      toast.error("Error adding contact.");
    }
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-corporate-900 tracking-tight flex items-center">
            <Users className="text-accent-blue mr-3" size={28} />
            Address Book
          </h1>
          <p className="text-sm text-corporate-500 mt-1">Manage trusted identities and their public keys.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-corporate-900 hover:bg-corporate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.15)] flex items-center"
        >
          {isAdding ? <Users size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
          {isAdding ? "Cancel" : "Add Contact"}
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
            <form onSubmit={handleAdd} className="bg-white border border-corporate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-corporate-900 mb-4 uppercase tracking-wider flex items-center">
                <ShieldCheck size={16} className="text-accent-blue mr-2" />
                New Secure Identity
              </h3>
              <div className="mb-4">
                <div>
                  <label className="block text-xs font-semibold text-corporate-500 uppercase tracking-wider mb-1">Alias / Name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 text-corporate-400" size={16} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe (Finance)"
                      value={newContact.alias}
                      onChange={e => setNewContact({...newContact, alias: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-corporate-200 rounded-xl text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-corporate-500 uppercase tracking-wider mb-1">RSA Public Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-4 text-corporate-400" size={16} />
                  <textarea
                    required
                    rows={3}
                    placeholder="-----BEGIN PUBLIC KEY-----..."
                    value={newContact.publicKey}
                    onChange={e => setNewContact({...newContact, publicKey: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-corporate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-accent-blue hover:bg-accent-blue-hover text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm">
                  Save Contact
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-corporate-200 rounded-2xl flex-1 overflow-hidden flex flex-col shadow-sm">
        {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="w-8 h-8 border-2 border-corporate-200 border-t-accent-blue rounded-full animate-spin" />
           </div>
        ) : contacts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-accent-blue" />
            </div>
            <h3 className="text-lg font-bold text-corporate-900 mb-2">No contacts found</h3>
            <p className="text-sm text-corporate-500 max-w-sm mb-6">
              Your address book is empty. Add a trusted contact to easily send encrypted messages without pasting public keys manually.
            </p>
            <button onClick={() => setIsAdding(true)} className="text-accent-blue hover:text-accent-blue-hover font-semibold text-sm">
              + Add First Contact
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-corporate-50 border-b border-corporate-100 text-xs uppercase tracking-wider text-corporate-500 font-semibold">
                  <th className="py-3 px-6 whitespace-nowrap">Alias</th>
                  <th className="py-3 px-6 whitespace-nowrap">Public Key Hash</th>
                  <th className="py-3 px-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-corporate-100 hover:bg-corporate-50/50 transition-colors group">
                    {editingId === contact.id ? (
                      <>
                        <td className="py-2 px-6">
                           <input
                             type="text"
                             value={editData.alias}
                             onChange={e => setEditData({...editData, alias: e.target.value})}
                             className="w-full px-2 py-1 border border-corporate-200 rounded text-sm focus:outline-none focus:border-accent-blue"
                           />
                        </td>
                        <td className="py-2 px-6">
                           <input
                             type="text"
                             value={editData.publicKey}
                             onChange={e => setEditData({...editData, publicKey: e.target.value})}
                             className="w-full px-2 py-1 border border-corporate-200 rounded text-xs font-mono focus:outline-none focus:border-accent-blue"
                           />
                        </td>
                        <td className="py-2 px-6 text-right whitespace-nowrap">
                          <button onClick={() => handleEditSubmit(contact.id)} className="text-green-500 hover:bg-green-50 p-2 rounded-lg transition-all mr-1" title="Save"><Check size={16} /></button>
                          <button onClick={() => setEditingId(null)} className="text-corporate-400 hover:bg-corporate-100 p-2 rounded-lg transition-all" title="Cancel"><X size={16} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-6 text-sm font-semibold text-corporate-900 whitespace-nowrap">
                          {contact.alias}
                        </td>
                        <td className="py-4 px-6 text-xs text-corporate-400 font-mono text-ellipsis overflow-hidden max-w-[200px]">
                          {contact.publicKey.substring(0, 24)}...
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button 
                            onClick={() => handleEditStart(contact)}
                            className="text-corporate-400 hover:text-accent-blue opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-blue-50 mr-1"
                            title="Edit Contact"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this contact?')) {
                                deleteContact(contact.id);
                              }
                            }}
                            className="text-corporate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50"
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
