import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth, db, googleProvider } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Generates a mock "Public Key" format string for UI purposes
const generateMockKey = (type: 'PUB' | 'PRIV') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let key = `-----BEGIN ${type === 'PUB' ? 'PUBLIC' : 'PRIVATE'} KEY-----\n`;
  for(let i=0; i<4; i++) {
    for(let j=0; j<64; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    key += '\n';
  }
  key += `-----END ${type === 'PUB' ? 'PUBLIC' : 'PRIVATE'} KEY-----\n`;
  return key;
};

interface User {
  uid: string;
  email: string;
  name: string;
  age?: number | string;
  position?: string;
  department?: string;
  publicKey: string;
  privateKey: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch or create their profile in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUser({ uid: firebaseUser.uid, ...docSnap.data() } as User);
        } else {
          // New user, generate keys and save to Firestore
          const newUserProfile = {
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Vault User',
            department: 'Engineering',
            position: 'Software Engineer',
            age: 25,
            publicKey: generateMockKey('PUB'),
            privateKey: generateMockKey('PRIV')
          };
          await setDoc(userRef, newUserProfile);
          setUser({ uid: firebaseUser.uid, ...newUserProfile });
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const register = async () => {
      // With Google Sign-in, register is essentially the same as login.
      // Firestore handles the "is new user" creation logic payload.
      await login();
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    // Optimistic UI update
    setUser(prev => prev ? { ...prev, ...updates } : null);
    
    // Update Firestore
    const userRef = doc(db, 'users', user.uid);
    try {
        await updateDoc(userRef, updates);
    } catch (error) {
        console.error("Error updating profile", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
