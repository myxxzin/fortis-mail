import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, User as UserIcon, Mail, FileText, ClipboardList, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Compose() {
  const [step, setStep] = useState<'compose' | 'encrypting' | 'success' | 'sent'>('compose');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipientPubKey, setRecipientPubKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pasteError, setPasteError] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('encrypting');
    setIsEncrypting(true);
    
    // Simulate encryption delay
    setTimeout(() => {
      setStep('success');
      setIsEncrypting(false); // Hide overlay
      setTimeout(() => setStep('sent'), 1500); // Change step to 'sent' after showing success briefly
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 w-full">
      <div className="bg-surface rounded-2xl shadow-sm border border-corporate-200 flex-1 flex flex-col min-h-0 relative w-full max-w-4xl mx-auto">
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
              className="flex-1 overflow-hidden flex flex-col"
            >
              <form onSubmit={handleSend} className="flex-1 flex flex-col min-h-0 relative">
                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-corporate-50/10">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider text-right">From</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400" size={16} />
                      <input type="text" disabled value={`${user?.name || 'Vault User'} <${user?.email || 'user@example.com'}>`} className="w-full bg-corporate-50 text-corporate-600 border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm cursor-not-allowed font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider text-right">To</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400" size={16} />
                      <input type="email" required placeholder="Recipient Email Address" className="w-full bg-white border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] flex-start gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider text-right pt-3">Public Key</label>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-corporate-400 font-medium">Recipient's RSA Public Key (Required for encryption)</span>
                        <div className="flex items-center space-x-2">
                          {pasteError && <span className="text-[10px] text-red-500 font-medium">{pasteError}</span>}
                          <button type="button" onClick={async () => {
                             try {
                               const text = await navigator.clipboard.readText();
                               setRecipientPubKey(text);
                               setPasteError('');
                             } catch (err) {
                               console.error("Paste failed", err);
                               setPasteError('Browser blocked paste. Please press Ctrl+V directly in the box.');
                             }
                          }} className="text-[10px] bg-blue-50 text-accent-blue hover:bg-blue-100 font-bold px-2 py-1 rounded transition-colors flex items-center">
                            <ClipboardList size={12} className="mr-1" /> Paste
                          </button>
                        </div>
                      </div>
                      <textarea required value={recipientPubKey} onChange={e => {setRecipientPubKey(e.target.value); setPasteError('');}} rows={2} placeholder="-----BEGIN PUBLIC KEY-----..." className="w-full bg-white border border-corporate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-mono resize-none"></textarea>
                    </div>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider text-right">Subject</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400" size={16} />
                      <input type="text" required placeholder="Encrypted Message Subject" className="w-full bg-white border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all font-medium" />
                    </div>
                  </div>

                  {/* Message Body - Scrolls naturally with the rest of the form */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase text-corporate-500 tracking-wider">Message Body</label>
                      <span className="text-xs text-corporate-400 font-medium bg-corporate-100 px-2 py-0.5 rounded">Markdown Supported</span>
                    </div>
                    <textarea required placeholder="Enter your secret message here..." className="w-full min-h-[300px] h-64 bg-white border border-corporate-200 hover:border-corporate-300 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-blue-50 transition-all resize-y shadow-sm font-sans leading-relaxed text-corporate-900"></textarea>
                  </div>
                </div>

                {/* Bottom Bar - Pinned */}
                <div className="shrink-0 p-6 border-t border-corporate-100 bg-corporate-50">
                  <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start space-x-3 flex-1 min-w-0">
                      <Lock className="text-accent-blue mt-0.5 shrink-0" size={16} />
                      <div className="flex-1 w-full">
                        <p className="text-xs font-semibold text-corporate-900 mb-1">Decryption Password (Optional)</p>
                        <div className="relative max-w-xs">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter session password..." 
                            className="w-full bg-white border border-corporate-200 rounded-lg pl-3 pr-10 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-corporate-400 hover:text-corporate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 shrink-0">
                      <button type="button" onClick={() => navigate('/inbox')} className="px-5 py-2.5 border border-corporate-200 rounded-xl text-sm font-semibold text-corporate-700 hover:bg-corporate-50 hover:text-corporate-900 transition-colors shadow-sm">
                        Cancel
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
                 <h2 className="text-2xl font-bold text-corporate-900 tracking-tight">Encrypting Payload...</h2>
                 <p className="text-corporate-500 font-mono text-sm max-w-sm mx-auto">Generating AES-256 wrapping keys and encrypting blocks using Recipient's Public Key.</p>
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
                  setRecipientPubKey('');
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
