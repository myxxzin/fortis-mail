import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, User as UserIcon, FileText, ClipboardList, Paperclip, X, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useLanguage } from '../contexts/LanguageContext';

import { encryptMessageHybrid, packHybridPayload, encryptFile } from '../utils/cryptoAuth';
import { toast } from 'react-hot-toast';

export default function Compose() {
  const [step, setStep] = useState<'compose' | 'encrypting' | 'success' | 'sent'>('compose');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  const draftLoaded = useRef(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientPubKey, setRecipientPubKey] = useState('');
  const [recipientAlias, setRecipientAlias] = useState('');
  const [senderDisplay, setSenderDisplay] = useState(user?.name || '');
  const [files, setFiles] = useState<File[]>([]);

  const currentDraftId = useRef<string | null>(draftId);
  const isDiscardingOrSending = useRef(false);
  const latestDraftState = useRef({ subject, body, recipientPubKey, senderDisplay, step });

  useEffect(() => {
    latestDraftState.current = { subject, body, recipientPubKey, senderDisplay, step };
  }, [subject, body, recipientPubKey, senderDisplay, step]);

  useEffect(() => {
    if (user?.name && !senderDisplay) {
      setSenderDisplay(user.name);
    }
  }, [user]);

  const [pasteError, setPasteError] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  const { drafts, sendMail, saveDraft, deleteDraft } = useMail();
  const { contacts } = useContacts();

  // Load draft from URL or recover from local storage
  useEffect(() => {
    if (draftId && drafts && !draftLoaded.current) {
      const draft = drafts.find(d => d.id === draftId);
      if (draft) {
        setSubject(draft.subject || '');
        setBody(draft.content || '');
        setRecipientPubKey(draft.recipientPubKey || '');
        setSenderDisplay(draft.senderDisplay || user?.name || '');
        currentDraftId.current = draftId;
        draftLoaded.current = true;
      }
    } else if (!draftId && !draftLoaded.current) {
      const recovered = localStorage.getItem('fortis_composing_draft');
      if (recovered) {
        try {
          const parsed = JSON.parse(recovered);
          if (parsed.subject || parsed.body || parsed.recipientPubKey) {
            setSubject(parsed.subject || '');
            setBody(parsed.body || '');
            setRecipientPubKey(parsed.recipientPubKey || '');
            setSenderDisplay(parsed.senderDisplay || user?.name || '');
            if (parsed.draftId) currentDraftId.current = parsed.draftId;
          }
        } catch (e) { }
        localStorage.removeItem('fortis_composing_draft');
      }
      draftLoaded.current = true;
    }
  }, [draftId, drafts, user]);

  // Handle auto-save on beforeunload (refresh/close tab)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const { subject, body, recipientPubKey, senderDisplay, step } = latestDraftState.current;
      if (step === 'compose' && !isDiscardingOrSending.current && (subject || body || recipientPubKey)) {
        localStorage.setItem('fortis_composing_draft', JSON.stringify({
          subject, body, recipientPubKey, senderDisplay, draftId: currentDraftId.current
        }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Handle SPA unmount (clicking 'Back' button or navigating away)
  useEffect(() => {
    return () => {
      const { subject, body, recipientPubKey, senderDisplay, step } = latestDraftState.current;
      if (step === 'compose' && !isDiscardingOrSending.current && (subject || body || recipientPubKey)) {
        // Asynchronously save to Firebase drafts the final state
        saveDraft({
          subject, content: body, recipientPubKey, senderDisplay: senderDisplay || 'Anonymous'
        }, currentDraftId.current || undefined).catch(() => { });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONLY on unmount

  // Debounced auto-save to server while typing
  useEffect(() => {
    if (step !== 'compose' || isEncrypting || !draftLoaded.current || isDiscardingOrSending.current) return;
    if (!subject && !body && !recipientPubKey) return;

    const timer = setTimeout(async () => {
      try {
        const id = await saveDraft({
          subject,
          content: body,
          recipientPubKey,
          senderDisplay: senderDisplay || 'Anonymous'
        }, currentDraftId.current || undefined);
        currentDraftId.current = id;
      } catch (err) {
        console.error("Auto-save draft failed", err);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [subject, body, recipientPubKey, senderDisplay, step, isEncrypting, saveDraft]);

  // Handle incoming Reply state
  useEffect(() => {
    const replyTo = location.state?.replyTo;
    if (replyTo) {
      setRecipientPubKey(replyTo);
      const contact = contacts.find(c => c.publicKey === replyTo);
      if (contact) {
        setRecipientAlias(contact.alias);
      }
    }
  }, [location.state, contacts]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    isDiscardingOrSending.current = true;
    localStorage.removeItem('fortis_composing_draft');
    setIsEncrypting(true);

    try {
      // Upload attachments if any
      const uploadedFiles = [];
      const attachmentKeys: { id: string, fileKeyBase64: string, ivBase64: string }[] = [];
      if (user && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const uniqueId = Math.random().toString(36).substring(2, 15);
          const fileRef = ref(storage, `attachments/${user.uid}/${Date.now()}-${uniqueId}-${file.name}`);

          const { ciphertextBlob, fileKeyBase64, ivBase64 } = await encryptFile(file);

          // Nếu cấu hình Firebase Storage sai hoặc chưa bật trên Console,
          // SDK sẽ tự động retry và gây treo vô hạn. Ta dùng timeout 15 giây để ngắt mạch.
          const uploadPromise = uploadBytes(fileRef, ciphertextBlob);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Lỗi tải lên Firebase: Quá thời gian. Vui lòng kiểm tra lại xem bạn đã bật Firebase Storage chưa hoặc kết nối mạng bị giới hạn.")), 15000)
          );
          
          const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
          const downloadUrl = await getDownloadURL(snapshot.ref);

          return {
            fileData: {
              name: file.name,
              url: downloadUrl,
              size: file.size,
              type: file.type
            },
            keyData: {
              id: downloadUrl,
              fileKeyBase64,
              ivBase64
            }
          };
        });

        const results = await Promise.all(uploadPromises);
        for (const res of results) {
          uploadedFiles.push(res.fileData);
          attachmentKeys.push(res.keyData);
        }
      }

      const keysParam = attachmentKeys.length > 0 ? attachmentKeys : undefined;

      const payload = await encryptMessageHybrid(
        body,
        recipientPubKey.trim(),
        user!.privateKey!,
        user!.publicKey,
        recipientPubKey.trim(),
        keysParam
      );

      const asciiArmor = packHybridPayload(payload);
      const encryptedContent = asciiArmor;

      await sendMail({
        recipientPubKey: recipientPubKey.trim(),
        subject,
        content: encryptedContent,
        senderDisplay: senderDisplay || 'Anonymous',
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined
      });

      if (currentDraftId.current) {
        await deleteDraft(currentDraftId.current);
        currentDraftId.current = null;
      }

      setStep('success');
      setIsEncrypting(false);
      setTimeout(() => {
        setSubject('');
        setBody('');
        setRecipientPubKey('');
        setRecipientAlias('');
        setFiles([]);
        navigate('/inbox');
      }, 2000);
    } catch (error) {
      console.error("Failed to send mail:", error);
      isDiscardingOrSending.current = false;
      setIsEncrypting(false);
      setStep('compose');
      toast.error(`${t('compose.errSend')} ${(error as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-8 w-full mb-10 transition-colors duration-300">
      <button
        type="button"
        onClick={() => navigate('/inbox')}
        className="flex items-center space-x-2 text-corporate-500 hover:text-corporate-900 dark:text-white dark:hover:text-white mb-6 transition-colors w-max shrink-0 font-sans"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">{t('compose.backToInbox')}</span>
      </button>

      <div className="bg-surface dark:bg-[#020617] rounded-2xl shadow-sm border border-corporate-200 dark:border-white/10 flex flex-col relative w-full max-w-4xl mx-auto overflow-hidden transition-colors duration-300">
        <div className="px-6 py-5 border-b border-corporate-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#020617] shrink-0 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-corporate-900 dark:text-white tracking-tight flex items-center">
            <img src="/logo.png" alt="FortisMail" className="h-8 object-contain mr-3" />
            {t('compose.title')}
          </h1>
          <div className="text-xs font-bold uppercase tracking-widest text-corporate-400 dark:text-white bg-corporate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-corporate-100 dark:border-white/10">
            {t('compose.encryptedBadge')}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isEncrypting && (
            <motion.div
              key="encrypting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center space-y-4 flex-1 min-h-[400px] bg-white dark:bg-[#020617] p-12 rounded-b-2xl border-t border-corporate-200 dark:border-slate-800"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-16 h-16 border-4 border-corporate-700 dark:border-slate-800 border-t-accent-blue rounded-full mb-6"
                />
                <h2 className="text-xl font-bold text-corporate-900 dark:text-white font-mono tracking-widest leading-relaxed uppercase">{t('compose.encrypting')}</h2>
              </div>
            </motion.div>
          )}

          {step === 'compose' && !isEncrypting && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col"
            >
              <form onSubmit={handleSend} className="flex flex-col relative">
                {/* Form Body */}
                <div className="p-6 md:p-8 space-y-6 bg-corporate-50/10 dark:bg-transparent">
                  <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:items-center gap-1 md:gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 dark:text-white tracking-wider text-left md:text-right pl-1 md:pl-0">{t('compose.from')}</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400 dark:text-white" size={16} />
                      <input
                        type="text"
                        value={senderDisplay}
                        onChange={e => setSenderDisplay(e.target.value)}
                        placeholder={t('compose.fromPlaceholder')}
                        className="w-full bg-white dark:bg-slate-800 text-corporate-900 dark:text-white border border-corporate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:items-center gap-1 md:gap-4 relative">
                    <label className="text-xs font-semibold uppercase text-corporate-500 dark:text-white tracking-wider text-left md:text-right pl-1 md:pl-0">{t('compose.to')}</label>
                    <div className="relative">
                      <div className="absolute right-0 bottom-full mb-1 flex justify-end md:justify-between items-end w-full pointer-events-none z-10">
                        <span className="hidden md:block text-[10px] text-corporate-400 dark:text-white font-medium h-4 text-left pointer-events-auto">{recipientAlias && `${t('compose.contactPrefix')} ${recipientAlias}`}</span>
                        <div className="flex items-center space-x-2 pointer-events-auto">
                          {pasteError && <span className="text-[10px] text-red-500 font-medium">{pasteError}</span>}
                          <button type="button" onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              setRecipientPubKey(text);
                              setRecipientAlias('');
                              setPasteError('');
                            } catch (err) {
                              console.error("Paste failed", err);
                              setPasteError(t('compose.pasteBlocked'));
                            }
                          }} className="text-[10px] bg-blue-50 dark:bg-accent-blue/10 text-accent-blue hover:bg-blue-100 dark:hover:bg-accent-blue/20 font-bold px-2 py-1 rounded transition-colors flex items-center">
                            <ClipboardList size={12} className="mr-1" /> {t('compose.paste')}
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          required
                          value={recipientPubKey}
                          onChange={e => { setRecipientPubKey(e.target.value); setRecipientAlias(''); setPasteError(''); }}
                          onFocus={() => setShowContactDropdown(true)}
                          onBlur={() => setTimeout(() => setShowContactDropdown(false), 200)}
                          rows={2}
                          placeholder={t('compose.toPlaceholder')}
                          className="w-full bg-white dark:bg-slate-800 text-corporate-900 dark:text-white border border-corporate-200 dark:border-slate-700 rounded-lg pr-3 pl-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-mono resize-none"
                        />

                        {/* Contact Dropdown overlay directly on Public Key */}
                        <AnimatePresence>
                          {showContactDropdown && contacts.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute z-50 mt-1 w-full bg-white dark:bg-[#020617] border border-corporate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto"
                            >
                              <div className="px-3 py-2 bg-corporate-50 dark:bg-white/5 border-b border-corporate-100 dark:border-white/5 text-[10px] uppercase font-bold text-corporate-400 dark:text-white tracking-wider">
                                {t('compose.chooseContact')}
                              </div>
                              {contacts.map(contact => (
                                <button
                                  key={contact.id}
                                  type="button"
                                  onClick={() => {
                                    setRecipientPubKey(contact.publicKey);
                                    setRecipientAlias(contact.alias);
                                    setShowContactDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/5 border-b border-corporate-50 dark:border-transparent last:border-0 transition-colors flex items-center justify-between group"
                                >
                                  <div className="flex flex-col min-w-0 pr-4">
                                    <span className="text-sm font-semibold text-corporate-900 dark:text-white truncate group-hover:text-accent-blue">{contact.alias}</span>
                                    <span className="text-xs text-corporate-500 dark:text-white font-mono truncate">{contact.publicKey.substring(0, 32)}...</span>
                                  </div>
                                  <div className="shrink-0 w-6 h-6 rounded-full bg-corporate-100 dark:bg-white/10 flex items-center justify-center text-corporate-400 dark:text-white group-hover:bg-accent-blue group-hover:text-white transition-colors">
                                    <UserIcon size={12} />
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:grid md:grid-cols-[150px_1fr] md:items-center gap-1 md:gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 dark:text-white tracking-wider text-left md:text-right pl-1 md:pl-0">{t('compose.subject')}</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400 dark:text-white" size={16} />
                      <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder={t('compose.subjectPlaceholder')} className="w-full bg-white dark:bg-slate-800 text-corporate-900 dark:text-white border border-corporate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-medium" />
                    </div>
                  </div>

                  {/* Message Body - Scrolls naturally with the rest of the form */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase text-corporate-500 dark:text-white tracking-wider">{t('compose.body')}</label>
                      <span className="text-xs text-corporate-400 dark:text-white font-medium bg-corporate-100 dark:bg-white/10 px-2 py-0.5 rounded">{t('compose.markdown')}</span>
                    </div>
                    <textarea required value={body} onChange={e => setBody(e.target.value)} placeholder={t('compose.bodyPlaceholder')} className="w-full min-h-[200px] h-48 bg-white dark:bg-slate-800 text-corporate-900 dark:text-white border border-corporate-200 dark:border-slate-700 hover:border-corporate-300 dark:hover:border-slate-600 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-blue-50 dark:focus:ring-accent-blue/10 transition-all resize-y shadow-sm font-sans leading-relaxed"></textarea>
                  </div>

                  {/* Attachments Section */}
                  <div className="pt-2 border-t border-corporate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <label className="text-xs font-semibold uppercase text-corporate-500 dark:text-white tracking-wider">{t('compose.attachments')}</label>
                      <div>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const selectedFiles = Array.from(e.target.files);
                              setFiles(prev => [...prev, ...selectedFiles]);
                            }
                            // Reset to allow selecting the same file again
                            e.target.value = '';
                          }}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer text-xs bg-corporate-100 dark:bg-white/10 hover:bg-corporate-200 dark:hover:bg-white/20 text-corporate-700 dark:text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center">
                          <Paperclip size={14} className="mr-1.5" /> {t('compose.attachFiles')}
                        </label>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 border border-corporate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <div className="w-8 h-8 rounded bg-blue-50 dark:bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                                <FileText size={16} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-corporate-900 dark:text-white truncate">{file.name}</span>
                                <span className="text-xs text-corporate-500 dark:text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="w-8 h-8 flex items-center justify-center text-corporate-400 dark:text-white hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar - Pinned */}
                <div className="shrink-0 p-6 border-t border-corporate-100 dark:border-white/10 bg-corporate-50 dark:bg-transparent">
                  <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="p-3 bg-green-50/50 dark:bg-green-500/5 rounded-xl border border-green-100 dark:border-green-500/10 flex items-start space-x-3 flex-1 min-w-0">
                      <Lock className="text-green-600 dark:text-green-500 mt-0.5 shrink-0" size={16} />
                      <div className="flex-1 w-full flex flex-col justify-center">
                         <p className="text-xs font-semibold text-corporate-900 dark:text-white mb-0.5">{t('compose.activeEncryption')}</p>
                         <p className="text-[10px] text-corporate-500 font-medium"></p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          isDiscardingOrSending.current = true;
                          localStorage.removeItem('fortis_composing_draft');
                          if (currentDraftId.current) {
                            deleteDraft(currentDraftId.current);
                            currentDraftId.current = null;
                          }
                          setStep('compose');
                          setSubject('');
                          setBody('');
                          setRecipientPubKey('');
                          setRecipientAlias('');
                          setFiles([]);
                          navigate('/inbox');
                        }}
                        className="px-4 py-2.5 border border-corporate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-corporate-700 dark:text-white hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/30 transition-colors shadow-sm flex items-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">{t('compose.discard')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!subject && !body && !recipientPubKey) return;
                          isDiscardingOrSending.current = true;
                          localStorage.removeItem('fortis_composing_draft');
                          await saveDraft({
                            subject,
                            content: body,
                            recipientPubKey,
                            senderDisplay: senderDisplay || 'Anonymous'
                          }, currentDraftId.current || undefined);
                          navigate('/drafts');
                        }}
                        className="px-4 py-2.5 border border-corporate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-corporate-700 dark:text-white hover:bg-blue-50 dark:hover:bg-accent-blue/10 hover:text-accent-blue dark:hover:text-accent-blue hover:border-blue-200 dark:hover:border-accent-blue/30 transition-colors shadow-sm flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span className="hidden sm:inline">{t('compose.saveDraft')}</span>
                      </button>

                      <button type="submit" className="px-6 py-2.5 bg-white border border-corporate-200 text-corporate-900 dark:bg-white/10 rounded-xl text-sm font-semibold dark:text-white hover:bg-corporate-50 dark:hover:bg-white/20 transition-colors shadow-sm flex items-center space-x-2">
                        <Lock size={16} />
                        <span>{t('compose.encryptAndSend')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-4 flex-1 min-h-[400px] bg-white dark:bg-[#020617] p-12 rounded-b-2xl border-t border-green-100 dark:border-green-500/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <CheckCircle2 className="text-green-500" size={64} />
              </motion.div>
              <h2 className="text-2xl font-bold text-corporate-900 dark:text-white tracking-tight">{t('compose.successTitle')}</h2>
              <p className="text-corporate-500 dark:text-white text-sm">{t('compose.successDesc')}</p>
            </motion.div>
          )}

          {step === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-6 flex-1 min-h-[400px] bg-white dark:bg-[#020617] p-12"
            >
              <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-corporate-900 dark:text-white tracking-tight">{t('compose.encryptSuccess')}</h2>
              <p className="text-corporate-500 dark:text-white max-w-sm text-center text-sm leading-relaxed mb-4">
                {t('compose.encryptSuccessDesc')}
              </p>
              <button
                onClick={() => {
                  setStep('compose');
                  setRecipientAlias('');
                  setSubject('');
                  setBody('');
                  setRecipientPubKey('');
                  setFiles([]);
                }}
                className="px-8 py-3 bg-white border border-corporate-200 text-corporate-900 dark:bg-white/10 hover:bg-corporate-50 dark:hover:bg-white/20 dark:text-white rounded-xl transition-all shadow-sm font-medium mt-4"
              >
                {t('compose.composeAnother')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
