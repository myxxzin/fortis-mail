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

/**
 * Generates a mock "Public/Private Key" format string for UI purposes.
 * In a real WebCrypto implementation, this would generate an actual RSA-OAEP key pair.
 */
export const generateMockRSAKey = (type: 'PUB' | 'PRIV') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let key = `-----BEGIN ${type === 'PUB' ? 'PUBLIC' : 'PRIVATE'} KEY-----\n`;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 64; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    key += '\n';
  }
  key += `-----END ${type === 'PUB' ? 'PUBLIC' : 'PRIVATE'} KEY-----`;
  return key;
};
