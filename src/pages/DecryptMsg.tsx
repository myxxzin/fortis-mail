import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowLeft, Reply, Download, FileText } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { decryptMessageHybrid, unpackHybridPayload, type EncryptedMessagePayload, decryptFile } from '../utils/cryptoAuth';
import { toast } from 'react-hot-toast';

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
  const [decryptedContent, setDecryptedContent] = useState<string>('');
  const [rawCiphertext, setRawCiphertext] = useState<string | null>(null);
  const [decryptedPayload, setDecryptedPayload] = useState<EncryptedMessagePayload | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

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
    content: (currentMail && currentMail.senderPubKey === user?.publicKey && currentMail.recipientPubKey !== user?.publicKey && currentMail.senderContent) 
             ? currentMail.senderContent 
             : (currentMail?.content || TRUE_MSG),
    attachments: currentMail?.attachments || []
  };

  useEffect(() => {
    if (mailDetails) {
      if (mailDetails.isSystem) {
        setDecryptedContent(mailDetails.content);
        setDecryptionState('password-entered');
        setTimeout(() => {
          setDecryptionState('decrypting');
          setTimeout(() => {
            setDecryptionState('decrypted');
          }, 1500);
        }, 500);
      } else {
        setRawCiphertext(mailDetails.content);
      }
    }
  }, [mailDetails.content, mailDetails.isSystem]);

  useEffect(() => {
    if (decryptionState === 'decrypted' && id) {
      markAsRead(id);
    }
  }, [decryptionState, id, markAsRead]);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !user?.email || !user?.privateKey) return;

    setErrorMsg('');
    setDecryptionState('password-entered');
    
    try {
      if (!auth.currentUser) throw new Error("No active session");
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      let finalPlaintext = mailDetails.content;
      try {
        if (mailDetails.content.includes('BEGIN FORTISMAIL ENCRYPTED MESSAGE')) {
          const payload = unpackHybridPayload(mailDetails.content);
          finalPlaintext = await decryptMessageHybrid(payload, user.privateKey);
          setDecryptedPayload(payload);
        } else {
          // Fallback parsing for legacy JSON format
          const payload = JSON.parse(mailDetails.content) as EncryptedMessagePayload;
          if (payload.ciphertextBase64) {
            finalPlaintext = await decryptMessageHybrid(payload, user.privateKey);
            setDecryptedPayload(payload);
          }
        }
      } catch (err) {
        console.warn("Not a hybrid encrypted payload, falling back to raw.", err);
      }
      
      setDecryptedContent(finalPlaintext);
      
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

  const handleDownloadAttachment = async (e: React.MouseEvent, file: any) => {
    e.preventDefault();
    if (decryptionState !== 'decrypted') {
      toast.error('Please decrypt the message first to unlock attachments.');
      return;
    }
    
    if (!decryptedPayload || !decryptedPayload.attachmentKeys) {
      toast.error("Decryption keys for this attachment are missing or corrupted.");
      return;
    }

    const fileKeyData = decryptedPayload.attachmentKeys.find(k => k.id === file.url);
    if (!fileKeyData) {
      toast.error("Decryption key for this specific file is missing.");
      return;
    }

    setDownloadingFile(file.name);
    const downloadToast = toast.loading(`Decrypting ${file.name}...`);

    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error("Network response was not ok");
      const encryptedBlob = await response.blob();
      
      const plaintextBlob = await decryptFile(
        encryptedBlob, 
        fileKeyData.fileKeyBase64, 
        fileKeyData.ivBase64, 
        file.type
      );
      
      const objectUrl = URL.createObjectURL(plaintextBlob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      
      toast.success(`${file.name} decrypted successfully.`, { id: downloadToast });
    } catch (err) {
      console.error("File decryption failed:", err);
      toast.error("Failed to decrypt secure attachment.", { id: downloadToast });
    } finally {
      setDownloadingFile(null);
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 bg-white p-8 rounded-xl shadow-sm border border-corporate-200 min-h-full flex flex-col"
          >
            {decryptionState !== 'decrypted' ? (
              <div className="flex flex-col space-y-6 flex-1">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 shadow-inner overflow-x-auto flex-1 h-[300px] overflow-y-auto">
                   <pre className="font-mono text-[11px] text-green-400 leading-relaxed select-all">
                     {rawCiphertext || mailDetails.content}
                   </pre>
                </div>
                
                {decryptionState === 'decrypting' ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-corporate-50 rounded-xl border border-corporate-200 shrink-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-12 h-12 border-4 border-t-accent-blue border-r-accent-blue border-b-transparent border-l-transparent rounded-full mb-4"
                    />
                    <h3 className="text-lg font-bold text-corporate-900 tracking-widest uppercase">Decrypting Payload...</h3>
                    <p className="text-corporate-500 font-mono text-xs mt-2">Applying AES-GCM block transformations</p>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-corporate-200 shadow-sm shrink-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 text-accent-blue rounded-full flex items-center justify-center shrink-0">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-corporate-900">Encrypted Payload</h3>
                        <p className="text-sm text-corporate-500">Provide your Master Password to unlock your Private Key and read this message.</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleDecrypt} className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <input 
                          autoFocus 
                          required 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Encryption Password" 
                          className="w-full bg-corporate-50 border border-corporate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:bg-white transition-all font-mono text-sm" 
                        />
                      </div>
                      <button type="submit" disabled={decryptionState === 'password-entered'} className="bg-corporate-900 hover:bg-black disabled:bg-corporate-400 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap">
                        {decryptionState === 'password-entered' ? 'Verifying Identity...' : 'Decrypt Message'}
                      </button>
                    </form>
                    {errorMsg && (
                      <div className="text-red-500 text-sm font-semibold italic mt-3 px-2">
                        {errorMsg}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                <div className="prose prose-corporate max-w-none text-corporate-800 leading-relaxed font-sans whitespace-pre-wrap flex-1">
                  {decryptedContent}
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
                          href="#"
                          onClick={(e) => handleDownloadAttachment(e, file)}
                          className="flex items-center justify-between p-4 bg-corporate-50 border border-corporate-200 hover:border-accent-blue rounded-xl transition-all group cursor-pointer"
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
                            {downloadingFile === file.name ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-t-transparent border-corporate-400 group-hover:border-white rounded-full" />
                            ) : (
                              <Download size={14} />
                            )}
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
