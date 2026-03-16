import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Fingerprint, Mail, Lock, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'generatingKeys'>('idle');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    setStatus('authenticating');
    
    // Simulate authenticating
    setTimeout(() => {
       setStatus('generatingKeys');
    }, 1000);

    await register(email, password, name);
    navigate('/inbox'); // go directly to inbox
  };

  return (
    <div className="flex min-h-screen bg-corporate-900 text-white relative overflow-hidden flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent-blue blur-[120px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400 blur-[150px] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10 space-y-4">
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
              <Shield size={32} className="text-accent-blue" />
           </div>
           <h1 className="text-3xl font-bold tracking-tight">Create Identity</h1>
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
                    <p className="text-xs text-corporate-400 leading-relaxed text-center">
                       Keep your Master Password safe. It is used to generate your private key and cannot be recovered if lost.
                    </p>
                  </div>

                  <button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3 rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    Generate Keys & Register
                  </button>
                  
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

             {status === 'generatingKeys' && (
                <motion.div 
                   key="keys"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex flex-col items-center justify-center py-8 space-y-4"
                >
                   <div className="relative">
                      <motion.div 
                         animate={{ rotate: 360 }} 
                         transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                         className="w-16 h-16 border-2 border-dashed border-accent-blue rounded-full"
                      />
                      <Key className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" size={24} />
                   </div>
                   <p className="text-sm font-medium tracking-widest text-corporate-300 uppercase">Deriving Encryption Keys...</p>
                   <p className="text-xs text-corporate-400 font-mono text-center max-w-[200px]">Generating RSA-4096 pair from your Master Password phase.</p>
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
