import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { t } = useLanguage();

  const [identityId, setIdentityId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating'>('idle');

  useEffect(() => {
    if (user && user.privateKey) {
      if (status === 'authenticating' || status === 'idle') {
        navigate('/inbox', { replace: true });
      }
    }
  }, [user, navigate, status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identityId || !password) return;

    setStatus('authenticating');
    setErrorMsg('');

    try {
      await login(identityId, password);
      // Wait for useEffect to navigate once user state propagates
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || t('login.errorInvalid'));
      setStatus('idle');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eef2f7] dark:bg-[#020617] text-corporate-900 dark:text-white relative overflow-hidden flex-col items-center justify-center p-6 transition-colors duration-300">
      <LanguageSwitcher />
      <div className="relative z-10 w-full max-w-md">
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

        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/20 shadow-2xl min-h-[400px] flex flex-col justify-center transition-colors duration-300">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-5 pt-5"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identityId}
                      onChange={(e) => setIdentityId(e.target.value)}
                      placeholder={t('common.usernamePlaceholder')}
                      className="peer w-full bg-white dark:bg-[#020617]/20 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-corporate-900 dark:text-white placeholder:text-corporate-500 dark:placeholder:text-corporate-400 font-medium transition-all"
                    />
                    <UserIcon className="absolute left-3 top-3.5 text-corporate-400 dark:text-corporate-300 peer-autofill:text-corporate-900 pointer-events-none transition-colors" size={18} />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('common.passwordPlaceholder')}
                      className="peer w-full bg-white dark:bg-[#020617]/20 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-corporate-900 dark:text-white placeholder:text-corporate-500 dark:placeholder:text-corporate-400 font-medium tracking-widest transition-all"
                    />
                    <Lock className="absolute left-3 top-3.5 text-corporate-400 dark:text-corporate-300 peer-autofill:text-corporate-900 pointer-events-none transition-colors" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-corporate-500 dark:text-corporate-400 hover:text-corporate-900 dark:hover:text-white transition-colors peer-autofill:text-corporate-900 peer-autofill:hover:text-corporate-900"
                      tabIndex={-1}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[linear-gradient(360deg,#226214,#43cc25)] hover:brightness-110 text-white py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>{t('login.loginBtn')}</span>
                  <ArrowRight size={18} />
                </button>


                {errorMsg && (
                  <div className="text-red-400 text-sm text-center mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                    {errorMsg}
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/register" className="text-sm text-corporate-600 dark:text-corporate-300 hover:text-corporate-900 dark:hover:text-white transition-colors">
                    {t('login.noAccount')} <span className="font-bold text-corporate-900 dark:text-white">{t('login.createOne')}</span>
                  </Link>
                </div>

                <div className="pt-3 pb-0 flex justify-center items-center opacity-90 hover:opacity-100 transition-opacity mt-2">
                  <img src="/logo.png" alt="Fortis Shield" className="h-[75px] object-contain drop-shadow-[0_0_15px_rgba(67,204,37,0.3)]" />
                </div>
              </motion.form>
            )}

            {status === 'authenticating' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-8 space-y-6"
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
            )}          </AnimatePresence>
        </div>

        <div className="mt-8 text-center text-[13px] text-corporate-600 dark:text-corporate-300">
          <span className="font-bold text-corporate-900 dark:text-white">FORTISMail:</span> {t('common.tagline')}
        </div>
      </div>
    </div>
  );
}
