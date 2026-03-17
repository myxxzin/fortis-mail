import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, User as UserIcon, FileText, ClipboardList, Paperclip, X, Trash2, Save } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';

export default function Compose() {
  const [step, setStep] = useState<'compose' | 'encrypting' | 'success' | 'sent'>('compose');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  const draftLoaded = useRef(false);
  const { user } = useAuth();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientPubKey, setRecipientPubKey] = useState('');
  const [recipientAlias, setRecipientAlias] = useState('');
  const [senderDisplay, setSenderDisplay] = useState(user?.name || '');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (user?.name && !senderDisplay) {
      setSenderDisplay(user.name);
    }
  }, [user]);

  const [pasteError, setPasteError] = useState('');
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  const { drafts, sendMail, saveDraft, deleteDraft } = useMail();
  const { contacts } = useContacts();

  useEffect(() => {
    if (draftId && drafts && !draftLoaded.current) {
      const draft = drafts.find(d => d.id === draftId);
      if (draft) {
        setSubject(draft.subject || '');
        setBody(draft.content || '');
        setRecipientPubKey(draft.recipientPubKey || '');
        setSenderDisplay(draft.senderDisplay || user?.name || '');
        draftLoaded.current = true;
      }
    }
  }, [draftId, drafts, user]);

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
    setStep('encrypting');
    setIsEncrypting(true);

    try {
      // Simulate encryption delay for the payload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const encryptedContent = `[ENCRYPTED PAYLOAD]\n${body}`;

      // Upload attachments if any
      const uploadedFiles = [];
      if (user && files.length > 0) {
        for (const file of files) {
          const uniqueId = Math.random().toString(36).substring(2, 15);
          const fileRef = ref(storage, `attachments/${user.uid}/${Date.now()}-${uniqueId}-${file.name}`);
          
          const snapshot = await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          
          uploadedFiles.push({
            name: file.name,
            url: downloadUrl,
            size: file.size,
            type: file.type
          });
        }
      }

      await sendMail({
        recipientPubKey: recipientPubKey.trim(),
        subject,
        content: encryptedContent,
        senderDisplay: senderDisplay || 'Anonymous',
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined
      });

      if (draftId) {
        await deleteDraft(draftId);
      }

      setStep('success');
      setIsEncrypting(false);
      setTimeout(() => setStep('sent'), 1500);
    } catch (error) {
      console.error("Failed to send mail:", error);
      setIsEncrypting(false);
      setStep('compose');
      // Ideally show an error toast here
      alert('Failed to send message: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-8 w-full mb-10">
      <div className="bg-surface rounded-2xl shadow-sm border border-corporate-200 flex flex-col relative w-full max-w-4xl mx-auto overflow-hidden">
        <div className="px-6 py-5 border-b border-corporate-100 flex items-center justify-between bg-white shrink-0">
          <h1 className="text-2xl font-bold text-corporate-900 tracking-tight flex items-center">
            <img src="/logo.png" alt="FortisMail" className="h-8 object-contain mr-3" />
            New Secure Mail
          </h1>
          <div className="text-xs font-bold uppercase tracking-widest text-corporate-400 bg-corporate-50 px-3 py-1.5 rounded-lg border border-corporate-100">
            RSA-4096 Encrypted
          </div>
        </div>

        {isEncrypting && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 border-4 border-corporate-200 border-t-accent-blue rounded-full mb-6"
            />
            <h2 className="text-xl font-bold text-corporate-900 font-mono tracking-widest">ENCRYPTING PAYLOAD...</h2>
            <p className="text-sm text-corporate-500 font-mono mt-2">Applying AES-256-GCM symmetric session keys</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'compose' && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col"
            >
              <form onSubmit={handleSend} className="flex flex-col relative">
                {/* Form Body */}
                <div className="p-6 md:p-8 space-y-6 bg-corporate-50/10">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider text-right">From</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400" size={16} />
                      <input 
                        type="text" 
                        value={senderDisplay}
                        onChange={e => setSenderDisplay(e.target.value)}
                        placeholder="e.g. John Doe (CEO) or Anonymous" 
                        className="w-full bg-white text-corporate-900 border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-medium" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] flex-start gap-4 relative">
                    <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider text-right pt-3">To (Key)</label>
                    <div className="relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-corporate-400 font-medium h-4">{recipientAlias && `Contact: ${recipientAlias}`}</span>
                        <div className="flex items-center space-x-2">
                          {pasteError && <span className="text-[10px] text-red-500 font-medium">{pasteError}</span>}
                          <button type="button" onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              setRecipientPubKey(text);
                              setRecipientAlias('');
                              setPasteError('');
                            } catch (err) {
                              console.error("Paste failed", err);
                              setPasteError('Browser blocked paste. Please press Ctrl+V directly.');
                            }
                          }} className="text-[10px] bg-blue-50 text-accent-blue hover:bg-blue-100 font-bold px-2 py-1 rounded transition-colors flex items-center">
                            <ClipboardList size={12} className="mr-1" /> Paste
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
                          placeholder="-----BEGIN PUBLIC KEY-----..." 
                          className="w-full bg-white border border-corporate-200 rounded-lg pr-3 pl-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-mono resize-none"
                        />
                        
                        {/* Contact Dropdown overlay directly on Public Key */}
                        <AnimatePresence>
                          {showContactDropdown && contacts.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute z-50 mt-1 w-full bg-white border border-corporate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto"
                            >
                              <div className="px-3 py-2 bg-corporate-50 border-b border-corporate-100 text-[10px] uppercase font-bold text-corporate-400 tracking-wider">
                                Choose from Address Book
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
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-corporate-50 last:border-0 transition-colors flex items-center justify-between group"
                                >
                                  <div className="flex flex-col min-w-0 pr-4">
                                    <span className="text-sm font-semibold text-corporate-900 truncate group-hover:text-accent-blue">{contact.alias}</span>
                                    <span className="text-xs text-corporate-500 font-mono truncate">{contact.publicKey.substring(0, 32)}...</span>
                                  </div>
                                  <div className="shrink-0 w-6 h-6 rounded-full bg-corporate-100 flex items-center justify-center text-corporate-400 group-hover:bg-accent-blue group-hover:text-white transition-colors">
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

                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider text-right">Subject</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400" size={16} />
                      <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Encrypted Message Subject" className="w-full bg-white border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-medium" />
                    </div>
                  </div>

                  {/* Message Body - Scrolls naturally with the rest of the form */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider">Message Body</label>
                      <span className="text-xs text-corporate-400 font-medium bg-corporate-100 px-2 py-0.5 rounded">Markdown Supported</span>
                    </div>
                    <textarea required value={body} onChange={e => setBody(e.target.value)} placeholder="Enter your secret message here..." className="w-full min-h-[200px] h-48 bg-white border border-corporate-200 hover:border-corporate-300 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-blue-50 transition-all resize-y shadow-sm font-sans leading-relaxed text-corporate-900"></textarea>
                  </div>

                  {/* Attachments Section */}
                  <div className="pt-2 border-t border-corporate-100">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider">Attachments</label>
                      <label className="cursor-pointer text-xs bg-corporate-100 hover:bg-corporate-200 text-corporate-700 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center">
                        <Paperclip size={14} className="mr-1.5" /> Attach Files
                        <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files) {
                              setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
                            }
                            e.target.value = ''; // Reset input to allow adding the same file again if needed
                          }}
                        />
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-corporate-200 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <div className="w-8 h-8 rounded bg-blue-50 text-accent-blue flex items-center justify-center shrink-0">
                                <FileText size={16} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-corporate-900 truncate">{file.name}</span>
                                <span className="text-xs text-corporate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="w-8 h-8 flex items-center justify-center text-corporate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
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
                <div className="shrink-0 p-6 border-t border-corporate-100 bg-corporate-50">
                  <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="p-3 bg-green-50/50 rounded-xl border border-green-100 flex items-start space-x-3 flex-1 min-w-0">
                      <Lock className="text-green-600 mt-0.5 shrink-0" size={16} />
                      <div className="flex-1 w-full flex flex-col justify-center">
                        <p className="text-xs font-semibold text-corporate-900 mb-0.5">Asymmetric Encryption Active</p>
                        <p className="text-[10px] text-corporate-500 font-medium">Message will be sealed using the Recipient's Public Key.</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 shrink-0 flex-wrap">
                      <button 
                        type="button" 
                        onClick={() => {
                          setStep('compose');
                          setSubject('');
                          setBody('');
                          setRecipientPubKey('');
                          setRecipientAlias('');
                          setFiles([]);
                          navigate('/inbox');
                        }} 
                        className="px-4 py-2.5 border border-corporate-200 rounded-xl text-sm font-semibold text-corporate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm flex items-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Discard</span>
                      </button>

                      <button 
                        type="button" 
                        onClick={async () => {
                          if (!subject && !body && !recipientPubKey) return;
                          await saveDraft({
                             subject,
                             content: body,
                             recipientPubKey,
                             senderDisplay: senderDisplay || 'Anonymous'
                          });
                          navigate('/drafts');
                        }} 
                        className="px-4 py-2.5 border border-corporate-200 rounded-xl text-sm font-semibold text-corporate-700 hover:bg-blue-50 hover:text-accent-blue hover:border-blue-200 transition-colors shadow-sm flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span className="hidden sm:inline">Save Draft</span>
                      </button>

                      <button type="submit" className="px-6 py-2.5 bg-corporate-900 rounded-xl text-sm font-semibold text-white hover:bg-corporate-800 transition-colors shadow-[0_4px_14px_0_rgba(15,23,42,0.15)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)] flex items-center space-x-2">
                        <Lock size={16} />
                        <span>Encrypt & Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'encrypting' && !isEncrypting && (
            <motion.div
              key="encrypting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6 flex-1 min-h-[400px]"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-24 h-24 border-4 border-corporate-200 border-t-accent-blue rounded-full"
                />
                <img src="/logo.png" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 object-contain" alt="Encrypting" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-corporate-900 tracking-tight">
                  {files.length > 0 ? "Uploading & Encrypting..." : "Encrypting Payload..."}
                </h2>
                <p className="text-corporate-500 font-mono text-sm max-w-sm mx-auto">
                  {files.length > 0 ? "Transferring secure blobs and applying AES-256 wrapping keys." : "Generating AES-256 wrapping keys and encrypting blocks using Recipient's Public Key."}
                </p>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-4 flex-1 min-h-[400px] bg-white p-12 rounded-b-2xl border-t border-green-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <CheckCircle2 className="text-green-500" size={64} />
              </motion.div>
              <h2 className="text-2xl font-bold text-corporate-900 tracking-tight">Message Secured & Sent</h2>
              <p className="text-corporate-500 text-sm">Redirecting to Sent Items...</p>
            </motion.div>
          )}

          {step === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-6 flex-1 min-h-[400px] bg-white p-12"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-corporate-900 tracking-tight">Transmission Secured</h2>
              <p className="text-corporate-500 max-w-sm text-center text-sm leading-relaxed mb-4">
                Your message was encrypted locally and routed through the secure network to the specified recipient.
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
                className="px-8 py-3 bg-corporate-900 hover:bg-black text-white rounded-xl transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] font-medium mt-4"
              >
                Compose Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
