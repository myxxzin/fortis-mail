import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { deriveAESKey, decryptPrivateKey, encryptPrivateKey, generateVerifierHash } from '../utils/cryptoAuth';

interface User {
  uid: string;
  identityId: string;
  email: string;
  name: string;
  alias?: string;
  publicKey: string;
  privateKey?: string; // Kept in memory only, not persisted normally by onAuthStateChanged
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identityId: string, pass: string, seedPhrase: string[]) => Promise<void>;
  register: (identityId: string, pass: string, alias: string, seedPhrase: string[], publicKey: string, privateKey: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When the app reloads, we check session.
    // Note: Because Private Key is mathematically derived from Password+Seed, 
    // a page reload means the Private Key is LOST from memory.
    // We only restore the "Public" profile. They must log in to get the Private Key back.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (identityId: string, pass: string, seedPhrase: string[]) => {
    const email = `${identityId.toLowerCase()}@fortismail.internal`;
    
    // 1. Authenticate with Firebase using dummy email + Master Password
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          throw new Error("Invalid Identity ID or Master Password.");
      }
      throw err;
    }
    
    // 2. Fetch User Profile from Firestore
    const userRef = doc(db, 'users', cred.user.uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      await signOut(auth);
      throw new Error("Identity not found in the encrypted vault.");
    }
    
    const data = docSnap.data();
    
    // 3. Verify the Hash locally to ensure they provided the right Seed Phrase
    const localHash = await generateVerifierHash(seedPhrase, pass, identityId);
    if (localHash !== data.verifierHash) {
        await signOut(auth);
        throw new Error("Invalid Master Password or Seed Phrase. Cryptographic verification failed.");
    }

    // 4. Derive AES key and Decrypt the Private Key into memory
    const aesKey = await deriveAESKey(seedPhrase, pass, identityId);
    let decryptedPrivateKey = "";
    try {
        decryptedPrivateKey = await decryptPrivateKey(data.encryptedPrivateKey, aesKey);
    } catch (e) {
        await signOut(auth);
        throw new Error("Failed to decrypt Secure Enclave. Check your credentials.");
    }

    setUser({
      uid: cred.user.uid,
      identityId: data.identityId,
      email: data.email,
      name: data.alias || data.identityId,
      publicKey: data.publicKey.trim(),
      privateKey: decryptedPrivateKey.trim()
    });
  };

  const register = async (identityId: string, pass: string, alias: string, seedPhrase: string[], publicKey: string, privateKey: string) => {
    const email = `${identityId.toLowerCase()}@fortismail.internal`;
    
    // 1. Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    
    // 2. Derive AES Key and encrypt the Private Key
    const aesKey = await deriveAESKey(seedPhrase, pass, identityId);
    const encryptedPrivateKey = await encryptPrivateKey(privateKey, aesKey);
    
    // 3. Generate Verifier Hash
    const verifierHash = await generateVerifierHash(seedPhrase, pass, identityId);

    // 4. Save to Firestore (Zero-Knowledge: Private key cipher only)
    const newUserProfile = {
      identityId,
      email,
      alias,
      publicKey: publicKey.trim(),
      encryptedPrivateKey,
      verifierHash
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newUserProfile);
    } catch (error) {
      console.error("Critical: Failed to build Identity Vault", error);
      throw new Error("Failed to construct the encrypted vault on the server.");
    }

    // Sign out to force them to manually log in using the seed phrase once
    await signOut(auth);
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
