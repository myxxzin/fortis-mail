import { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { decryptMessageHybrid, unpackHybridPayload, type EncryptedMessagePayload } from '../utils/cryptoAuth';
import toast from 'react-hot-toast';
import { X, Key, Fingerprint, ShieldCheck, Edit2, Save, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
   const { user, loading, updateProfile } = useAuth();
   const { deliveryAcks, sentMails } = useMail();
   const { contacts } = useContacts();
   
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [isEditingProfile, setIsEditingProfile] = useState(false);
   const [copiedPubKey, setCopiedPubKey] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   
   // Track ACKs that have already triggered a Toast
   const processedAcksRef = useRef<Set<string>>(new Set());

   // Profile edit state
   const [editForm, setEditForm] = useState({
      name: ''
   });

   useEffect(() => {
      if (user) {
         setEditForm({
            name: user.name || ''
         });
      }
   }, [user, isEditingProfile]);

   const resolveAlias = (pubKey: string) => {
      const contact = contacts.find(c => c.publicKey === pubKey);
      return contact ? contact.alias : pubKey.substring(0, 16) + '...';
   };

   // Process and Toast new E2E Delivery ACKs (C4 Flowchart Step)
   useEffect(() => {
      if (!user?.privateKey || !deliveryAcks.length) return;

      const processAcks = async () => {
         const storageKey = `fortis_notified_acks_${user.uid}`;
         try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
               const parsed = JSON.parse(stored);
               parsed.forEach((id: string) => processedAcksRef.current.add(id));
            }
         } catch (e) {}

         let hasNew = false;

         for (const ack of deliveryAcks) {
            if (processedAcksRef.current.has(ack.id)) continue;
            
            // Immediately mark it processed to prevent race conditions & duplicate toasts
            processedAcksRef.current.add(ack.id);
            hasNew = true;
            
            const sentMail = sentMails.find(m => m.id === ack.mailId);
            if (!sentMail) continue;

            try {
               const payloadObj = unpackHybridPayload(ack.payload) as EncryptedMessagePayload;
               
               // C4: Decrypt with Priv_A, verify Signature of B
               const decrypted = await decryptMessageHybrid(
                  payloadObj,
                  user.privateKey!,         // A's Private Key
                  ack.recipientPubKey,     // B's Public Key (Sender of the ACK)
                  user.publicKey!          // A's Public Key (Recipient of the ACK)
               );

               if (decrypted.plaintext.startsWith("ACK:")) {
                  // Valid ACK!
                  toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex border border-green-500/30 overflow-hidden`}>
                      <div className="flex-1 w-0 p-5 bg-green-50/30">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <ShieldCheck className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-bold text-green-900 mb-2">
                              Phiếu Xác Nhận E2E (ACK)
                            </p>
                            <p className="mt-1 text-xs text-green-800 space-y-1.5 leading-relaxed">
                              <span className="block font-medium text-green-700 mb-2">Giải mã ACK thành công bằng Priv_A.</span>
                              <span className="block">🔹 <strong>sig_ack hợp lệ</strong> — đúng chữ ký của {resolveAlias(ack.recipientPubKey)}</span>
                              <span className="block">🔹 <strong>msg_hash</strong> trong ACK khớp với tin đã gửi</span>
                              <span className="block">🔹 <strong>"To:A" hợp lệ</strong> — ACK không bị tái sử dụng.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex border-l border-green-500/20 bg-white">
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="w-full border border-transparent rounded-none rounded-r-2xl px-4 py-3 flex items-center justify-center text-xs font-bold text-corporate-500 hover:text-corporate-900 transition-colors bg-green-50/10 hover:bg-green-100"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  ), { duration: 15000 });
               }
            } catch (err) {
               console.error("Failed to decrypt or verify ACK intercept", err);
            }
         }

         if (hasNew) {
            localStorage.setItem(storageKey, JSON.stringify(Array.from(processedAcksRef.current)));
         }
      };

      processAcks();
   }, [deliveryAcks, user, sentMails, contacts]);

   const handleSaveProfile = () => {
      updateProfile({
         name: editForm.name,
         alias: editForm.name
      });
      setIsEditingProfile(false);
   };

   if (loading) {
      return (
         <div className="flex h-screen items-center justify-center bg-corporate-900">
            <div className="flex flex-col items-center space-y-4">
               <div className="w-12 h-12 border-4 border-white/20 border-t-accent-blue rounded-full animate-spin" />
               <p className="text-corporate-300 tracking-widest text-sm font-medium uppercase animate-pulse">Initializing Identity...</p>
            </div>
         </div>
      );
   }

   if (!user) {
      return <Navigate to="/login" replace />;
   }

   return (
      <div className="flex h-screen bg-corporate-50 overflow-hidden relative w-full">
         {/* Desktop Sidebar */}
         <div className="hidden md:block h-full shrink-0 z-10 relative">
            <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
         </div>

         {/* Mobile Sidebar Overlay */}
         <AnimatePresence>
            {isMobileMenuOpen && (
               <>
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="fixed inset-0 bg-corporate-900/40 backdrop-blur-sm z-40 md:hidden"
                  />
                  <motion.div
                     initial={{ x: '-100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '-100%' }}
                     transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                     className="fixed inset-y-0 left-0 w-[280px] bg-surface z-50 md:hidden shadow-2xl flex flex-col"
                  >
                     <Sidebar 
                        onOpenSettings={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }} 
                        onMobileClose={() => setIsMobileMenuOpen(false)}
                     />
                  </motion.div>
               </>
            )}
         </AnimatePresence>

         {/* Main Content Area */}
         <div className="flex-1 flex flex-col min-w-0 h-full w-full relative z-0">
            <Header onToggleMenu={() => setIsMobileMenuOpen(true)} />
            <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
               <div className="max-w-6xl mx-auto h-full w-full">
                  <Outlet />
               </div>
            </main>
         </div>

         {/* Settings Modal - Used to display Profile & Keys */}
         <AnimatePresence>
            {isSettingsOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-corporate-900/40 backdrop-blur-sm p-4">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-surface rounded-2xl shadow-xl border border-corporate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-full"
                  >
                     <div className="flex items-center justify-between p-6 border-b border-corporate-100 bg-white">
                        <div className="flex items-center space-x-3">
                           <ShieldCheck className="text-accent-blue" size={24} />
                           <h2 className="text-xl font-bold text-corporate-900">Security Center & Profile</h2>
                        </div>
                        <button onClick={() => { setIsSettingsOpen(false); setIsEditingProfile(false); }} className="text-corporate-400 hover:text-corporate-900 rounded-lg p-1 hover:bg-corporate-50 transition-colors">
                           <X size={20} />
                        </button>
                     </div>

                     <div className="p-6 overflow-y-auto space-y-8">
                        {/* Identity Section */}
                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 flex items-center"><Fingerprint size={16} className="mr-2" /> Your Identity</h3>
                              {!isEditingProfile ? (
                                 <button onClick={() => setIsEditingProfile(true)} className="flex items-center text-xs text-accent-blue hover:text-accent-blue-hover font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                    <Edit2 size={14} className="mr-1" /> Edit Profile
                                 </button>
                              ) : (
                                 <div className="flex space-x-2">
                                    <button onClick={() => setIsEditingProfile(false)} className="text-xs text-corporate-500 hover:text-corporate-900 px-3 py-1.5 font-medium transition-colors">Cancel</button>
                                    <button onClick={handleSaveProfile} className="flex items-center text-xs text-white bg-accent-blue hover:bg-accent-blue-hover px-4 py-1.5 rounded-lg shadow-sm font-medium transition-all">
                                       <Save size={14} className="mr-1" /> Save
                                    </button>
                                 </div>
                              )}
                           </div>

                           <div className="bg-corporate-50 p-5 rounded-xl border border-corporate-100">
                              {!isEditingProfile ? (
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                       <p className="text-xs text-corporate-400 font-medium mb-1">Display Name / Alias</p>
                                       <p className="font-semibold text-corporate-900">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-corporate-400 font-medium mb-1">Username</p>
                                       <p className="text-sm font-medium text-corporate-700 flex items-center"><UserIcon size={14} className="mr-1.5 text-corporate-400" /> {user.identityId}</p>
                                    </div>
                                    <div className="col-span-2">
                                       <p className="text-xs text-corporate-400 font-medium mb-1">Routing Email (Internal routing only)</p>
                                       <p className="text-sm font-medium text-corporate-600 font-mono">{user.email}</p>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-xs text-corporate-500 font-medium pl-1">Display Name / Alias</label>
                                       <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-white border border-corporate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-corporate-400 font-medium pl-1">Username (Immutable)</label>
                                       <div className="relative">
                                          <UserIcon className="absolute left-3 top-2.5 text-corporate-400" size={14} />
                                          <input type="text" disabled value={user.identityId} className="w-full bg-corporate-100 text-corporate-500 border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm cursor-not-allowed" />
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>

                        <div>
                           <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 mb-4 flex items-center"><Key size={16} className="mr-2" /> Public Key (Share with senders)</h3>
                           <p className="text-xs text-corporate-500 mb-2 leading-relaxed">Share this key with anyone so they can send encrypted messages specifically to you. Only your private key can decrypt these messages.</p>
                           <div className="relative group">
                              <pre className="text-xs font-mono text-corporate-700 bg-corporate-50 p-4 rounded-xl border border-corporate-200 overflow-x-auto selection:bg-accent-blue selection:text-white pb-10">
                                 {user.publicKey}
                              </pre>
                              <button
                                 onClick={async () => {
                                    if (user?.publicKey) {
                                       await navigator.clipboard.writeText(user.publicKey);
                                       setCopiedPubKey(true);
                                       setTimeout(() => setCopiedPubKey(false), 2000);
                                    }
                                 }}
                                 className="absolute bottom-3 right-3 bg-white border border-corporate-200 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm text-corporate-700 hover:text-accent-blue hover:border-accent-blue transition-all"
                              >
                                 {copiedPubKey ? 'Copied!' : 'Copy Public Key'}
                              </button>
                           </div>
                        </div>

                        <div>
                           <h3 className="text-sm uppercase tracking-wider font-semibold text-red-500 mb-4 flex items-center"><Key size={16} className="mr-2" /> Private Key (DO NOT SHARE)</h3>
                           <p className="text-xs text-corporate-500 mb-2 leading-relaxed">This key is derived from your Master Password. It never leaves your device and is used locally to decrypt incoming messages.</p>
                           <div className="relative">
                              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl cursor-default transition-opacity hover:opacity-0 group">
                                 <span className="bg-corporate-900 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-lg group-hover:scale-95 transition-transform">Hover to reveal</span>
                              </div>
                              <pre className="text-xs font-mono text-corporate-700 bg-red-50 p-4 rounded-xl border border-red-100 overflow-x-auto selection:bg-red-500 selection:text-white">
                                 {user.privateKey}
                              </pre>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}
