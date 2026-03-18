// Utility for Zero-Knowledge Seed Phrase Authentication

// A curated list of 256 words (simplified BIP39 style) for demo purposes
const WORD_LIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
  "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
  "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
  "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
  "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge",
  "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain",
  "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become",
  "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit",
  "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology",
  "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless",
  "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body",
  "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss",
  "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread",
  "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze",
  "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb",
  "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "butter",
  "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm"
];

/**
 * Generates a 6-word random seed phrase from the word list.
 */
export const generateSeedPhrase = (): string[] => {
  const phrase: string[] = [];
  const cryptoObj = window.crypto;
  const array = new Uint32Array(6);
  cryptoObj.getRandomValues(array);
  
  for (let i = 0; i < 6; i++) {
    const index = array[i] % WORD_LIST.length;
    phrase.push(WORD_LIST[index]);
  }
  return phrase;
};

/**
 * Derives a 256-bit AES-GCM key from the Seed Phrase and Master Password.
 * We use PBKDF2 with 100,000 iterations to make brute-forcing very expensive.
 */
export const deriveAESKey = async (seedPhrase: string[], password: string, identityId: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const material = enc.encode(seedPhrase.join(' ') + password);
  const salt = enc.encode(identityId + "FORTISMAIL_SALT");

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    material,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

/**
 * Generates a Verifier Hash to send to the server.
 * The server stores this hash and compares it during login.
 */
export const generateVerifierHash = async (seedPhrase: string[], password: string, identityId: string): Promise<string> => {
    const enc = new TextEncoder();
    const data = enc.encode(seedPhrase.join('') + password + identityId + "VERIFIER");
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Encrypts the Private Key using the derived AES key for storage on Firestore.
 */
export const encryptPrivateKey = async (privateKey: string, aesKey: CryptoKey): Promise<{ ciphertext: string, iv: string }> => {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedContent = enc.encode(privateKey);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    aesKey,
    encodedContent
  );

  const ciphertextArray = Array.from(new Uint8Array(encryptedBuffer));
  const ciphertextBase64 = btoa(String.fromCharCode.apply(null, ciphertextArray));
  
  const ivArray = Array.from(iv);
  const ivBase64 = btoa(String.fromCharCode.apply(null, ivArray));

  return { ciphertext: ciphertextBase64, iv: ivBase64 };
};

/**
 * Decrypts the Private Key from Firestore using the AES key derived from user input.
 */
export const decryptPrivateKey = async (encryptedData: { ciphertext: string, iv: string }, aesKey: CryptoKey): Promise<string> => {
  const ciphertextBytes = Uint8Array.from(atob(encryptedData.ciphertext), c => c.charCodeAt(0));
  const ivBytes = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBytes
    },
    aesKey,
    ciphertextBytes
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
};

// --- Real Asymmetric Cryptography (WebCrypto RSA-OAEP & AES-GCM Hybrid) ---

function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint8Array(buf) as any);
}

function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export const generateRSAKeyPair = async (): Promise<CryptoKeyPair> => {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const exportPublicKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
};

export const exportPrivateKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;
};

export const importPublicKey = async (pem: string): Promise<CryptoKey> => {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  
  if (!pem || !pem.includes(pemHeader) || !pem.includes(pemFooter)) {
    throw new Error("The recipient's Public Key is invalid. It must be a valid RSA PEM format starting with '-----BEGIN PUBLIC KEY-----'.");
  }

  try {
    const pemContents = pem.substring(pem.indexOf(pemHeader) + pemHeader.length, pem.indexOf(pemFooter)).replace(/\s/g, '');
    const binaryDerString = window.atob(pemContents);
    const binaryDer = str2ab(binaryDerString);

    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["encrypt"]
    );
  } catch (err) {
    throw new Error("Failed to read the Public Key. It may be corrupted or incorrectly formatted.");
  }
};

export const importPrivateKey = async (pem: string): Promise<CryptoKey> => {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  
  if (!pem || !pem.includes(pemHeader) || !pem.includes(pemFooter)) {
    throw new Error("Your Private Key is invalid. It must be a valid RSA PEM format starting with '-----BEGIN PRIVATE KEY-----'.");
  }

  try {
    const pemContents = pem.substring(pem.indexOf(pemHeader) + pemHeader.length, pem.indexOf(pemFooter)).replace(/\s/g, '');
    const binaryDerString = window.atob(pemContents);
    const binaryDer = str2ab(binaryDerString);

    return await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );
  } catch (err) {
    throw new Error("Failed to unlock Private Key. It may be corrupted.");
  }
};

export interface EncryptedMessagePayload {
  encryptedSessionKeyBase64: string;
  ivBase64: string;
  ciphertextBase64: string;
  attachmentKeys?: {
    id: string; // matches the attachment URL or unique identifier
    fileKeyBase64: string;
    ivBase64: string;
  }[];
}

