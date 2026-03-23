import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateECCSignKeyPair, generateECCEncryptKeyPair, exportPublicKey, exportPrivateKey } from '../utils/cryptoAuth';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<'setup' | 'generating' | 'success'>('setup');

  // Form State
  const [identityId, setIdentityId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // Validation Logic
  const isUsernameLengthValid = identityId.length >= 4;
  const isUsernameNumberValid = /[0-9]/.test(identityId);
  const isUsernameValid = isUsernameLengthValid && isUsernameNumberValid;

  const isPasswordLengthValid = password.length >= 8;
  const isPasswordNumberValid = /[0-9]/.test(password);
  const isPasswordUppercaseValid = /[A-Z]/.test(password);
  const isPasswordSpecialValid = /[^a-zA-Z0-9]/.test(password);
  const isPasswordValid = isPasswordLengthValid && isPasswordNumberValid && isPasswordUppercaseValid && isPasswordSpecialValid;

  const isFormValid = isUsernameValid && isPasswordValid;

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setErrorMsg('');
    setStep('generating');

    try {
      const signKeyPair = await generateECCSignKeyPair();
      const encryptKeyPair = await generateECCEncryptKeyPair();

      const signPubKey = await exportPublicKey(signKeyPair.publicKey, 'SIGN');
      const signPrivKey = await exportPrivateKey(signKeyPair.privateKey, 'SIGN');
      const encryptPubKey = await exportPublicKey(encryptKeyPair.publicKey, 'ENCRYPT');
      const encryptPrivKey = await exportPrivateKey(encryptKeyPair.privateKey, 'ENCRYPT');

      const identityBlock = `${signPubKey}\n${encryptPubKey}`;
      const privateKeyBlock = `${signPrivKey}\n${encryptPrivKey}`;

      await register(identityId, password, identityId, identityBlock, privateKeyBlock);

      setStep('success');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);
    } catch (err: any) {
      console.error("DEBUG: Registration failed", err);
      setErrorMsg(err.message || t('register.errorExists'));
      setStep('setup');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eef2f7] dark:bg-[#020617] text-corporate-900 dark:text-white relative overflow-hidden flex-col items-center justify-center p-6 transition-colors duration-300">
      <LanguageSwitcher />
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img src="/hub.png" alt="HUB Logo" className="h-[55px] object-contain" />
            <img src="/ds.png" alt="Data Science Logo" className="h-[55px] object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2.5 mt-6 w-full">
            <h1 className="text-3xl font-bold font-['Inter'] tracking-tight whitespace-nowrap pb-1">{t('common.welcomeTo')}</h1>
            <img src="/ten.light.png" alt="FORTISMail" className="h-[22px] object-contain hidden dark:block" />
            <img src="/ten.lightmode.png" alt="FORTISMail" className="h-[22px] object-contain block dark:hidden" />
          </div>
        </div>

        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/20 shadow-2xl min-h-[450px] flex flex-col justify-center transition-colors duration-300">
          <AnimatePresence mode="wait">

            {/* STEP 1: SETUP */}
            {step === 'setup' && (
              <motion.form
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSetupSubmit}
                className="space-y-6 pt-5"
              >
                <div className="space-y-5">
                  <div className="relative space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identityId}
                        onChange={(e) => setIdentityId(e.target.value)}
                        placeholder={t('common.usernamePlaceholder')}
                        className="peer w-full bg-white dark:bg-[#020617]/20 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-corporate-900 dark:text-white placeholder:text-corporate-500 dark:placeholder:text-corporate-400 font-medium transition-all"
                      />
                      <UserIcon className="absolute left-3 top-3.5 text-corporate-400 dark:text-corporate-300 peer-autofill:text-corporate-900 pointer-events-none transition-colors" size={18} />
                      {isUsernameValid && (
                        <CheckCircle2 className="absolute right-3 top-3.5 text-green-500" size={18} />
                      )}
                    </div>
                    {/* Username Criteria */}
                    <AnimatePresence>
                      {!isUsernameValid && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="px-1 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={12} className={isUsernameLengthValid ? "text-green-500" : "text-corporate-500 dark:text-corporate-400"} />
                              <span className={isUsernameLengthValid ? "text-corporate-900 dark:text-corporate-200" : "text-corporate-500 dark:text-corporate-400"}>{t('validation.fourChars')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={12} className={isUsernameNumberValid ? "text-green-500" : "text-corporate-500 dark:text-corporate-400"} />
                              <span className={isUsernameNumberValid ? "text-corporate-900 dark:text-corporate-200" : "text-corporate-500 dark:text-corporate-400"}>{t('validation.oneNumber')}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative space-y-2">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('common.passwordPlaceholder')}
                        className="peer w-full bg-white dark:bg-[#020617]/20 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-16 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-corporate-900 dark:text-white placeholder:text-corporate-500 dark:placeholder:text-corporate-400 font-medium tracking-widest transition-all"
                      />
                      <Lock className="absolute left-3 top-3.5 text-corporate-400 dark:text-corporate-300 peer-autofill:text-corporate-900 pointer-events-none transition-colors" size={18} />
                      {isPasswordValid && (
                        <CheckCircle2 className="absolute right-3 top-3.5 text-green-500" size={18} />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-10 top-3.5 text-corporate-500 dark:text-corporate-400 hover:text-corporate-900 dark:hover:text-white transition-colors peer-autofill:text-corporate-900 peer-autofill:hover:text-corporate-900"
                        tabIndex={-1}
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {/* Password Criteria */}
                    <AnimatePresence>
                      {!isPasswordValid && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="px-1 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={12} className={isPasswordLengthValid ? "text-green-500" : "text-corporate-500 dark:text-corporate-400"} />
                              <span className={isPasswordLengthValid ? "text-corporate-900 dark:text-corporate-200" : "text-corporate-500 dark:text-corporate-400"}>{t('validation.eightChars')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={12} className={isPasswordNumberValid ? "text-green-500" : "text-corporate-500 dark:text-corporate-400"} />
                              <span className={isPasswordNumberValid ? "text-corporate-900 dark:text-corporate-200" : "text-corporate-500 dark:text-corporate-400"}>{t('validation.oneNumber')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={12} className={isPasswordUppercaseValid ? "text-green-500" : "text-corporate-500 dark:text-corporate-400"} />
                              <span className={isPasswordUppercaseValid ? "text-corporate-900 dark:text-corporate-200" : "text-corporate-500 dark:text-corporate-400"}>{t('validation.oneUppercase')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 size={12} className={isPasswordSpecialValid ? "text-green-500" : "text-corporate-500 dark:text-corporate-400"} />
                              <span className={isPasswordSpecialValid ? "text-corporate-900 dark:text-corporate-200" : "text-corporate-500 dark:text-corporate-400"}>{t('validation.oneSymbol')}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!isFormValid}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${isFormValid ? 'bg-[linear-gradient(360deg,#226214,#43cc25)] hover:brightness-110 text-white cursor-pointer' : 'bg-black/5 dark:bg-white/5 text-corporate-500 dark:text-corporate-400 cursor-not-allowed opacity-70'}`}
                >
                  <span>{t('common.continue')}</span>
                  <ArrowRight size={18} />
                </button>

                {errorMsg && (
                  <div className="text-red-400 text-sm text-center mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                    {errorMsg}
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-corporate-600 dark:text-corporate-300 hover:text-corporate-900 dark:hover:text-white transition-colors">
                    {t('register.alreadyHaveAccount')} <span className="font-bold text-corporate-900 dark:text-white">{t('register.loginHere')}</span>
                  </Link>
                </div>

                <div className="pt-3 pb-0 flex justify-center items-center opacity-90 hover:opacity-100 transition-opacity mt-2">
                  <img src="/logo.png" alt="Fortis Shield" className="h-[75px] object-contain drop-shadow-[0_0_15px_rgba(67,204,37,0.3)]" />
                </div>
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
                  <p className="text-sm font-bold tracking-widest text-corporate-900 dark:text-white uppercase">{t('login.derivingKeys')}</p>
                  <p className="text-xs text-corporate-600 dark:text-corporate-400 font-mono">{t('login.runningPBKDF2')}</p>
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
                <h2 className="text-xl font-bold text-corporate-900 dark:text-white tracking-wide">{t('register.identitySecured')}</h2>
                <p className="text-sm font-medium text-corporate-600 dark:text-corporate-300">
                  {t('register.redirecting')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center text-[13px] text-corporate-600 dark:text-corporate-300">
          <span className="font-bold text-corporate-900 dark:text-white">FORTISMail:</span> {t('common.tagline')}
        </div>
      </div>
    </div>
  );
}
