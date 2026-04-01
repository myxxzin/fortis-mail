import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowLeft, Reply, Download, FileText, CheckCircle2, X } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { auth, db } from '../config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { decryptMessageHybrid, unpackHybridPayload, decryptFile, encryptMessageHybrid, packHybridPayload, type EncryptedMessagePayload } from '../utils/cryptoAuth';
import { toast } from 'react-hot-toast';
import PinInput from '../components/PinInput';

const TRUE_MSG = "Hello team,\n\nThe Q3 financial records are attached and verified. We have successfully secured the new investments without any leakage of company secrets.\n\nPlease keep this information strictly within the leadership circle.\n\nBest Regards,\nHR & Finance";

export default function DecryptMsg() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { mails, sentMails, markAsRead, sendDeliveryAck, deliveryAcks } = useMail();
  const { contacts } = useContacts();
  const { user } = useAuth();
  const [decryptionState, setDecryptionState] = useState<'locked' | 'password-entered' | 'decrypting' | 'decrypted'>('locked');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [decryptedContent, setDecryptedContent] = useState<string>('');

  const [decryptedPayload, setDecryptedPayload] = useState<EncryptedMessagePayload | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [signatureVerified, setSignatureVerified] = useState<boolean | null>(null);
  const [trueSenderPubKey, setTrueSenderPubKey] = useState<string | null>(null);
  const [msgTimestamp, setMsgTimestamp] = useState<string | null>(null);

  const [ackStatus, setAckStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [ackError, setAckError] = useState<string>('');


  const currentMail = [...mails, ...sentMails].find(m => m.id === id);

  const resolveAlias = (pubKey: string) => {
    if (pubKey === 'System Key') return 'System';
    const contact = contacts.find(c => c.publicKey === pubKey);
    return contact ? contact.alias : (pubKey ? pubKey.substring(0, 24) + '...' : t('decrypt.unknown'));
  };

  const isSenderLookingAtSentItem = currentMail?.senderPubKey === user?.publicKey && currentMail?.recipientPubKey !== user?.publicKey;

  const handleReply = async () => {
    if (!currentMail) return;
    navigate('/compose', { state: { replyTo: currentMail.senderPubKey } });
  };

  const mailDetails = {
    senderPubKey: currentMail?.senderPubKey || '',
    senderDisplay: currentMail?.senderDisplay || '',
    recipientPubKey: currentMail?.recipientPubKey || '',
    subject: currentMail?.subject || t('decrypt.unknownSubject'),
    date: currentMail?.date || 'Unknown Date',
    isSystem: currentMail?.isSystem || false,
    content: currentMail?.content || TRUE_MSG,
    attachments: currentMail?.attachments || []
  };

  const [globalSenderName, setGlobalSenderName] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalIdentity = async () => {
      const pubKeyToSearch = trueSenderPubKey || (mailDetails.senderPubKey !== 'SEALED' ? mailDetails.senderPubKey : null);
      if (!pubKeyToSearch || pubKeyToSearch === 'SEALED' || pubKeyToSearch === 'System Key') return;
      
      try {
        const q = query(collection(db, 'users'), where('publicKey', '==', pubKeyToSearch));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const udata = snap.docs[0].data();
          setGlobalSenderName(udata.alias || udata.name || udata.identityId);
        }
      } catch (err) {
         console.warn("Failed to fetch global identity", err);
      }
    };
    
    if (decryptionState === 'decrypted') {
       fetchGlobalIdentity();
    }
  }, [trueSenderPubKey, mailDetails.senderPubKey, decryptionState]);

  const getSenderDisplayName = () => {
    const pubKey = trueSenderPubKey || mailDetails.senderPubKey;
    if (!pubKey || pubKey === 'SEALED') return mailDetails.senderDisplay || t('decrypt.unknown');
    
    const localAlias = resolveAlias(pubKey);
    const isTruncatedKey = localAlias === pubKey.substring(0, 24) + '...';
    
    if (isTruncatedKey && globalSenderName) {
       return globalSenderName;
    }
    if (!isTruncatedKey) {
       return localAlias;
    }
    
    return mailDetails.senderDisplay === 'Anonymous' ? localAlias : (mailDetails.senderDisplay || localAlias);
  };

  useEffect(() => {
    const processAck = async () => {
      if (!isSenderLookingAtSentItem || !id || !user?.privateKey) return;
      const ack = deliveryAcks.find(a => a.mailId === id);
      if (!ack) {
        setAckStatus('pending');
        return;
      }

      try {
        const payloadObj = unpackHybridPayload(ack.payload) as EncryptedMessagePayload;
        const decrypted = await decryptMessageHybrid(
          payloadObj,
          user.privateKey,
          ack.recipientPubKey,
          user.publicKey!
        );
        if (decrypted.plaintext.startsWith("ACK:")) {
          setAckStatus('verified');
        } else {
          setAckStatus('failed');
          setAckError("Invalid plaintext prefix");
        }
      } catch (err: any) {
        setAckStatus('failed');
        setAckError(err.message || 'Unknown cryptographic failure');
      }
    };
    processAck();
  }, [deliveryAcks, isSenderLookingAtSentItem, id, user?.privateKey, user?.publicKey]);

  useEffect(() => {
    if (mailDetails && mailDetails.isSystem) {
        setDecryptedContent(mailDetails.content);
        setDecryptionState('password-entered');
        setTimeout(() => {
          setDecryptionState('decrypting');
          setTimeout(() => {
            setDecryptionState('decrypted');
          }, 1500);
        }, 500);
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
      if (user?.pinHash) {
         const enc = new TextEncoder();
         const pinData = enc.encode(password + (user?.identityId || ''));
         const hashBuffer = await window.crypto.subtle.digest('SHA-256', pinData);
         const hashArray = Array.from(new Uint8Array(hashBuffer));
         const enteredHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
         
         if (enteredHash !== user.pinHash) {
            throw new Error(t('decrypt.invalidPass'));
         }
      } else {
         if (!auth.currentUser) throw new Error("No active session");
         const credential = EmailAuthProvider.credential(user.email, password);
         await reauthenticateWithCredential(auth.currentUser, credential);
      }

      let finalPlaintext = mailDetails.content;
      try {
        if (mailDetails.content.includes('BEGIN FORTISMAIL ENCRYPTED MESSAGE')) {
          const payload = unpackHybridPayload(mailDetails.content);

          const isSentItem = currentMail && currentMail.senderPubKey === user.publicKey && currentMail.recipientPubKey !== user.publicKey;
          const expectedRecipientKey = isSentItem ? mailDetails.recipientPubKey : user.publicKey;

          let rawDecryptedData;
          try {
            rawDecryptedData = await decryptMessageHybrid(
              payload,
              user.privateKey,
              mailDetails.senderPubKey,
              expectedRecipientKey
            );
          } catch (e: any) {
            setDecryptionState('locked');
            setErrorMsg(e.message || 'CRITICAL SECURITY ALERT: Verification failed.');
            return;
          }

          finalPlaintext = rawDecryptedData.plaintext;
          if (rawDecryptedData.timestamp) setMsgTimestamp(rawDecryptedData.timestamp);
          setSignatureVerified(true);

          if (rawDecryptedData.verifiedSender && rawDecryptedData.verifiedSender !== 'SEALED') {
            setTrueSenderPubKey(rawDecryptedData.verifiedSender);
          }

          // Delivery ACK Protocol
          if (!isSentItem && user.privateKey) {
            try {
              const enc = new TextEncoder();
              const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(finalPlaintext));
              const hashArray = Array.from(new Uint8Array(hashBuffer));
              const msg_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

              const actualSenderPubKey = (rawDecryptedData.verifiedSender && rawDecryptedData.verifiedSender !== 'SEALED')
                ? rawDecryptedData.verifiedSender
                : mailDetails.senderPubKey;

              if (actualSenderPubKey === 'SEALED') {
                console.warn("Sender is purely sealed. Cannot deliver ACK back.");
                return;
              }

              const ackPayload = await encryptMessageHybrid(
                `ACK:${msg_hash}`,
                actualSenderPubKey,
                user.privateKey,
                user.publicKey,
                actualSenderPubKey
              );

              const encryptedAck = packHybridPayload(ackPayload);
              if (id) {
                sendDeliveryAck(id, encryptedAck, actualSenderPubKey);
              }
            } catch (ackErr) {
              console.error("Failed to generate and send Delivery ACK", ackErr);
            }
          }

          setDecryptedPayload(payload);
        } else {
          const payload = JSON.parse(mailDetails.content) as EncryptedMessagePayload;
          if (payload.ciphertextBase64) {
            const legacyDecrypted = await decryptMessageHybrid(payload, user.privateKey, mailDetails.senderPubKey, user.publicKey);
            finalPlaintext = legacyDecrypted.plaintext;
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
      setErrorMsg(t('decrypt.invalidPass'));
    }
  };

  const handleDownloadAttachment = async (e: React.MouseEvent, file: any) => {
    e.preventDefault();
    if (decryptionState !== 'decrypted') {
      toast.error(t('decrypt.decryptAlert'));
      return;
    }

    if (!decryptedPayload || !decryptedPayload.attachmentKeys) {
      toast.error(t('decrypt.missingKeys'));
      return;
    }

    const fileKeyData = decryptedPayload.attachmentKeys.find(k => k.id === file.url);
    if (!fileKeyData) {
      toast.error(t('decrypt.missingSpecKey'));
      return;
    }

    setDownloadingFile(file.name);
    const downloadToast = toast.loading(t('decrypt.decryptingFile').replace('{file}', file.name));

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

      toast.success(t('decrypt.successDecrypt').replace('{file}', file.name), { id: downloadToast });
    } catch (err) {
      console.error("File decryption failed:", err);
      toast.error(t('decrypt.failDecrypt'), { id: downloadToast });
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="h-full flex flex-col w-full transition-colors duration-300">
      <button
        onClick={() => navigate('/inbox')}
        className="flex items-center space-x-2 text-corporate-500 hover:text-corporate-900 dark:text-white dark:hover:text-white mb-6 transition-colors w-max shrink-0"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">{t('decrypt.backToInbox')}</span>
      </button>

      <div className="bg-surface dark:bg-[#020617] rounded-2xl shadow-sm border border-corporate-200 dark:border-white/10 overflow-hidden flex-1 flex flex-col min-h-0 relative transition-colors duration-300">
        <div className="p-6 border-b border-corporate-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#020617] shrink-0 transition-colors duration-300">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-corporate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <Lock size={18} className="text-accent-blue" />
              <span>{t('decrypt.message')} {mailDetails.subject}</span>
            </h1>
            <p className="text-sm text-corporate-500 dark:text-white">
              {t('decrypt.from')} <span className="text-corporate-900 dark:text-white font-semibold">{getSenderDisplayName()}</span> <span className="text-xs font-mono text-corporate-400 dark:text-white ml-1">({resolveAlias(trueSenderPubKey || mailDetails.senderPubKey)})</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-corporate-500 dark:text-white bg-corporate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-corporate-200 dark:border-white/10">
            <ShieldCheck size={16} className="text-accent-blue" />
            <span>{t('decrypt.e2eEncrypted')}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-corporate-50 dark:bg-transparent p-4 md:p-8 overflow-y-auto w-full transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 min-h-full flex flex-col"
          >
            {isSenderLookingAtSentItem ? (
              <div className="flex flex-col flex-1 min-h-full">
                <div className="bg-white/60 dark:bg-[#020617]/60 text-corporate-600 dark:text-white border border-corporate-200 dark:border-slate-800 px-4 py-3 rounded-xl flex items-center mb-4 shadow-sm w-full shrink-0">
                  <Lock size={16} className="mr-2 shrink-0 text-corporate-500 dark:text-white" />
                  <span className="text-sm font-medium">{t('decrypt.signedEncrypted').replace('{recipient}', resolveAlias(mailDetails.recipientPubKey))}</span>
                </div>

                {ackStatus === 'verified' && (
                  <div className="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30 px-4 py-3 rounded-xl flex items-center mb-6 shadow-sm w-full shrink-0">
                    <CheckCircle2 size={16} className="mr-2 text-green-600 dark:text-green-500 shrink-0" />
                    <span className="text-sm font-medium">{t('decrypt.ackVerified')}</span>
                  </div>
                )}

                {ackStatus === 'failed' && (
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30 px-4 py-3 rounded-xl flex flex-col mb-6 shadow-sm w-full shrink-0">
                    <div className="flex items-center">
                      <X size={16} className="mr-2 text-red-600 dark:text-red-500 shrink-0" />
                      <span className="text-sm font-medium">{t('decrypt.ackFailed')}</span>
                    </div>
                    <span className="text-xs font-mono mt-2 ml-6 break-all">{ackError}</span>
                  </div>
                )}

                {ackStatus === 'pending' && (
                  <div className="bg-amber-50/50 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/20 text-amber-800 dark:text-amber-500 px-4 py-3 rounded-xl flex items-center mb-6 shadow-sm w-full shrink-0">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-3 animate-pulse shrink-0"></div>
                    <span className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: t('decrypt.ackPending').replace('{recipient}', `<strong>${resolveAlias(mailDetails.recipientPubKey)}</strong>`) }}></span>
                  </div>
                )}

                <div className="bg-white dark:bg-[#020617] border border-corporate-200 dark:border-slate-800 shadow-sm rounded-xl relative w-full text-corporate-900 dark:text-white min-h-[520px] flex flex-col shrink-0">
                  <div className="absolute -top-4 right-6 h-8 w-8 bg-blue-50 dark:bg-accent-blue/10 border border-corporate-100 dark:border-transparent rounded-full shadow-sm flex items-center justify-center cursor-pointer" title="E2E Encrypted">
                    <Lock size={14} className="text-accent-blue" />
                  </div>

                  {/* Header Info Block */}
                  <div className="px-5 md:px-8 pt-6 md:pt-10 pb-6 text-sm text-corporate-500 dark:text-white flex flex-col space-y-3 md:space-y-4 font-sans">
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">{t('decrypt.from2')}</span>
                      <span className="font-semibold text-corporate-900 dark:text-white break-words">{user?.name || user?.alias || t('decrypt.you')} <span className="opacity-50 font-normal">{t('decrypt.youTag')}</span></span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">{t('decrypt.to2')}</span>
                      <span className="font-semibold text-corporate-900 dark:text-white break-words">{resolveAlias(mailDetails.recipientPubKey)}</span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">{t('decrypt.time')}</span>
                      <span className="text-corporate-900 dark:text-white font-medium break-words">{mailDetails.date}</span>
                    </div>
                  </div>

                  <div className="mx-4 md:mx-8 border-b border-corporate-100 dark:border-slate-800 mb-6"></div>

                  <div className="px-5 md:px-8 pb-10 prose max-w-none text-corporate-800 dark:text-corporate-100 leading-relaxed font-sans whitespace-pre-wrap flex-1 flex flex-col text-center justify-center">
                    <p className="text-lg md:text-xl font-bold mb-4 text-corporate-900 dark:text-white">{mailDetails.subject}</p>
                    <p className="text-corporate-400 dark:text-white text-xs md:text-sm bg-corporate-50 dark:bg-white/5 border border-corporate-100 dark:border-transparent p-3 md:p-4 rounded-lg inline-block mx-auto max-w-[90%] md:max-w-lg break-words leading-relaxed">{t('decrypt.sealedBody').replace('{recipient}', resolveAlias(mailDetails.recipientPubKey))}</p>
                  </div>
                </div>


              </div>
            ) : decryptionState !== 'decrypted' ? (
              <div className="flex flex-col space-y-6 flex-1 justify-center max-w-2xl mx-auto w-full">
                {decryptionState === 'decrypting' ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-corporate-50 dark:bg-white/5 rounded-xl border border-corporate-200 dark:border-transparent shrink-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-12 h-12 border-4 border-t-accent-blue border-r-accent-blue border-b-transparent border-l-transparent rounded-full mb-4"
                    />
                    <h3 className="text-lg font-bold text-corporate-900 dark:text-white tracking-widest uppercase">{t('decrypt.decrypting')}</h3>
                    <p className="text-corporate-500 dark:text-white font-mono text-xs mt-2">{t('decrypt.decryptingDesc')}</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#020617] p-6 rounded-xl border border-corporate-200 dark:border-slate-800 shadow-sm shrink-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-accent-blue/10 text-accent-blue rounded-full flex items-center justify-center shrink-0">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-corporate-900 dark:text-white">{user?.pinHash ? t('decrypt.encryptedBoxTitle') : 'Encrypted Payload'}</h3>
                        <p className="text-sm text-corporate-500 dark:text-white">{user?.pinHash ? t('decrypt.pinProvide') : t('decrypt.provideMaster')}</p>
                      </div>
                    </div>

                    <form onSubmit={handleDecrypt} className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="flex-1 w-full flex justify-center sm:justify-start">
                         {user?.pinHash ? (
                            <PinInput value={password} onChange={setPassword} autoFocus={true} />
                         ) : (
                            <input
                              autoFocus
                              required
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder={t('decrypt.passPlaceholder')}
                              className="w-full bg-corporate-50 dark:bg-slate-800 border border-corporate-200 dark:border-slate-700 text-corporate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all text-sm"
                            />
                         )}
                      </div>
                      <button type="submit" disabled={decryptionState === 'password-entered'} className="w-full sm:w-auto bg-white border border-corporate-200 text-corporate-900 dark:bg-white/10 hover:bg-corporate-50 dark:hover:bg-white/20 disabled:border-corporate-100 disabled:text-corporate-400 dark:disabled:bg-slate-700 dark:text-white px-8 py-3 rounded-lg flex-shrink-0 font-medium transition-colors shadow-sm whitespace-nowrap">
                        {decryptionState === 'password-entered' ? t('decrypt.btnVerifying') : t('decrypt.btnDecrypt')}
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
              <div className="flex flex-col flex-1 min-h-full">
                {signatureVerified && (
                  <div className="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30 px-4 py-3 rounded-xl flex items-center mb-6 shadow-sm w-full shrink-0">
                    <ShieldCheck size={16} className="mr-2 text-green-600 dark:text-green-500 shrink-0" />
                    <span className="text-sm font-medium">{t('decrypt.recipientId').replace('{recipient}', user?.name || user?.alias || t('decrypt.you'))}</span>
                  </div>
                )}

                <div className="bg-white dark:bg-[#020617] border border-corporate-200 dark:border-slate-800 shadow-sm rounded-xl relative w-full text-corporate-900 dark:text-white min-h-[520px] flex flex-col shrink-0 transition-colors duration-300">
                  {/* Lock icon pinned on top right */}
                  <div className="absolute -top-4 right-6 h-8 w-8 bg-blue-50 dark:bg-accent-blue/10 border border-corporate-100 dark:border-transparent rounded-full shadow-sm flex items-center justify-center cursor-pointer" title="E2E Encrypted">
                    <Lock size={14} className="text-accent-blue" />
                  </div>

                  {/* Header Info Block */}
                  <div className="px-5 md:px-8 pt-6 md:pt-10 pb-6 text-sm text-corporate-500 dark:text-white flex flex-col space-y-3 md:space-y-4 font-sans">
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">{t('decrypt.from2')}</span>
                      <span className="font-semibold text-corporate-900 dark:text-white break-words">{getSenderDisplayName()} <span className="text-[10px] font-normal opacity-50 ml-0 md:ml-2 block md:inline">({resolveAlias(trueSenderPubKey || mailDetails.senderPubKey)})</span></span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">{t('decrypt.to2')}</span>
                      <span className="font-semibold text-corporate-900 dark:text-white break-words">{user?.name || user?.alias || t('decrypt.you')}</span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">{t('decrypt.time')}</span>
                      <span className="text-corporate-900 dark:text-white font-medium break-words">{msgTimestamp ? new Date(parseInt(msgTimestamp)).toLocaleString('vi-VN') : mailDetails.date}</span>
                    </div>
                  </div>

                  <div className="mx-4 md:mx-8 border-b border-corporate-100 dark:border-slate-800 mb-6"></div>

                  {/* Body */}
                  <div className="px-5 md:px-8 pb-8 prose max-w-none text-corporate-800 dark:text-corporate-100 leading-relaxed font-sans whitespace-pre-wrap flex-1 flex flex-col break-words text-sm md:text-base">
                    {decryptedContent}

                    {mailDetails.attachments.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-corporate-100 dark:border-slate-800 font-sans">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-corporate-500 dark:text-white mb-4 flex items-center">
                          <FileText size={14} className="mr-2" />
                          {t('decrypt.attachments').replace('{count}', mailDetails.attachments.length.toString())}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {mailDetails.attachments.map((file, idx) => (
                            <a
                              key={idx}
                              href="#"
                              onClick={(e) => handleDownloadAttachment(e, file)}
                              className="flex items-center justify-between p-4 bg-corporate-50 dark:bg-slate-800/50 border border-corporate-100 dark:border-slate-700 hover:border-accent-blue dark:hover:border-accent-blue rounded-xl transition-all group cursor-pointer"
                            >
                              <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-corporate-200 dark:border-slate-600 flex items-center justify-center text-corporate-500 dark:text-white shrink-0 group-hover:scale-105 transition-transform group-hover:text-accent-blue">
                                  <FileText size={20} />
                                </div>
                                <div className="flex flex-col min-w-0 pr-2">
                                  <span className="text-sm font-semibold text-corporate-900 dark:text-white truncate">{file.name}</span>
                                  <span className="text-xs text-corporate-500 dark:text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-corporate-400 dark:text-white group-hover:bg-accent-blue group-hover:text-white transition-colors shrink-0 shadow-sm border border-corporate-200 dark:border-slate-600">
                                {downloadingFile === file.name ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-t-transparent border-corporate-400 dark:border-corporate-500 group-hover:border-white rounded-full" />
                                ) : (
                                  <Download size={14} />
                                )}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 mt-8 shrink-0">
                  <button
                    onClick={handleReply}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-corporate-900 dark:text-white border border-corporate-200 dark:border-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-sm"
                  >
                    <Reply size={16} className="mr-2" /> {t('decrypt.reply')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
