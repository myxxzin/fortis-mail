import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ArrowLeft, Reply } from 'lucide-react';
import { useMail } from '../context/MailContext';

const TRUE_MSG = "Hello team,\n\nThe Q3 financial records are attached and verified. We have successfully secured the new investments without any leakage of company secrets.\n\nPlease keep this information strictly within the leadership circle.\n\nBest Regards,\nHR & Finance";

function ScrambledText({ text, start }: { text: string, start: boolean }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!start) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(text.split("").map((letter, index) => {
        if (index < iteration) return text[index];
        // Only scramble letters and numbers to preserve formatting
        if (/[a-zA-Z0-9]/.test(letter)) {
          return String.fromCharCode(33 + Math.random() * 90);
        }
        return letter;
      }).join(""));

      if (iteration >= text.length) clearInterval(interval);
      iteration += 2;
    }, 15);

    return () => clearInterval(interval);
  }, [text, start]);

  if (!start) return null;
  return <span className="whitespace-pre-wrap">{displayed}</span>;
}

export default function DecryptMsg() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markAsRead, mails, sentMails } = useMail();
  const [decryptionState, setDecryptionState] = useState<'locked' | 'password-entered' | 'decrypting' | 'decrypted'>('locked');
  const [password, setPassword] = useState('');

  const currentMail = [...mails, ...sentMails].find(m => m.id === id);

  const mailDetails = {
    sender: currentMail?.sender || 'Unknown Sender',
    subject: currentMail?.subject || 'Unknown Subject',
    date: currentMail?.date || 'Unknown Date',
    recipient: currentMail?.recipient || 'Unknown Recipient',
    isSystem: currentMail?.isSystem || false,
    content: currentMail?.content || TRUE_MSG
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

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    // Animate decryption process
    setDecryptionState('password-entered');
    setTimeout(() => {
      setDecryptionState('decrypting');
      setTimeout(() => {
        setDecryptionState('decrypted');
      }, 2500);
    }, 800);
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
            <p className="text-sm text-corporate-500">From: {mailDetails.sender}</p>
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
                <div className="prose prose-corporate max-w-none text-corporate-800 leading-relaxed font-sans">
                  <ScrambledText text={mailDetails.content} start={true} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="mt-12 pt-6 border-t border-corporate-100 flex items-center justify-between"
                >
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <ShieldCheck size={16} className="mr-2" /> Signature Verified
                  </div>
                  <button
                    onClick={() => navigate('/compose')}
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
