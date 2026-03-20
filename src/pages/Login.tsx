import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

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
      setErrorMsg(err.message || 'Authentication failed. Incorrect Username or Password.');
      setStatus('idle');
    }
  };

  return (
    <div className="flex min-h-screen bg-corporate-900 text-white relative overflow-hidden flex-col items-center justify-center p-6">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent-blue blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400 blur-[150px] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="FortisMail" className="h-[80px] object-contain mb-2" />
          <h1 className="text-3xl font-bold tracking-tight mt-6">Welcome to Fortis Mail!</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identityId}
                      onChange={(e) => setIdentityId(e.target.value)}
                      placeholder="Username (e.g. john_doe)"
                      className="peer w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium transition-all"
                    />
                    <UserIcon className="absolute left-3 top-3.5 text-corporate-300 peer-autofill:text-corporate-900 pointer-events-none transition-colors" size={18} />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Master Password"
                      className="peer w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium tracking-widest transition-all"
                    />
                    <Lock className="absolute left-3 top-3.5 text-corporate-300 peer-autofill:text-corporate-900 pointer-events-none transition-colors" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-corporate-400 hover:text-white transition-colors peer-autofill:text-corporate-900 peer-autofill:hover:text-corporate-900"
                      tabIndex={-1}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3.5 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-2">
                  <span>Login to Fortis Mail</span>
                  <ArrowRight size={18} />
                </button>


                {errorMsg && (
                  <div className="text-red-400 text-sm text-center mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                    {errorMsg}
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/register" className="text-sm text-corporate-300 hover:text-white transition-colors">
                    Don't have an account? <span className="font-bold text-white">Create account</span>
                  </Link>
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
                  <p className="text-sm font-bold tracking-widest text-white uppercase">Deriving Keys</p>
                  <p className="text-xs text-corporate-400 font-mono">Running PBKDF2... Decrypting Enclave...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
