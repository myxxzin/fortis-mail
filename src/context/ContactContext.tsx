import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export interface Contact {
  id: string;
  userId: string;
  alias: string;
  publicKey: string;
  createdAt?: any;
}

interface ContactContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  loading: boolean;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setContacts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const contactsRef = collection(db, 'contacts');
    
    // Listen for contacts belonging to the current user
    const userContactsQuery = query(contactsRef, where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(userContactsQuery, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
      
      // Sort alphabetically by alias by default
      contactsData.sort((a, b) => a.alias.localeCompare(b.alias));
      
      setContacts(contactsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addContact = async (contactData: Omit<Contact, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error("Must be logged in to add a contact");
    
    const contactsRef = collection(db, 'contacts');
    await addDoc(contactsRef, {
      ...contactData,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const contactRef = doc(db, 'contacts', id);
    await updateDoc(contactRef, updates);
  };

  const deleteContact = async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
    await deleteDoc(contactRef);
  };

  return (
    <ContactContext.Provider value={{ contacts, addContact, updateContact, deleteContact, loading }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}
