// Utility for Zero-Knowledge Authentication
// Upgraded to Ephemeral ECDH and separated ECDSA/ECDH Key Pairs.

const enc = new TextEncoder();
const dec = new TextDecoder();

export function ab2base64(buf: ArrayBuffer | ArrayBufferLike | Uint8Array | any): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf as ArrayBuffer);
  const binString = String.fromCodePoint(...bytes);
  return window.btoa(binString);
}

export function base642ab(base64: string): ArrayBuffer {
  const binString = window.atob(base64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.codePointAt(i)!;
  }
  return bytes.buffer;
}

// --- Key Derivation ---

export const deriveAESKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const material = enc.encode(password);
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
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const generateVerifierHash = async (password: string, salt: Uint8Array): Promise<string> => {
    const data = enc.encode(password + ab2base64(salt) + "VERIFIER");
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const encryptPrivateKeys = async (privateKeysJson: string, aesKey: CryptoKey): Promise<{ ciphertext: string, iv: string }> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedContent = enc.encode(privateKeysJson);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    aesKey,
    encodedContent
  );

  return { ciphertext: ab2base64(encryptedBuffer), iv: ab2base64(iv.buffer) };
};

export const decryptPrivateKeys = async (encryptedData: { ciphertext: string, iv: string }, aesKey: CryptoKey): Promise<string> => {
  const ciphertextBytes = base642ab(encryptedData.ciphertext);
  const ivBytes = base642ab(encryptedData.iv);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivBytes) },
    aesKey,
    ciphertextBytes
  );

  return dec.decode(decryptedBuffer);
};

// --- ECC (Elliptic Curve Cryptography) ---

export const generateECCSignKeyPair = async (): Promise<CryptoKeyPair> => {
  return window.crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
};

export const generateECCEncryptKeyPair = async (): Promise<CryptoKeyPair> => {
  return window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
};

export const exportPublicKey = async (key: CryptoKey, type: 'SIGN' | 'ENCRYPT'): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  const exportedAsBase64 = ab2base64(exported);
  return `-----BEGIN FORTIS ${type} PUBLIC KEY-----\n${exportedAsBase64.match(/.{1,64}/g)?.join('\n')}\n-----END FORTIS ${type} PUBLIC KEY-----`;
};

export const exportPrivateKey = async (key: CryptoKey, type: 'SIGN' | 'ENCRYPT'): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  const exportedAsBase64 = ab2base64(exported);
  return `-----BEGIN FORTIS ${type} PRIVATE KEY-----\n${exportedAsBase64.match(/.{1,64}/g)?.join('\n')}\n-----END FORTIS ${type} PRIVATE KEY-----`;
};

const extractPemContents = (pem: string, keyType: 'PUBLIC' | 'PRIVATE', usage: 'SIGN' | 'ENCRYPT'): ArrayBuffer => {
  const header = `-----BEGIN FORTIS ${usage} ${keyType} KEY-----`;
  const footer = `-----END FORTIS ${usage} ${keyType} KEY-----`;
  if (!pem || !pem.includes(header) || !pem.includes(footer)) {
    throw new Error(`Invalid ${usage.toLowerCase()} ${keyType.toLowerCase()} key format.`);
  }
  const contents = pem.substring(pem.indexOf(header) + header.length, pem.indexOf(footer)).replace(/\s/g, '');
  return base642ab(contents);
};

export const importPublicKeyForECDSA = async (pem: string): Promise<CryptoKey> => {
  const binaryDer = extractPemContents(pem, 'PUBLIC', 'SIGN');
  return await window.crypto.subtle.importKey(
    "spki", binaryDer, { name: "ECDSA", namedCurve: "P-256" }, true, ["verify"]
  );
};

export const importPrivateKeyForECDSA = async (pem: string): Promise<CryptoKey> => {
  const binaryDer = extractPemContents(pem, 'PRIVATE', 'SIGN');
  return await window.crypto.subtle.importKey(
    "pkcs8", binaryDer, { name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]
  );
};

export const importPublicKeyForECDH = async (pem: string): Promise<CryptoKey> => {
  const binaryDer = extractPemContents(pem, 'PUBLIC', 'ENCRYPT');
  return await window.crypto.subtle.importKey(
    "spki", binaryDer, { name: "ECDH", namedCurve: "P-256" }, true, []
  );
};

export const importPrivateKeyForECDH = async (pem: string): Promise<CryptoKey> => {
  const binaryDer = extractPemContents(pem, 'PRIVATE', 'ENCRYPT');
  return await window.crypto.subtle.importKey(
    "pkcs8", binaryDer, { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]
  );
};

// --- Operations ---

export const signPayload = async (payloadStr: string, privateKeyPem: string): Promise<string> => {
  const privateKey = await importPrivateKeyForECDSA(privateKeyPem);
  const signatureBuffer = await window.crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    privateKey,
    enc.encode(payloadStr)
  );
  return ab2base64(signatureBuffer);
};

export const verifySignature = async (payloadStr: string, signatureBase64: string, publicKeyPem: string): Promise<boolean> => {
  const publicKey = await importPublicKeyForECDSA(publicKeyPem);
  const signatureBuffer = base642ab(signatureBase64);
  return await window.crypto.subtle.verify(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    publicKey,
    signatureBuffer,
    enc.encode(payloadStr)
  );
};

