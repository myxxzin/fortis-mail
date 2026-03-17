import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth, db, googleProvider } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: () => Promise<boolean>; // Returns true if new user, false if already exists
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
        try {
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...docSnap.data() } as User);
          } else {
            // No profile, create a temporary one for offline access
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Vault User',
              publicKey: generateMockKey('PUB'),
              privateKey: generateMockKey('PRIV')
            });
          }
        } catch (error) {
          console.error("Firestore error in onAuthStateChanged, using fallback:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'Vault User (Offline)',
            publicKey: generateMockKey('PUB'),
            privateKey: generateMockKey('PRIV')
          });
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newUserProfile = {
      email,
      name,
      department: 'Engineering',
      position: 'Software Engineer',
      age: 25,
      publicKey: generateMockKey('PUB'),
      privateKey: generateMockKey('PRIV')
    };
    try {
      await setDoc(doc(db, 'users', cred.user.uid), newUserProfile);
    } catch (error) {
      console.warn("Could not save to Firestore (offline limit?), continuing registration...", error);
    }
    
    // Auto sign out after registering, forcing them to login
    await signOut(auth);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const userRef = doc(db, 'users', cred.user.uid);
    
    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        // User doesn't have an account
        if (auth.currentUser) {
          await auth.currentUser.delete(); // Remove the erroneously created auth record
        }
        await signOut(auth);
        throw new Error("Tài khoản chưa tồn tại. Vui lòng đăng ký."); // Account doesn't exist
      } else {
        setUser({ uid: cred.user.uid, ...docSnap.data() } as User);
      }
    } catch (error: any) {
       if (error.message === "Tài khoản chưa tồn tại. Vui lòng đăng ký.") throw error;
       
       console.warn("getDoc failed in loginWithGoogle, falling back to offline mode:", error);
       setUser({
         uid: cred.user.uid,
         email: cred.user.email || '',
         name: cred.user.displayName || 'Vault User (Offline)',
         publicKey: generateMockKey('PUB'),
         privateKey: generateMockKey('PRIV')
       });
    }
  };

  const registerWithGoogle = async (): Promise<boolean> => {
    const cred = await signInWithPopup(auth, googleProvider);
    const userRef = doc(db, 'users', cred.user.uid);
    
    let exists = false;
    try {
      const docSnap = await getDoc(userRef);
      exists = docSnap.exists();
    } catch (error) {
      console.warn("getDoc failed, assuming new user for offline resilience:", error);
      exists = false; // Assume new user if we can't read DB
    }
    
    if (!exists) {
      const newUserProfile = {
        email: cred.user.email || '',
        name: cred.user.displayName || 'Vault User',
        department: 'Engineering',
        position: 'Software Engineer',
        age: 25,
        publicKey: generateMockKey('PUB'),
        privateKey: generateMockKey('PRIV')
      };
      
      try {
        await setDoc(userRef, newUserProfile);
      } catch (error) {
        console.warn("setDoc failed (offline?), ignoring so user can proceed:", error);
      }
      
      return true; // Indicates a successful new registration
    } else {
      // User already exists
      return false; // Indicates account already existed
    }
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
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, registerWithGoogle, logout, updateProfile }}>
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
