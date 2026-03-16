import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export interface Mail {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string; // The encrypted ciphertext
  date: string;
  timestamp: any;
  isUnread: boolean;
  isSystem: boolean;
}

interface MailContextType {
  mails: Mail[];
  sentMails: Mail[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  deleteMail: (id: string) => Promise<void>;
  sendMail: (mailData: Partial<Mail>) => Promise<void>;
}

const MailContext = createContext<MailContextType | undefined>(undefined);

export function MailProvider({ children }: { children: ReactNode }) {
  const [mails, setMails] = useState<Mail[]>([]);
  const [sentMails, setSentMails] = useState<Mail[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) {
      setMails([]);
      setSentMails([]);
      return;
    }

    const mailsRef = collection(db, 'mails');
    
    // Listen for Inbox messages (where recipient is current user)
    const inboxQuery = query(mailsRef, where('recipient', '==', user.email));
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
      
      setMails(inboxData);
    });

    // Listen for Sent messages (where sender is current user email)
    const sentQuery = query(mailsRef, where('sender', '==', user.email));
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

    return () => {
      unsubscribeInbox();
      unsubscribeSent();
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
      await addDoc(mailsRef, {
        ...mailData,
        sender: user.email,
        timestamp: serverTimestamp(),
        isUnread: true,
        isSystem: false
      });
    } catch (err) {
      console.error("Error sending mail", err);
      throw err;
    }
  };

  return (
    <MailContext.Provider value={{ mails, sentMails, unreadCount, markAsRead, deleteMail, sendMail }}>
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
