import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export interface Mail {
  id: string;
  senderPubKey: string;
  senderDisplay?: string;
  recipientPubKey: string;
  subject: string;
  content: string; // The encrypted ciphertext for the recipient
  senderContent?: string; // The encrypted ciphertext for the sender (Sent Items)
  date: string;
  timestamp: any;
  isUnread: boolean;
  isSystem: boolean;
  attachments?: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
}

interface MailContextType {
  mails: Mail[];
  sentMails: Mail[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  deleteMail: (id: string) => Promise<void>;
  sendMail: (mailData: Partial<Mail>) => Promise<void>;
  drafts: any[];
  saveDraft: (draftData: any) => Promise<string>;
  deleteDraft: (id: string) => Promise<void>;
}

const MailContext = createContext<MailContextType | undefined>(undefined);

export function MailProvider({ children }: { children: ReactNode }) {
  const [mails, setMails] = useState<Mail[]>([]);
  const [sentMails, setSentMails] = useState<Mail[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) {
      setMails([]);
      setSentMails([]);
      setDrafts([]);
      return;
    }

    const mailsRef = collection(db, 'mails');

    // Listen for Inbox messages (where recipientPubKey is current user's public key)
    const inboxQuery = query(mailsRef, where('recipientPubKey', '==', user.publicKey));
    const unsubscribeInbox = onSnapshot(inboxQuery, (snapshot) => {
      const inboxData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to readable string if available
        date: doc.data().timestamp ? new Date(doc.data().timestamp.toDate()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'
      })) as Mail[];

      // Sort newest first
      inboxData.sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });

      const welcomeMail: Mail = {
        id: 'msg-welcome',
        senderPubKey: 'System Key',
        recipientPubKey: user.publicKey || '',
        subject: 'Chào mừng đến với Cổng giao tiếp bảo mật',
        content: "Chào mừng bạn đến với Cổng giao tiếp bảo mật FortisMail\nTrong thế giới số ngày càng phức tạp, sự riêng tư không phải là đặc quyền — đó là quyền căn bản của mỗi người. FortisMail được xây dựng trên triết lý ấy: mọi thư bạn gửi đều được mã hóa hoàn toàn ngay trên thiết bị của bạn, trước khi rời khỏi màn hình — kể cả chúng tôi cũng không thể đọc được.\nĐể bắt đầu, có hai điều bạn nên ghi nhớ:\n\nPrivate Key là chìa khóa cá nhân của bạn — hãy giữ gìn tuyệt đối bí mật, vì không ai có thể khôi phục nó thay bạn.\nKhi muốn liên lạc với ai, bạn sẽ cần Public Key của họ để thiết lập kênh liên lạc bảo mật.\n\nChúng tôi tin rằng bảo mật thực sự không nên đòi hỏi bạn phải là chuyên gia. Chỉ cần tin tưởng vào quy trình — và bắt đầu viết.\nTrân trọng,\nĐội ngũ Bảo mật FortisMail",
        date: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        timestamp: null,
        isUnread: false,
        isSystem: true
      };

      setMails([welcomeMail, ...inboxData]);
    });

    // Listen for Sent messages (where senderPubKey is current user's public key)
    const sentQuery = query(mailsRef, where('senderPubKey', '==', user.publicKey));
    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      const sentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp ? new Date(doc.data().timestamp.toDate()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'
      })) as Mail[];

      sentData.sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });

      setSentMails(sentData);
    });

    // Listen for Drafts
    const draftsRef = collection(db, 'drafts');
    const draftsQuery = query(draftsRef, where('senderPubKey', '==', user.publicKey));
    const unsubscribeDrafts = onSnapshot(draftsQuery, (snapshot) => {
      const draftsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp ? new Date(doc.data().timestamp.toDate()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'
      }));

      draftsData.sort((a: any, b: any) => {
        const timeA = a.timestamp ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
      });

      setDrafts(draftsData);
    });

    return () => {
      unsubscribeInbox();
      unsubscribeSent();
      unsubscribeDrafts();
    };
  }, [user]);

  const unreadCount = mails.filter(m => m.isUnread).length;

  const markAsRead = async (id: string) => {
    try {
      const mailRef = doc(db, 'mails', id);
      await updateDoc(mailRef, { isUnread: false });
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  const deleteMail = async (id: string) => {
    try {
      const mailRef = doc(db, 'mails', id);
      await deleteDoc(mailRef);
    } catch (err) {
      console.error("Error deleting mail", err);
    }
  };

  const sendMail = async (mailData: Partial<Mail>) => {
    try {
      if (!user) throw new Error("Must be logged in to send mail");
      const mailsRef = collection(db, 'mails');
      
      // Firestore does not accept undefined values
      const sanitizedData = Object.fromEntries(
        Object.entries(mailData).filter(([_, v]) => v !== undefined)
      );

      await addDoc(mailsRef, {
        ...sanitizedData,
        senderPubKey: user.publicKey,
        timestamp: serverTimestamp(),
        isUnread: true,
        isSystem: false
      });
    } catch (err) {
      console.error("Error sending mail", err);
      throw err;
    }
  };

  const saveDraft = async (draftData: any) => {
    if (!user) throw new Error("Must be logged in");
    const draftsRef = collection(db, 'drafts');
    const docRef = await addDoc(draftsRef, {
      ...draftData,
      senderPubKey: user.publicKey,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  };

  const deleteDraft = async (id: string) => {
    try {
      const draftRef = doc(db, 'drafts', id);
      await deleteDoc(draftRef);
    } catch (err) {
      console.error("Error deleting draft", err);
    }
  };

  return (
    <MailContext.Provider value={{ mails, sentMails, drafts, unreadCount, markAsRead, deleteMail, sendMail, saveDraft, deleteDraft }}>
      {children}
    </MailContext.Provider>
  );
}

export function useMail() {
  const context = useContext(MailContext);
  if (context === undefined) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
}
