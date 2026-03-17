import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating'>('idle');

  // If user is already authenticated (e.g. state loaded or just signed in), redirect immediately
  useEffect(() => {
    if (user) {
      if (status === 'authenticating' || status === 'idle') {
         navigate('/inbox', { replace: true });
      }
    }
  }, [user, navigate, status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setStatus('authenticating');
    setErrorMsg('');
    
    try {
      await login(email, password);
      navigate('/inbox', { replace: true });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication failed');
      setStatus('idle');
    }
  };

  const handleGoogleLogin = async () => {
    setStatus('authenticating');
    setErrorMsg('');
    try {
      await loginWithGoogle();
      navigate('/inbox', { replace: true });
    } catch (err: any) {
      console.error("DEBUG: Google Sign-in failed", err);
      
      if (err.message && (err.message.includes('popup-closed-by-user') || err.message.includes('auth/cancelled-popup-request') || err.message.includes('COOP'))) {
         setErrorMsg("Đang đồng bộ với Google... Vui lòng đợi hoặc làm mới trang.");
         // Do not reset status to idle immediately, wait to see if useEffect catches the user object
         setTimeout(() => {
            if (status === 'authenticating') {
               setStatus('idle');
            }
         }, 5000);
      } else {
         setErrorMsg(err.message || 'Google Sign-in failed');
         setStatus('idle');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-corporate-900 text-white relative overflow-hidden flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent-blue blur-[120px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400 blur-[150px] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 space-y-4 flex flex-col items-center">
           <img src="/logo.png" alt="FortisMail" className="h-[120px] object-contain mb-4" />
           <p className="text-corporate-300 text-sm font-medium">Enterprise End-to-End Encrypted Communications.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <AnimatePresence mode="wait">
             {status === 'idle' && (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleLogin} 
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-corporate-300" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Corporate Email" 
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium transition-all" 
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-corporate-300" size={18} />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Master Password" 
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium tracking-widest transition-all" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    Authenticate
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-[#0B1120] text-corporate-400">OR</span>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleGoogleLogin} 
                    className="w-full bg-white text-gray-900 py-3 rounded-xl font-medium transition-all hover:bg-gray-100 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  {errorMsg && (
                    <div className="text-red-400 text-sm text-center mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                      {errorMsg}
                    </div>
                  )}
                  
                  <div className="text-center mt-4">
                     <Link to="/register" className="text-sm text-corporate-300 hover:text-white transition-colors">
                        Don't have an identity? Create one
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
                   className="flex flex-col items-center justify-center py-8 space-y-4"
                >
                   <Fingerprint className="text-accent-blue h-12 w-12 animate-pulse" />
                   <p className="text-sm font-medium tracking-widest text-corporate-300 uppercase">Verifying Credentials...</p>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-xs text-corporate-500 font-medium tracking-wider uppercase">Powered by FortisMail Security Core</p>
        </div>
      </div>
    </div>
  );
}
