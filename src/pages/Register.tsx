import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, Mail, Lock, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const { register, registerWithGoogle, logout, user } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'success'>('idle');

  // If user is already authenticated (e.g. from existing session), redirect
  useEffect(() => {
    // Only redirect automatically if they are just visiting the page (not in the middle of a registration flow)
    // OR if we hit a snag with the popup closing but they actually got authenticated
    if (user && status !== 'success') {
      // If we are stuck in 'authenticating' but the user object appeared, it means the popup worked but promise failed
      if (status === 'authenticating') {
         setStatus('success');
         // Let the user see success message for a moment, then redirect to inbox because they are actually logged in
         setTimeout(() => navigate('/inbox', { replace: true }), 2000);
      } else if (status === 'idle') {
         navigate('/inbox', { replace: true });
      }
    }
  }, [user, navigate, status]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please try again.");
      return;
    }

    setStatus('authenticating');
    setErrorMsg('');
    
    try {
      await register(email, password, name);
      setStatus('success');
      setTimeout(async () => {
        await logout();
        navigate('/login', { replace: true });
      }, 2000); // give time to read the success msg
    } catch (err: any) {
      console.error("DEBUG: Form Registration failed", err);
      setErrorMsg(err.message || 'Registration failed');
      setStatus('idle');
    }
  };

  const handleGoogleRegister = async () => {
    setStatus('authenticating');
    setErrorMsg('');
    try {
      const isNewUser = await registerWithGoogle();
      if (isNewUser) {
         setStatus('success');
         setTimeout(async () => {
           await logout();
           navigate('/login', { replace: true });
         }, 2000);
      } else {
         // User already exists
         await logout();
         setErrorMsg('Tài khoản đã tồn tại. Vui lòng đăng nhập.');
         setStatus('idle');
         // We could optionally just navigate to login immediately, but showing an error is clearer.
      }
    } catch (err: any) {
      console.error("DEBUG: Google Registration failed", err);
      
      // If it's the COOP blocked window error or popup closed, the user object might still update in the background.
      // We don't reset status immediately if it's the COOP error, letting the useEffect above catch it.
      if (err.message && (err.message.includes('popup-closed-by-user') || err.message.includes('auth/cancelled-popup-request') || err.message.includes('COOP'))) {
         setErrorMsg("Đang đồng bộ với Google... Vui lòng đợi hoặc làm mới trang.");
         // Do not reset status to idle immediately, wait to see if useEffect catches the user object
         setTimeout(() => {
            if (status === 'authenticating') {
               setStatus('idle');
            }
         }, 5000);
      } else {
         setErrorMsg(err.message || 'Google Sign-up failed');
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
           <img src="/logo.png" alt="FortisMail" className="h-[100px] object-contain mb-2" />
           <h1 className="text-2xl font-bold tracking-tight">Create Identity</h1>
           <p className="text-corporate-300 text-sm font-medium">Generate your encrypted FortisMail account.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <AnimatePresence mode="wait">
             {status === 'idle' && (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleRegister} 
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 text-corporate-300" size={18} />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name" 
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium transition-all" 
                      />
                    </div>
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-corporate-300" size={18} />
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Master Password" 
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue text-white placeholder:text-corporate-400 font-medium tracking-widest transition-all" 
                      />
                    </div>
                    <p className="text-xs text-corporate-400 leading-relaxed text-center">
                       Keep your Master Password safe. It is used to generate your private key and cannot be recovered if lost.
                    </p>
                  </div>

                  <button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    Generate Keys & Register
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
                    onClick={handleGoogleRegister} 
                    className="w-full bg-white text-gray-900 py-3 rounded-xl font-medium transition-all hover:bg-gray-100 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Sign up with Google</span>
                  </button>

                  {errorMsg && (
                    <div className="text-red-400 text-sm text-center mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                      {errorMsg}
                    </div>
                  )}
                  
                  <div className="text-center mt-4">
                     <Link to="/login" className="text-sm text-corporate-300 hover:text-white transition-colors">
                        Already have an identity? Login
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
                   <p className="text-sm font-medium tracking-widest text-corporate-300 uppercase">Verifying Availability...</p>
                </motion.div>
             )}

             {status === 'success' && (
                <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center justify-center py-8 space-y-4 text-center"
                >
                   <CheckCircle2 className="text-green-400 h-16 w-16 mb-2" />
                   <h2 className="text-xl font-bold text-white tracking-wide">Account Created!</h2>
                   <p className="text-sm font-medium text-corporate-300">
                     Your identity has been secured. <br/> Redirecting to login...
                   </p>
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
