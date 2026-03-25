import { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import OnboardingModal from '../components/OnboardingModal';
import ChangePinModal from '../components/ChangePinModal';
import ProductTour, { replayProductTour } from '../components/ProductTour';
import { useAuth } from '../context/AuthContext';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { decryptMessageHybrid, unpackHybridPayload, type EncryptedMessagePayload } from '../utils/cryptoAuth';
import { X, Key, Fingerprint, ShieldCheck, Edit2, Save, User as UserIcon, Lock, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-hot-toast';

export default function MainLayout() {
   const { user, loading, updateProfile } = useAuth();
   const { deliveryAcks, sentMails } = useMail();
   const { contacts } = useContacts();
   const { t } = useLanguage();
   
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [isEditingProfile, setIsEditingProfile] = useState(false);
   const [showOnboarding, setShowOnboarding] = useState(false);
   const [showChangePinModal, setShowChangePinModal] = useState(false);
   const [copiedPubKey, setCopiedPubKey] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   
   const isTourReady = !loading && !!user && !showOnboarding && !showChangePinModal;

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
         const isPinSet = !!user.pinHash;
         if (!isPinSet) {
            setShowOnboarding(true);
         } else {
            setShowOnboarding(false);
         }
      }
   }, [user, isEditingProfile]);

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
                  // Valid ACK! (Notification removed per user request)
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

   const handleSaveProfile = async () => {
      try {
         await updateProfile({
            name: editForm.name,
            alias: editForm.name
         });
         setIsEditingProfile(false);
      } catch (err) {
         toast.error(t('settings.profileUpdateError'));
      }
   };

   if (loading) {
      return (
         <div className="flex h-screen items-center justify-center bg-white dark:bg-black transition-colors duration-300">
            <div className="flex flex-col items-center space-y-4">
               <div className="w-12 h-12 border-4 border-corporate-200 dark:border-white/20 border-t-accent-blue rounded-full animate-spin" />
               <p className="text-corporate-500 dark:text-white tracking-widest text-sm font-medium uppercase animate-pulse">Initializing Identity...</p>
            </div>
         </div>
      );
   }

   if (!user) {
      return <Navigate to="/login" replace />;
   }

   return (
      <div className="flex h-screen bg-corporate-50 dark:bg-black overflow-hidden relative w-full transition-colors duration-300">
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
                     className="fixed inset-0 bg-corporate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden"
                  />
                  <motion.div
                     initial={{ x: '-100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '-100%' }}
                     transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                     className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-slate-900 z-50 md:hidden shadow-2xl flex flex-col"
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

         {/* Onboarding Modal */}
         <AnimatePresence>
            {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
            {showChangePinModal && <ChangePinModal onClose={() => setShowChangePinModal(false)} />}
         </AnimatePresence>

         {/* Product Tour Overlay (Headless) */}
         <ProductTour isReady={isTourReady} />

         {/* Settings Modal - Used to display Profile & Keys */}
         <AnimatePresence>
            {isSettingsOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-corporate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-corporate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-full transition-colors duration-300"
                  >
                     <div className="flex items-center justify-between p-6 border-b border-corporate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex items-center space-x-3">
                           <ShieldCheck className="text-accent-blue" size={24} />
                           <h2 className="text-xl font-bold text-corporate-900 dark:text-white">{t('settings.title')}</h2>
                        </div>
                        <button onClick={() => { setIsSettingsOpen(false); setIsEditingProfile(false); }} className="text-corporate-400 dark:text-white hover:text-corporate-900 dark:hover:text-white rounded-lg p-1 hover:bg-corporate-50 dark:hover:bg-white/10 transition-colors">
                           <X size={20} />
                        </button>
                     </div>

                     <div className="p-6 overflow-y-auto space-y-8">
                        {/* Identity Section */}
                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 dark:text-white flex items-center"><Fingerprint size={16} className="mr-2" /> {t('settings.identity')}</h3>
                              {!isEditingProfile ? (
                                 <button onClick={() => setIsEditingProfile(true)} className="flex items-center text-xs text-accent-blue hover:text-accent-blue-hover font-medium bg-blue-50 dark:bg-accent-blue/10 px-3 py-1.5 rounded-lg transition-colors">
                                    <Edit2 size={14} className="mr-1" /> {t('settings.editProfile')}
                                 </button>
                              ) : (
                                 <div className="flex space-x-2">
                                    <button onClick={() => setIsEditingProfile(false)} className="text-xs text-corporate-500 dark:text-white hover:text-corporate-900 dark:hover:text-white px-3 py-1.5 font-medium transition-colors">{t('settings.cancel')}</button>
                                    <button onClick={handleSaveProfile} className="flex items-center text-xs text-white bg-accent-blue hover:bg-accent-blue-hover px-4 py-1.5 rounded-lg shadow-sm font-medium transition-all">
                                       <Save size={14} className="mr-1" /> {t('settings.save')}
                                    </button>
                                 </div>
                              )}
                           </div>

                           <div className="bg-corporate-50 dark:bg-white/5 p-5 rounded-xl border border-corporate-100 dark:border-transparent">
                              {!isEditingProfile ? (
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                       <p className="text-xs text-corporate-400 dark:text-white font-medium mb-1">{t('settings.displayName')}</p>
                                       <p className="font-semibold text-corporate-900 dark:text-white">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-corporate-400 dark:text-white font-medium mb-1">{t('settings.username')}</p>
                                       <p className="text-sm font-medium text-corporate-700 dark:text-white flex items-center"><UserIcon size={14} className="mr-1.5 text-corporate-400 dark:text-white" /> {user.identityId}</p>
                                    </div>
                                    <div className="col-span-2">
                                       <p className="text-xs text-corporate-400 dark:text-white font-medium mb-1">{t('settings.routingEmail')}</p>
                                       <p className="text-sm font-medium text-corporate-600 dark:text-white font-mono">{user.email}</p>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-xs text-corporate-500 dark:text-white font-medium pl-1">{t('settings.displayName')}</label>
                                       <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-white dark:bg-slate-800 text-corporate-900 dark:text-white border border-corporate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-corporate-400 dark:text-white font-medium pl-1">{t('settings.usernameImmutable')}</label>
                                       <div className="relative">
                                          <UserIcon className="absolute left-3 top-2.5 text-corporate-400 dark:text-white" size={14} />
                                          <input type="text" disabled value={user.identityId} className="w-full bg-corporate-100 dark:bg-slate-800 text-corporate-500 dark:text-white border border-corporate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm cursor-not-allowed" />
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* PIN Settings Section */}
                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 dark:text-white flex items-center"><Lock size={16} className="mr-2" /> {t('settings.pinTitle')}</h3>
                              <button onClick={() => setShowChangePinModal(true)} className="flex items-center text-xs text-accent-blue hover:text-accent-blue-hover font-medium bg-blue-50 dark:bg-accent-blue/10 px-3 py-1.5 rounded-lg transition-colors">
                                 <Edit2 size={14} className="mr-1" /> {t('settings.changePin')}
                              </button>
                           </div>
                           
                           <div className="bg-corporate-50 dark:bg-white/5 p-5 rounded-xl border border-corporate-100 dark:border-transparent">
                              <div className="flex items-center justify-between">
                                 <p className="text-sm text-corporate-600 dark:text-gray-300">
                                    {user.pinHash ? t('settings.pinSetDesc') : t('settings.pinNotSetDesc')}
                                 </p>
                                 {user.pinHash && <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 dark:bg-green-900/20 dark:border-green-800"><ShieldCheck size={12} className="mr-1"/> {t('settings.enabled')}</span>}
                              </div>
                           </div>
                        </div>

                        {/* Product Tour Replay Section */}
                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 dark:text-white flex items-center"><PlayCircle size={16} className="mr-2" /> {t('settings.replayTourTitle')}</h3>
                              <button 
                                 onClick={() => {
                                    setIsSettingsOpen(false);
                                    setTimeout(() => replayProductTour(user.uid), 300);
                                 }} 
                                 className="flex items-center text-xs text-corporate-700 dark:text-white bg-corporate-100 dark:bg-white/10 hover:bg-corporate-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                 <PlayCircle size={14} className="mr-1.5" /> {t('settings.replayTour')}
                              </button>
                           </div>
                           
                           <div className="bg-corporate-50 dark:bg-white/5 p-5 rounded-xl border border-corporate-100 dark:border-transparent">
                              <p className="text-sm text-corporate-600 dark:text-gray-300">
                                 {t('settings.replayTourDesc')}
                              </p>
                           </div>
                        </div>

                        <div>
                           <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 dark:text-white mb-4 flex items-center"><Key size={16} className="mr-2" /> {t('settings.publicKey')}</h3>
                           <p className="text-xs text-corporate-500 dark:text-white mb-2 leading-relaxed">{t('settings.publicKeyDesc')}</p>
                           <div className="relative group">
                              <pre className="text-xs font-mono text-corporate-700 dark:text-white bg-corporate-50 dark:bg-slate-800 p-4 rounded-xl border border-corporate-200 dark:border-slate-700 overflow-x-auto selection:bg-accent-blue selection:text-white pb-10">
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
                                 className="absolute bottom-3 right-3 bg-white dark:bg-slate-700 border border-corporate-200 dark:border-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm text-corporate-700 dark:text-corporate-200 hover:text-accent-blue dark:hover:text-accent-blue hover:border-accent-blue transition-all"
                              >
                                 {copiedPubKey ? t('settings.copied') : t('settings.copyPubKey')}
                              </button>
                           </div>
                        </div>

                        <div>
                           <h3 className="text-sm uppercase tracking-wider font-semibold text-red-500 dark:text-red-400 mb-4 flex items-center"><Key size={16} className="mr-2" /> {t('settings.privateKey')}</h3>
                           <p className="text-xs text-corporate-500 dark:text-white mb-2 leading-relaxed">{t('settings.privateKeyDesc')}</p>
                           <div className="relative">
                              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl cursor-default transition-opacity hover:opacity-0 group">
                                 <span className="bg-corporate-900 dark:bg-white text-white dark:text-corporate-900 font-bold text-xs px-4 py-2 rounded-lg shadow-lg group-hover:scale-95 transition-transform">{t('settings.hoverReveal')}</span>
                              </div>
                              <pre className="text-xs font-mono text-corporate-700 dark:text-white bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-500/20 overflow-x-auto selection:bg-red-500 selection:text-white">
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
