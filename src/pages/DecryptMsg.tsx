import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ArrowLeft, Reply, Download, FileText } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const TRUE_MSG = "Hello team,\n\nThe Q3 financial records are attached and verified. We have successfully secured the new investments without any leakage of company secrets.\n\nPlease keep this information strictly within the leadership circle.\n\nBest Regards,\nHR & Finance";

export default function DecryptMsg() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markAsRead, mails, sentMails } = useMail();
  const { contacts } = useContacts();
  const { user } = useAuth();
  const [decryptionState, setDecryptionState] = useState<'locked' | 'password-entered' | 'decrypting' | 'decrypted'>('locked');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentMail = [...mails, ...sentMails].find(m => m.id === id);

  const resolveAlias = (pubKey: string) => {
    if (pubKey === 'System Key') return 'System';
    const contact = contacts.find(c => c.publicKey === pubKey);
    return contact ? contact.alias : (pubKey ? pubKey.substring(0, 24) + '...' : 'Unknown');
  };

  const handleReply = async () => {
    if (!currentMail) return;
    
    navigate('/compose', { state: { replyTo: currentMail.senderPubKey } });
  };

  const mailDetails = {
    senderPubKey: currentMail?.senderPubKey || '',
    senderDisplay: currentMail?.senderDisplay || '',
    recipientPubKey: currentMail?.recipientPubKey || '',
    subject: currentMail?.subject || 'Unknown Subject',
    date: currentMail?.date || 'Unknown Date',
    isSystem: currentMail?.isSystem || false,
    content: currentMail?.content || TRUE_MSG,
    attachments: currentMail?.attachments || []
  };

  // Use a stable random string for the background cipher
  const [cipherBg] = useState(() => {
    let block = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    for (let i = 0; i < 2000; i++) {
      block += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i % 80 === 0) block += '\n';
    }
    return block;
  });

  useEffect(() => {
    // Automatically decrypt system messages
    if (mailDetails.isSystem) {
      setDecryptionState('password-entered');
      setTimeout(() => {
        setDecryptionState('decrypting');
        setTimeout(() => {
          setDecryptionState('decrypted');
        }, 1500);
      }, 500);
    }
  }, [mailDetails.isSystem]);

  useEffect(() => {
    if (decryptionState === 'decrypted' && id) {
      markAsRead(id);
    }
  }, [decryptionState, id, markAsRead]);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !user?.email) return;

    setErrorMsg('');
    setDecryptionState('password-entered');
    
    try {
      if (!auth.currentUser) throw new Error("No active session");
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      setTimeout(() => {
        setDecryptionState('decrypting');
        setTimeout(() => {
          setDecryptionState('decrypted');
        }, 1500);
      }, 500);
    } catch (err) {
      setDecryptionState('locked');
      setErrorMsg('Invalid Master Password attached to Identity.');
    }
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto w-full">
      <button
        onClick={() => navigate('/inbox')}
        className="flex items-center space-x-2 text-corporate-500 hover:text-corporate-900 mb-6 transition-colors w-max shrink-0"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Inbox</span>
      </button>

      <div className="bg-surface rounded-2xl shadow-sm border border-corporate-200 overflow-hidden flex-1 flex flex-col min-h-0 relative">
        <div className="p-6 border-b border-corporate-100 flex items-center justify-between bg-white shrink-0">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-corporate-900 tracking-tight flex items-center space-x-2">
              <Lock size={18} className="text-accent-blue" />
              <span>Message: {mailDetails.subject}</span>
            </h1>
            <p className="text-sm text-corporate-500">
              From: <span className="text-corporate-900 font-semibold">{mailDetails.senderDisplay || 'Unknown'}</span> <span className="text-xs font-mono text-corporate-400 ml-1">({resolveAlias(mailDetails.senderPubKey)})</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-corporate-500 bg-corporate-50 px-3 py-1.5 rounded-lg border border-corporate-200">
            <ShieldCheck size={16} className="text-green-600" />
            <span>E2E Encrypted</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-corporate-50 p-8 overflow-y-auto">
          {/* Locked State Background */}
          {decryptionState !== 'decrypted' && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-20 flex flex-col items-center justify-center">
              <p className={`font-mono text-[9px] text-accent-blue/40 leading-none break-all whitespace-pre-wrap px-4 transition-all duration-1000 ${decryptionState === 'decrypting' ? 'blur-sm scale-105' : 'blur-[3px]'}`}>
                {cipherBg}
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {decryptionState === 'locked' && (
              <motion.div
                key="locked"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-white/40 backdrop-blur-md"
              >
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-corporate-200 max-w-md w-full">
                  <div className="w-14 h-14 bg-blue-50 text-accent-blue rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Lock size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-center text-corporate-900 mb-2">Decrypt Message</h2>
                  <p className="text-center text-sm text-corporate-500 mb-8 px-4">This message is protected by AES-GCM 256. Enter the decryption key to view.</p>

                  <form onSubmit={handleDecrypt} className="space-y-4">
                    <div>
                      <input autoFocus required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Encryption Password" className="w-full bg-corporate-50 border border-corporate-200 rounded-lg px-4 py-3 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-blue focus:bg-white transition-all shadow-inner font-mono" />
                    </div>
                    <button type="submit" className="w-full bg-corporate-900 hover:bg-black text-white py-3 rounded-lg font-medium transition-colors shadow-sm">
                      Unlock
                    </button>
                    {errorMsg && (
                      <div className="text-red-500 bg-red-50 text-sm font-semibold text-center italic mt-2 p-2 rounded-lg border border-red-100">
                        {errorMsg}
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            )}

            {(decryptionState === 'password-entered' || decryptionState === 'decrypting') && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-corporate-900/90 backdrop-blur-lg text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-24 h-24 border-4 border-t-accent-blue border-r-accent-blue border-b-transparent border-l-transparent rounded-full mb-8"
                />
                <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">Decrypting Payload...</h3>
                <p className="text-corporate-400 font-mono text-sm">Applying AES-GCM block transformations</p>
              </div>
            )}

            {decryptionState === 'decrypted' && (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-20 bg-white p-8 rounded-xl shadow-sm border border-corporate-200 min-h-full"
              >
                <div className="prose prose-corporate max-w-none text-corporate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {mailDetails.content}
                </div>

                {mailDetails.attachments.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-corporate-100">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-corporate-400 mb-4 flex items-center">
                      <FileText size={16} className="mr-2" />
                      Secure Attachments ({mailDetails.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mailDetails.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-corporate-50 border border-corporate-200 hover:border-accent-blue rounded-xl transition-all group"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-lg bg-white border border-corporate-200 flex items-center justify-center text-accent-blue shrink-0 group-hover:scale-105 transition-transform">
                              <FileText size={20} />
                            </div>
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-sm font-semibold text-corporate-900 truncate">{file.name}</span>
                              <span className="text-xs text-corporate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-corporate-400 group-hover:bg-accent-blue group-hover:text-white transition-colors shrink-0 shadow-sm border border-corporate-100">
                            <Download size={14} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 pt-6 border-t border-corporate-100 flex items-center justify-between"
                >
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <ShieldCheck size={16} className="mr-2" /> Signature Verified
                  </div>
                  <button
                    onClick={handleReply}
                    className="flex items-center space-x-2 px-6 py-2 bg-corporate-50 hover:bg-corporate-100 text-corporate-900 rounded-lg transition-colors font-medium border border-corporate-200"
                  >
                    <Reply size={16} />
                    <span>Reply Securely</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
