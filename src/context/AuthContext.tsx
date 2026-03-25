import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { deriveAESKey, decryptPrivateKeys, encryptPrivateKeys, generateVerifierHash, ab2base64, base642ab } from '../utils/cryptoAuth';

interface User {
  uid: string;
  identityId: string;
  email: string;
  name: string;
  alias?: string;
  publicKey: string;
  privateKey?: string; // Kept in memory only, not persisted normally by onAuthStateChanged
  pinHash?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identityId: string, pass: string) => Promise<void>;
  register: (identityId: string, pass: string, alias: string, publicKey: string, privateKey: string) => Promise<void>;
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

  const login = async (identityId: string, pass: string) => {
    const email = `${identityId.toLowerCase()}@fortismail.internal`;
    
    // 1. Authenticate with Firebase using dummy email + Master Password
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          throw new Error("Invalid Username or Password");
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
    
    // Support legacy (identityId as salt) or new strong random salt
    const salt = data.saltBase64 
      ? new Uint8Array(base642ab(data.saltBase64))
      : new TextEncoder().encode(identityId + "FORTISMAIL_SALT");

    // 3. Verify the Hash locally
    const localHash = await generateVerifierHash(pass, salt);
    if (localHash !== data.verifierHash) {
        await signOut(auth);
        throw new Error("Invalid Master Password. Cryptographic verification failed.");
    }

    // 4. Derive AES key and Decrypt the Private Key into memory
    const aesKey = await deriveAESKey(pass, salt);
    let decryptedPrivateKey = "";
    try {
        decryptedPrivateKey = await decryptPrivateKeys(data.encryptedPrivateKey, aesKey);
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
      privateKey: decryptedPrivateKey.trim(),
      pinHash: data.pinHash
    });
  };

  const register = async (identityId: string, pass: string, alias: string, publicKey: string, privateKey: string) => {
    const email = `${identityId.toLowerCase()}@fortismail.internal`;
    
    // 1. Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    
    // 2. Derive AES Key with Random PBKDF2 Salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = ab2base64(salt.buffer);

    const aesKey = await deriveAESKey(pass, salt);
    const encryptedPrivateKey = await encryptPrivateKeys(privateKey, aesKey);
    
    // 3. Generate Verifier Hash
    const verifierHash = await generateVerifierHash(pass, salt);

    // 4. Save to Firestore (Zero-Knowledge: Private key cipher only)
    const newUserProfile = {
      identityId,
      email,
      alias,
      publicKey: publicKey.trim(),
      encryptedPrivateKey,
      verifierHash,
      saltBase64,
      pinHash: null
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newUserProfile);
      localStorage.setItem(`fortis_pending_tour_${cred.user.uid}`, 'true');
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
