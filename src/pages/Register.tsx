import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon, CheckCircle2, KeyRound, AlertTriangle, Copy, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSeedPhrase, generateMockRSAKey } from '../utils/cryptoAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState<'setup' | 'seed' | 'verify' | 'generating' | 'success'>('setup');
  
  // Form State
  const [identityId, setIdentityId] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Seed Phrase State
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [verifyIndices, setVerifyIndices] = useState<number[]>([]);
  const [verifyInputs, setVerifyInputs] = useState<string[]>(['', '']);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityId || !alias || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Master Password must be at least 8 characters.");
      return;
    }
    if (identityId.length < 4 || !/^[a-zA-Z0-9_]+$/.test(identityId)) {
        setErrorMsg("Username must be at least 4 characters and contain only letters, numbers, and underscores.");
        return;
    }

    setErrorMsg('');
    const newSeed = generateSeedPhrase();
    setSeedPhrase(newSeed);
    setStep('seed');
  };

  const handleCopySeed = () => {
      navigator.clipboard.writeText(seedPhrase.join(' '));
  };

  const handleProceedToVerify = () => {
      // Pick 2 random indices to verify (e.g. out of 0-5)
      const indices: number[] = [];
      while(indices.length < 2) {
          const r = Math.floor(Math.random() * 6);
          if(indices.indexOf(r) === -1) indices.push(r);
      }
      setVerifyIndices(indices.sort());
      setStep('verify');
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const isCorrect = 
        verifyInputs[0].trim().toLowerCase() === seedPhrase[verifyIndices[0]] &&
        verifyInputs[1].trim().toLowerCase() === seedPhrase[verifyIndices[1]];

      if (!isCorrect) {
          setErrorMsg("Verification failed. The words do not match your Seed Phrase.");
          return;
      }

      setErrorMsg('');
      setStep('generating');

      try {
        const pubKey = generateMockRSAKey('PUB');
        const privKey = generateMockRSAKey('PRIV');
        
        await register(identityId, password, alias, seedPhrase, pubKey, privKey);
        
        setStep('success');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2500);
      } catch (err: any) {
        console.error("DEBUG: Registration failed", err);
        setErrorMsg(err.message || "Failed to create identity.");
        setStep('setup');
      }
  };

  return (
    <div className="flex min-h-screen bg-corporate-900 text-white relative overflow-hidden flex-col items-center justify-center p-6">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent-blue blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400 blur-[150px] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8 space-y-4 flex flex-col items-center">
          <img src="/logo.png" alt="FortisMail" className="h-[80px] object-contain mb-2" />
          <h1 className="text-2xl font-bold tracking-tight">Create Cryptographic Identity</h1>
          <p className="text-corporate-300 text-sm font-medium">Zero-Knowledge Enterprise Environment.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl min-h-[450px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SETUP */}
            {step === 'setup' && (
              <motion.form
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSetupSubmit}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 text-corporate-300" size={18} />
                    <input
                      type="text"
                      required
                      value={identityId}
                      onChange={(e) => setIdentityId(e.target.value)}
                      placeholder="Username (e.g. john_doe)"
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium transition-all"
                    />
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 text-corporate-300" size={18} />
                    <input
                      type="text"
                      required
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Display Name / Alias"
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-corporate-300" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Master Password"
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium tracking-widest transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-corporate-400 hover:text-white transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-corporate-300" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Master Password"
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium tracking-widest transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-corporate-400 hover:text-white transition-colors"
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3.5 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center space-x-2">
                  <span>Continue</span>
                  <ArrowRight size={18} />
                </button>

                {errorMsg && (
                  <div className="text-red-400 text-sm text-center mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                    {errorMsg}
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-corporate-300 hover:text-white transition-colors">
                    Already have an identity? Login here
                  </Link>
                </div>
              </motion.form>
            )}

            {/* STEP 2: SEED PHRASE */}
            {step === 'seed' && (
              <motion.div
                key="seed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 mb-2">
                    <AlertTriangle size={24} />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Secret Recovery Phrase</h2>
                    <p className="text-sm text-corporate-300 leading-relaxed">
                        These 6 words are the ONLY way to recover your account and decrypt your messages. 
                        Write them down on paper and keep them in a safe place. Do not share them.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full bg-black/30 p-4 rounded-xl border border-white/10">
                    {seedPhrase.map((word, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="text-corporate-500 font-mono text-xs font-bold w-4">{idx + 1}</span>
                            <span className="text-white font-medium tracking-wide">{word}</span>
                        </div>
                    ))}
                </div>

                <div className="flex w-full space-x-3">
                    <button onClick={handleCopySeed} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors flex justify-center items-center space-x-2">
                        <Copy size={16} />
                        <span>Copy</span>
                    </button>
                    <button onClick={handleProceedToVerify} className="flex-1 bg-accent-blue hover:bg-accent-blue-hover text-white py-3 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                        I saved them
                    </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: VERIFY */}
            {step === 'verify' && (
               <motion.form
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifySubmit}
                className="space-y-6 flex flex-col items-center w-full"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-accent-blue mb-2">
                    <ShieldCheck size={24} />
                </div>
                <div className="text-center w-full">
                    <h2 className="text-xl font-bold text-white mb-2">Verify Phrase</h2>
                    <p className="text-sm text-corporate-300 leading-relaxed">
                        To ensure you've saved the phrase, enter the words corresponding to these numbers.
                    </p>
                </div>

                <div className="space-y-4 w-full">
                    {verifyIndices.map((seedIdx, arrayIdx) => (
                         <div key={seedIdx} className="relative">
                            <span className="absolute left-4 top-3.5 text-corporate-400 font-mono text-xs font-bold w-6">
                                #{seedIdx + 1}
                            </span>
                            <input
                              type="text"
                              required
                              value={verifyInputs[arrayIdx]}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  const words = val.trim().toLowerCase().split(/\s+/).filter(Boolean);
                                  
                                  const newInputs = [...verifyInputs];
                                  if (words.length === 6) {
                                      // User pasted the whole seed phrase. Smart-fill!
                                      newInputs[0] = words[verifyIndices[0]];
                                      newInputs[1] = words[verifyIndices[1]];
                                  } else if (words.length > 0) {
                                      // Take only the first word to prevent accidental multi-word inputs
                                      newInputs[arrayIdx] = words[0];
                                  } else {
                                      newInputs[arrayIdx] = '';
                                  }
                                  setVerifyInputs(newInputs);
                              }}
                              placeholder="Type word here..."
                              className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white font-medium transition-all"
                            />
                         </div>
                    ))}
                </div>

                <button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3.5 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  Verify & Create Identity
                </button>

                {errorMsg && (
                  <div className="text-red-400 text-sm text-center mt-2 w-full bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                    {errorMsg}
                  </div>
                )}
                
                <button type="button" onClick={() => setStep('seed')} className="text-sm text-corporate-400 hover:text-white transition-colors">
                    Back to Seed Phrase
                </button>
               </motion.form>
            )}

            {/* STEP 4: GENERATING */}
            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-8 space-y-6 h-full"
              >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-white/10 border-t-accent-blue rounded-full"
                  />
                <div className="text-center space-y-2">
                    <p className="text-sm font-bold tracking-widest text-white uppercase">Deriving Keys</p>
                    <p className="text-xs text-corporate-400 font-mono">Running PBKDF2... Encrypting Enclave...</p>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 space-y-4 text-center h-full"
              >
                <CheckCircle2 className="text-green-400 h-16 w-16 mb-2" />
                <h2 className="text-xl font-bold text-white tracking-wide">Identity Secured</h2>
                <p className="text-sm font-medium text-corporate-300">
                  Your cryptographic keys are safely derived. Redirecting to Login...
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-corporate-500 font-medium tracking-wider uppercase flex items-center justify-center space-x-1">
             <KeyRound size={12} />
             <span>Zero-Knowledge Architecture</span>
          </p>
        </div>
      </div>
    </div>
  );
}