export const encryptMessageHybrid = async (plaintext: string, recipientPubKeyPem: string, attachmentKeys?: { id: string, fileKeyBase64: string, ivBase64: string }[]): Promise<EncryptedMessagePayload> => {
  // 1. Import Recipient's RSA Public Key
  const publicKey = await importPublicKey(recipientPubKeyPem);

  // 2. Generate a random AES-GCM session key
  const sessionKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 3. Encrypt the plaintext with the AES session key
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    sessionKey,
    enc.encode(plaintext)
  );

  // 4. Encrypt the AES session key using the Recipient's RSA Public Key
  const exportedSessionKey = await window.crypto.subtle.exportKey("raw", sessionKey);
  const encryptedSessionKeyBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    exportedSessionKey
  );

  return {
    encryptedSessionKeyBase64: window.btoa(ab2str(encryptedSessionKeyBuffer)),
    ivBase64: window.btoa(ab2str(iv.buffer)),
    ciphertextBase64: window.btoa(ab2str(ciphertextBuffer)),
    ...(attachmentKeys ? { attachmentKeys } : {})
  };
};

export const decryptMessageHybrid = async (payload: EncryptedMessagePayload, userPrivKeyPem: string): Promise<string> => {
  // 1. Import User's RSA Private Key
  const privateKey = await importPrivateKey(userPrivKeyPem);

  // 2. Decrypt the AES session key using the RSA Private Key
  const encryptedSessionKeyBuffer = str2ab(window.atob(payload.encryptedSessionKeyBase64));
  const sessionKeyRaw = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedSessionKeyBuffer
  );

  // 3. Import the decrypted AES session key
  const sessionKey = await window.crypto.subtle.importKey(
    "raw",
    sessionKeyRaw,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );

  // 4. Decrypt the ciphertext using the AES session key
  const ivBuffer = str2ab(window.atob(payload.ivBase64));
  const ciphertextBuffer = str2ab(window.atob(payload.ciphertextBase64));

  const plaintextBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
    sessionKey,
    ciphertextBuffer
  );

  const dec = new TextDecoder();
  return dec.decode(plaintextBuffer);
};

export const packHybridPayload = (payload: EncryptedMessagePayload): string => {
  const jsonStr = JSON.stringify(payload);
  const base64Str = window.btoa(jsonStr);
  
  return `-----BEGIN FORTISMAIL ENCRYPTED MESSAGE-----
Version: 1.0 (AES-GCM-256 / RSA-OAEP-4096)
Comment: https://fortismail.internal

${base64Str.trim()}
-----END FORTISMAIL ENCRYPTED MESSAGE-----`;
};

export const unpackHybridPayload = (asciiArmor: string): EncryptedMessagePayload => {
  const lines = asciiArmor.split('\n');
  let base64Parts = [];
  let isParsing = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '-----BEGIN FORTISMAIL ENCRYPTED MESSAGE-----') {
      isParsing = true;
      continue;
    }
    if (trimmed === '-----END FORTISMAIL ENCRYPTED MESSAGE-----') {
      break;
    }
    if (isParsing && !trimmed.startsWith('Version:') && !trimmed.startsWith('Comment:') && trimmed !== '') {
      base64Parts.push(trimmed);
    }
  }
  
  const base64Str = base64Parts.join('');
  if (!base64Str) throw new Error("Invalid ASCII Armor representation.");
  
  const jsonStr = window.atob(base64Str);
  return JSON.parse(jsonStr) as EncryptedMessagePayload;
};

// --- E2E Attachment Encryption ---

/**
 * Encrypts a File blob using a freshly generated AES-GCM 256-bit key.
 * Returns the encrypted Blob and the base64-encoded key and IV.
 */
export const encryptFile = async (file: File): Promise<{ ciphertextBlob: Blob, fileKeyBase64: string, ivBase64: string }> => {
  const fileKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const fileArrayBuffer = await file.arrayBuffer();

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    fileKey,
    fileArrayBuffer
  );

  const exportedKey = await window.crypto.subtle.exportKey("raw", fileKey);
  
  return {
    ciphertextBlob: new Blob([encryptedBuffer]),
    fileKeyBase64: window.btoa(ab2str(exportedKey)),
    ivBase64: window.btoa(ab2str(iv.buffer))
  };
};

/**
 * Decrypts an encrypted file Blob back into a plaintext Blob.
 */
export const decryptFile = async (ciphertextBlob: Blob, fileKeyBase64: string, ivBase64: string, mimeType: string): Promise<Blob> => {
  const fileKeyRaw = str2ab(window.atob(fileKeyBase64));
  const ivBuffer = str2ab(window.atob(ivBase64));
  
  const fileKey = await window.crypto.subtle.importKey(
    "raw",
    fileKeyRaw,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );

  const encryptedBuffer = await ciphertextBlob.arrayBuffer();

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
    fileKey,
    encryptedBuffer
  );

  return new Blob([decryptedBuffer], { type: mimeType });
};
