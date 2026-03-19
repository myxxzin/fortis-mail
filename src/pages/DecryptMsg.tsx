import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, ArrowLeft, Reply, Download, FileText, CheckCircle2, Search, X } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { decryptMessageHybrid, unpackHybridPayload, decryptFile, encryptMessageHybrid, packHybridPayload, type EncryptedMessagePayload } from '../utils/cryptoAuth';
import { toast } from 'react-hot-toast';

const TRUE_MSG = "Hello team,\n\nThe Q3 financial records are attached and verified. We have successfully secured the new investments without any leakage of company secrets.\n\nPlease keep this information strictly within the leadership circle.\n\nBest Regards,\nHR & Finance";

export default function DecryptMsg() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mails, sentMails, markAsRead, sendDeliveryAck, deliveryAcks } = useMail();
  const { contacts } = useContacts();
  const { user } = useAuth();
  const [decryptionState, setDecryptionState] = useState<'locked' | 'password-entered' | 'decrypting' | 'decrypted'>('locked');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [decryptedContent, setDecryptedContent] = useState<string>('');
  const [rawCiphertext, setRawCiphertext] = useState<string | null>(null);
  const [decryptedPayload, setDecryptedPayload] = useState<EncryptedMessagePayload | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [signatureVerified, setSignatureVerified] = useState<boolean | null>(null);
  const [trueSenderPubKey, setTrueSenderPubKey] = useState<string | null>(null);
  const [msgTimestamp, setMsgTimestamp] = useState<string | null>(null);
  const [showCiphertextModal, setShowCiphertextModal] = useState(false);
  const [ackStatus, setAckStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [ackError, setAckError] = useState<string>('');

  const currentMail = [...mails, ...sentMails].find(m => m.id === id);

  const resolveAlias = (pubKey: string) => {
    if (pubKey === 'System Key') return 'System';
    const contact = contacts.find(c => c.publicKey === pubKey);
    return contact ? contact.alias : (pubKey ? pubKey.substring(0, 24) + '...' : 'Unknown');
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
    subject: currentMail?.subject || 'Unknown Subject',
    date: currentMail?.date || 'Unknown Date',
    isSystem: currentMail?.isSystem || false,
    content: currentMail?.content || TRUE_MSG,
    attachments: currentMail?.attachments || []
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
          // Fallback parsing for legacy JSON format
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
    <div className="h-full flex flex-col w-full">
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
              From: <span className="text-corporate-900 font-semibold">{mailDetails.senderDisplay || 'Unknown'}</span> <span className="text-xs font-mono text-corporate-400 ml-1">({resolveAlias(trueSenderPubKey || mailDetails.senderPubKey)})</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-corporate-500 bg-corporate-50 px-3 py-1.5 rounded-lg border border-corporate-200">
            <ShieldCheck size={16} className="text-accent-blue" />
            <span>E2E Encrypted</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-corporate-50 p-4 md:p-8 overflow-y-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 bg-white p-8 rounded-xl shadow-sm border border-corporate-200 min-h-full flex flex-col"
          >
            {isSenderLookingAtSentItem ? (
              <div className="flex flex-col flex-1 bg-corporate-50 -m-4 md:-m-8 p-4 md:p-8 rounded-xl overflow-y-auto min-h-full">
                <div className="bg-white/60 text-corporate-600 border border-corporate-200 px-4 py-3 rounded-xl flex items-center mb-4 shadow-sm w-full shrink-0">
                  <Lock size={16} className="mr-2 shrink-0 text-corporate-500" />
                  <span className="text-sm font-medium">Signed and Encrypted - only {resolveAlias(mailDetails.recipientPubKey)} can decrypt it (even if you can't read it back)</span>
                </div>

                {ackStatus === 'verified' && (
                  <div className="bg-green-50 text-green-700 border border-green-500/30 px-4 py-3 rounded-xl flex items-center mb-6 shadow-sm w-full shrink-0">
                    <CheckCircle2 size={16} className="mr-2 text-green-600 shrink-0" />
                    <span className="text-sm font-medium">The recipient has received the letter.</span>
                  </div>
                )}

                {ackStatus === 'failed' && (
                  <div className="bg-red-50 text-red-700 border border-red-500/30 px-4 py-3 rounded-xl flex flex-col mb-6 shadow-sm w-full shrink-0">
                    <div className="flex items-center">
                      <X size={16} className="mr-2 text-red-600 shrink-0" />
                      <span className="text-sm font-medium">The ACK form failed. Decryption/Signature verification failed:
                      </span>
                    </div>
                    <span className="text-xs font-mono mt-2 ml-6 break-all">{ackError}</span>
                  </div>
                )}

                {ackStatus === 'pending' && (
                  <div className="bg-amber-50/50 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl flex items-center mb-6 shadow-sm w-full shrink-0">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-3 animate-pulse shrink-0"></div>
                    <span className="text-sm font-medium">Waiting for <strong>{resolveAlias(mailDetails.recipientPubKey)}</strong> to open the email to generate the ACK confirmation slip...</span>
                  </div>
                )}

                <div className="bg-white border border-corporate-200 shadow-sm rounded-xl relative w-full text-corporate-900 min-h-[520px] flex flex-col shrink-0">
                  <div className="absolute -top-4 right-6 h-8 w-8 bg-blue-50 border border-corporate-100 rounded-full shadow-sm flex items-center justify-center cursor-pointer" title="E2E Encrypted">
                    <Lock size={14} className="text-accent-blue" />
                  </div>

                  {/* Header Info Block */}
                  <div className="px-5 md:px-8 pt-6 md:pt-10 pb-6 text-sm text-corporate-500 flex flex-col space-y-3 md:space-y-4 font-sans">
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Từ</span>
                      <span className="font-semibold text-corporate-900 break-words">{user?.name || user?.alias || 'Bạn'} <span className="opacity-50 font-normal">(bạn)</span></span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Đến</span>
                      <span className="font-semibold text-corporate-900 break-words">{resolveAlias(mailDetails.recipientPubKey)}</span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Thời gian</span>
                      <span className="text-corporate-900 font-medium break-words">{mailDetails.date}</span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Mã hoá</span>
                      <span className="text-accent-blue font-semibold font-mono text-xs bg-blue-50 px-2 py-1 rounded w-max mt-1 md:mt-0 break-words">ECDH-P256 + AES-GCM-256</span>
                    </div>
                  </div>

                  <div className="mx-4 md:mx-8 border-b border-corporate-100 mb-6"></div>

                  <div className="px-5 md:px-8 pb-10 prose prose-corporate max-w-none text-corporate-800 leading-relaxed font-sans whitespace-pre-wrap flex-1 flex flex-col text-center justify-center">
                    <p className="text-lg md:text-xl font-bold mb-4 text-corporate-900">{mailDetails.subject}</p>
                    <p className="text-corporate-400 text-xs md:text-sm bg-corporate-50 border border-corporate-100 p-3 md:p-4 rounded-lg inline-block mx-auto max-w-[90%] md:max-w-lg break-words leading-relaxed">[Nội dung đã được mã hoá E2E cho {resolveAlias(mailDetails.recipientPubKey)} - không thể giải mã trên thiết bị của bạn do Forward Secrecy]</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 mt-8 shrink-0">
                  <button
                    onClick={() => setShowCiphertextModal(true)}
                    className="bg-white hover:bg-slate-50 text-corporate-900 border border-corporate-200 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-sm"
                  >
                    <Search size={16} className="mr-2" /> Xem bản mã (ciphertext)
                  </button>
                </div>

                {showCiphertextModal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-xl max-w-4xl mx-auto w-full relative shrink-0 flex flex-col items-center"
                  >
                    <button
                      onClick={() => setShowCiphertextModal(false)}
                      className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>

                    <ShieldCheck size={56} className="text-green-500 mb-4 mt-2" />
                    <h2 className="text-xl md:text-2xl font-bold text-white font-mono tracking-widest text-center mb-6 uppercase">RAW CIPHERTEXT PAYLOAD</h2>

                    <div className="w-full bg-black/95 rounded-xl p-6 max-h-[400px] overflow-y-auto border border-green-500/50 drop-shadow-[0_0_20px_rgba(34,197,94,0.15)] shadow-inner text-left">
                      <pre className="text-green-400 font-mono text-[11px] md:text-xs break-all whitespace-pre-wrap leading-relaxed select-all">
                        {rawCiphertext || mailDetails.content}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : decryptionState !== 'decrypted' ? (
              <div className="flex flex-col space-y-6 flex-1 justify-center max-w-2xl mx-auto w-full">
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
              <div className="flex flex-col flex-1 bg-corporate-50 -m-8 p-8 rounded-xl overflow-y-auto min-h-full">
                {signatureVerified && (
                  <div className="bg-green-50/50 border border-green-500/20 text-green-700 px-5 py-4 rounded-xl mb-6 shadow-sm w-full shrink-0">
                    <div className="flex items-center mb-3">
                      <ShieldCheck size={20} className="mr-2 shrink-0 text-green-600" />
                      <span className="font-bold text-base">E2E Cryptographic Verification Successful:</span>
                    </div>
                    <ul className="space-y-2 text-sm ml-1">
                      <li className="flex items-start">
                        <CheckCircle2 size={16} className="mr-2 mt-0.5 shrink-0 text-green-500" />
                        <span><strong>Valid signature</strong> — confirming that it is indeed <span className="font-bold">{mailDetails.senderDisplay || 'Unknown'}</span> who signed.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 size={16} className="mr-2 mt-0.5 shrink-0 text-green-500" />
                        <span><strong>Recipient ID == "{user?.name || user?.alias || 'Bạn'}"</strong> — The message was sent to the right person.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 size={16} className="mr-2 mt-0.5 shrink-0 text-green-500" />
                        <span><strong>Valid timestamp</strong> — The message was not replayed.</span>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="bg-white border border-corporate-200 shadow-sm rounded-xl relative w-full text-corporate-900 min-h-[520px] flex flex-col shrink-0">
                  {/* Lock icon pinned on top right */}
                  <div className="absolute -top-4 right-6 h-8 w-8 bg-blue-50 border border-corporate-100 rounded-full shadow-sm flex items-center justify-center cursor-pointer" title="E2E Encrypted">
                    <Lock size={14} className="text-accent-blue" />
                  </div>

                  {/* Header Info Block */}
                  <div className="px-5 md:px-8 pt-6 md:pt-10 pb-6 text-sm text-corporate-500 flex flex-col space-y-3 md:space-y-4 font-sans">
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Từ</span>
                      <span className="font-semibold text-corporate-900 break-words">{mailDetails.senderDisplay || 'Unknown'} <span className="text-[10px] font-normal opacity-50 ml-0 md:ml-2 block md:inline">({resolveAlias(trueSenderPubKey || mailDetails.senderPubKey)})</span></span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Đến</span>
                      <span className="font-semibold text-corporate-900 break-words">{user?.name || user?.alias || 'Bạn'}</span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Thời gian</span>
                      <span className="text-corporate-900 font-medium break-words">{msgTimestamp ? new Date(parseInt(msgTimestamp)).toLocaleString('vi-VN') : mailDetails.date}</span>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[100px_1fr]">
                      <span className="opacity-70 text-xs md:text-sm mb-0.5 md:mb-0">Mã hoá</span>
                      <span className="text-accent-blue font-semibold font-mono text-xs bg-blue-50 px-2 py-1 rounded w-max mt-1 md:mt-0 break-words">ECDH-P256 + AES-GCM-256</span>
                    </div>
                  </div>

                  <div className="mx-4 md:mx-8 border-b border-corporate-100 mb-6"></div>

                  {/* Body */}
                  <div className="px-5 md:px-8 pb-8 prose prose-corporate max-w-none text-corporate-800 leading-relaxed font-sans whitespace-pre-wrap flex-1 flex flex-col break-words text-sm md:text-base">
                    {decryptedContent}

                    {mailDetails.attachments.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-corporate-100 font-sans">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-corporate-500 mb-4 flex items-center">
                          <FileText size={14} className="mr-2" />
                          Tài liệu đính kèm ({mailDetails.attachments.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {mailDetails.attachments.map((file, idx) => (
                            <a
                              key={idx}
                              href="#"
                              onClick={(e) => handleDownloadAttachment(e, file)}
                              className="flex items-center justify-between p-4 bg-corporate-50 border border-corporate-100 hover:border-accent-blue rounded-xl transition-all group cursor-pointer"
                            >
                              <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-white border border-corporate-200 flex items-center justify-center text-corporate-500 shrink-0 group-hover:scale-105 transition-transform group-hover:text-accent-blue">
                                  <FileText size={20} />
                                </div>
                                <div className="flex flex-col min-w-0 pr-2">
                                  <span className="text-sm font-semibold text-corporate-900 truncate">{file.name}</span>
                                  <span className="text-xs text-corporate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-corporate-400 group-hover:bg-accent-blue group-hover:text-white transition-colors shrink-0 shadow-sm border border-corporate-200">
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
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 mt-8 shrink-0">
                  <button
                    onClick={() => setShowCiphertextModal(!showCiphertextModal)}
                    className="bg-white hover:bg-slate-50 text-corporate-900 border border-corporate-200 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-sm"
                  >
                    <Search size={16} className="mr-2" /> View the ciphertext
                  </button>
                  <button
                    onClick={handleReply}
                    className="bg-white hover:bg-slate-50 text-corporate-900 border border-corporate-200 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-sm"
                  >
                    <Reply size={16} className="mr-2" /> Reply
                  </button>
                </div>

                {showCiphertextModal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-slate-900 rounded-xl p-8 border border-slate-700 shadow-xl max-w-4xl mx-auto w-full relative flex flex-col items-center"
                  >
                    <button
                      onClick={() => setShowCiphertextModal(false)}
                      className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>

                    <ShieldCheck size={56} className="text-green-500 mb-4 mt-2" />
                    <h2 className="text-xl md:text-2xl font-bold text-white font-mono tracking-widest text-center mb-6 uppercase">RAW CIPHERTEXT PAYLOAD</h2>

                    <div className="w-full bg-black/95 rounded-xl p-6 max-h-[400px] overflow-y-auto border border-green-500/50 drop-shadow-[0_0_20px_rgba(34,197,94,0.15)] shadow-inner text-left">
                      <pre className="text-green-400 font-mono text-[11px] md:text-xs break-all whitespace-pre-wrap leading-relaxed select-all">
                        {rawCiphertext || mailDetails.content}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