export interface EncryptedMessagePayload {
  ephemeralPubKeyPem: string;
  ivBase64: string;
  ciphertextBase64: string;
  attachmentKeys?: {
    id: string;
    fileKeyBase64: string;
    ivBase64: string;
  }[];
}

export const encryptMessageHybrid = async (
  plaintext: string, 
  recipientEncryptPubKeyPem: string,
  senderSignPrivKeyPem: string,
  senderSignPubKeyPem: string,
  recipientIdentityId: string,
  attachmentKeys?: { id: string, fileKeyBase64: string, ivBase64: string }[]
): Promise<EncryptedMessagePayload> => {
  // 1. Context-Bound Signature
  const timestamp = Date.now().toString();
  const contextBoundPayload = `${plaintext}||To:${recipientIdentityId}||${timestamp}`;
  const signatureBase64 = await signPayload(contextBoundPayload, senderSignPrivKeyPem);

  // 2. Sealed Payload JSON
  const innerPayloadObj = {
    body: plaintext,
    senderPubKey: senderSignPubKeyPem,
    timestamp: timestamp,
    signatureBase64: signatureBase64
  };
  const innerPayloadStr = JSON.stringify(innerPayloadObj);

  // 3. Ephemeral ECDH Key Derivation
  const ephemeralKeyPair = await generateECCEncryptKeyPair();
  const ecdhPubKey = await importPublicKeyForECDH(recipientEncryptPubKeyPem);

  const sessionKey = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: ecdhPubKey },
    ephemeralKeyPair.privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const ephemeralPubKeyPem = await exportPublicKey(ephemeralKeyPair.publicKey, 'ENCRYPT');

  // 4. Encrypt with AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    sessionKey,
    enc.encode(innerPayloadStr)
  );

  return {
    ephemeralPubKeyPem,
    ivBase64: ab2base64(iv.buffer),
    ciphertextBase64: ab2base64(ciphertextBuffer),
    ...(attachmentKeys ? { attachmentKeys } : {})
  };
};

export const decryptMessageHybrid = async (
  payload: EncryptedMessagePayload, 
  userEncryptPrivKeyPem: string, 
  expectedSenderSignPubKeyPem: string,
  myIdentityId: string
): Promise<{ plaintext: string, verifiedSender: string, timestamp: string }> => {
  
  if (!payload.ephemeralPubKeyPem) {
      throw new Error("Missing ephemeral public key in payload. Legacy static ECDH not supported.");
  }

  // 1. Derivation of ECDH Session Key from Ephemeral Pub + User Encrypt Priv
  const ecdhPrivKey = await importPrivateKeyForECDH(userEncryptPrivKeyPem);
  const ephemeralPubKey = await importPublicKeyForECDH(payload.ephemeralPubKeyPem);

  const sessionKey = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: ephemeralPubKey },
    ecdhPrivKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // 2. AES-GCM Decryption
  const ivBuffer = base642ab(payload.ivBase64);
  const ciphertextBuffer = base642ab(payload.ciphertextBase64);

  const plaintextBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
    sessionKey,
    ciphertextBuffer
  );

  const rawDecrypted = dec.decode(plaintextBuffer);
  let innerPayloadObj;
  try {
    innerPayloadObj = JSON.parse(rawDecrypted);
  } catch(e) {
    throw new Error("Failed to parse decrypted payload structure.");
  }

  // 3. Context-Bound Signature Verification
  if (!innerPayloadObj.body || !innerPayloadObj.signatureBase64 || !innerPayloadObj.senderPubKey || !innerPayloadObj.timestamp) {
     throw new Error("Message is missing critical signature metadata.");
  }

  const contextBoundPayload = `${innerPayloadObj.body}||To:${myIdentityId}||${innerPayloadObj.timestamp}`;
  
  const isValid = await verifySignature(
    contextBoundPayload, 
    innerPayloadObj.signatureBase64, 
    innerPayloadObj.senderPubKey
  );

  if (!isValid) {
    throw new Error("CRITICAL SECURITY ALERT: Digital Signature Invalid. The message was forged, tampered with, or surreptitiously forwarded.");
  }

  if (expectedSenderSignPubKeyPem !== 'SEALED' && innerPayloadObj.senderPubKey !== expectedSenderSignPubKeyPem) {
    throw new Error("CRITICAL SECURITY ALERT: Sender Public Key mismatch. Message forged by an unauthorized identity.");
  }

  return {
    plaintext: innerPayloadObj.body,
    verifiedSender: innerPayloadObj.senderPubKey,
    timestamp: innerPayloadObj.timestamp
  };
};

export const packHybridPayload = (payload: EncryptedMessagePayload): string => {
  const jsonStr = JSON.stringify(payload);
  const base64Str = ab2base64(enc.encode(jsonStr).buffer);
  
  return `-----BEGIN FORTISMAIL ENCRYPTED MESSAGE-----
Version: 3.0 (Ephemeral ECDH P-256 / AES-GCM-256)
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
  
  const jsonStr = dec.decode(base642ab(base64Str));
  return JSON.parse(jsonStr) as EncryptedMessagePayload;
};

// --- E2E Attachment Encryption ---
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
    fileKeyBase64: ab2base64(exportedKey),
    ivBase64: ab2base64(iv.buffer)
  };
};

export const decryptFile = async (ciphertextBlob: Blob, fileKeyBase64: string, ivBase64: string, mimeType: string): Promise<Blob> => {
  const fileKeyRaw = base642ab(fileKeyBase64);
  const ivBuffer = base642ab(ivBase64);
  
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
