import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, ShieldCheck, KeyRound, Server, FileKey2, FileOutput, Lock, Link as LinkIcon, Sparkles, Terminal, Moon, Palette, Cpu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function Workflow() {
   const { t, language } = useLanguage();
   const { theme } = useTheme();

   // Scroll to top on mount
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   const FlowArrow = () => (
      <div className="hidden lg:flex text-corporate-300 dark:text-slate-600 px-4">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
   );

   const FlowArrowMob = () => (
      <div className="lg:hidden flex justify-center text-corporate-300 dark:text-slate-600 py-3">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
      </div>
   );

   return (
      <div className="min-h-screen bg-[#eef2f7] dark:bg-[#020617] text-corporate-900 dark:text-white font-sans flex flex-col selection:bg-[#43cc25] selection:text-white transition-colors duration-300">
         
         {/* Navbar Minimalist */}
         <nav className="fixed w-full z-50 top-0 border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl transition-colors">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Link to="/" className="flex items-center space-x-3">
                     <img src={theme === 'dark' ? "/ten.light.png" : "/ten.lightmode.png"} alt="FORTISMail" className="h-[22px] object-contain" />
                  </Link>
                  <span className="hidden sm:inline-flex items-center bg-[#43cc25]/10 text-[#43cc25] border border-[#43cc25]/20 text-[10px] uppercase font-black px-2 py-1 rounded tracking-widest">
                     Workflow Matrix
                  </span>
               </div>
               
               <div className="flex items-center gap-6">
                  <Link to="/" className="text-sm font-bold text-corporate-600 dark:text-corporate-400 flex items-center hover:text-[#43cc25] dark:hover:text-[#43cc25] transition-colors">
                     <ArrowLeft className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">{language === 'vi' ? 'Trang chủ' : 'Back to Home'}</span>
                  </Link>
                  <div className="w-px h-5 bg-black/10 dark:bg-white/10"></div>
                  <Link to="/login" className="bg-[#111827] dark:bg-white text-white dark:text-[#020617] hover:bg-[#43cc25] dark:hover:bg-[#43cc25] dark:hover:text-white text-sm font-bold py-2 px-5 rounded-full transition-all">
                     {language === 'vi' ? 'Đăng Nhập' : 'Log In'}
                  </Link>
               </div>
            </div>
         </nav>

         {/* Hero Section */}
         <div className="relative pt-32 pb-16 px-4 shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-[0.05]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#43cc25]/10 dark:bg-[#43cc25]/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl mb-6 border border-black/5 dark:border-white/10">
                     <Sparkles className="w-8 h-8 text-[#43cc25]" />
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                     {t('workflow.title')}
                  </h1>
                  <p className="text-lg md:text-xl text-corporate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                     {t('workflow.subtitle')}
                  </p>
               </motion.div>
            </div>
         </div>

         {/* Main Content Areas */}
         <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 pb-32 space-y-24 relative z-10">

            {/* Workflow 1: Data Flow */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full">
               <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="text-center mb-12">
                     <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{t('workflow.s1.title')}</h2>
                     <p className="text-corporate-600 dark:text-slate-400 font-medium">{t('workflow.s1.desc')}</p>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <Lock className="w-10 h-10 mx-auto text-[#43cc25] mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s1.step1')}</h4>
                        <span className="text-xs font-bold bg-[#43cc25]/10 text-[#43cc25] px-3 py-1 rounded-full uppercase">Client Side</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center shadow-inner">
                        <FileKey2 className="w-10 h-10 mx-auto text-blue-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s1.step2')}</h4>
                        <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full uppercase">Transit</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <Server className="w-10 h-10 mx-auto text-orange-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s1.step3')}</h4>
                        <span className="text-xs font-bold bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full uppercase">Backend</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-slate-900 border border-slate-700 text-white p-6 rounded-3xl w-full lg:w-64 text-center shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/matrix.gif')] opacity-10 mix-blend-overlay"></div>
                        <Database className="w-10 h-10 mx-auto mb-4 text-purple-400 relative z-10" />
                        <h4 className="font-bold text-lg mb-2 relative z-10">{t('workflow.s1.step4')}</h4>
                        <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full uppercase relative z-10">Firestore</span>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Workflow 2: Cryptography */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full">
               <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="text-center mb-12">
                     <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{t('workflow.s2.title')}</h2>
                     <p className="text-corporate-600 dark:text-slate-400 font-medium">{t('workflow.s2.desc')}</p>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <FileOutput className="w-10 h-10 mx-auto text-slate-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s2.step1')}</h4>
                        <span className="text-xs font-bold bg-slate-500/10 text-slate-500 px-3 py-1 rounded-full uppercase text-slate-800 dark:text-slate-300">Plaintext</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <KeyRound className="w-10 h-10 mx-auto text-[#43cc25] mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s2.step2')}</h4>
                        <span className="text-xs font-bold bg-[#43cc25]/10 text-[#43cc25] px-3 py-1 rounded-full uppercase">AES-256-GCM</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <ShieldCheck className="w-10 h-10 mx-auto text-blue-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s2.step3')}</h4>
                        <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full uppercase">P-256 / PBKDF2</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center shadow-inner">
                        <FileKey2 className="w-10 h-10 mx-auto text-pink-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s2.step4')}</h4>
                        <span className="text-xs font-bold bg-pink-500/10 text-pink-500 px-3 py-1 rounded-full uppercase">Armored Blob</span>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Workflow 3: Attachments */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full">
               <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="text-center mb-12">
                     <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{t('workflow.s3.title')}</h2>
                     <p className="text-corporate-600 dark:text-slate-400 font-medium">{t('workflow.s3.desc')}</p>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <FileOutput className="w-10 h-10 mx-auto text-orange-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s3.step1')}</h4>
                        <span className="text-xs font-bold bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full uppercase">+1MB Limits</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <KeyRound className="w-10 h-10 mx-auto text-[#43cc25] mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s3.step2')}</h4>
                        <span className="text-xs font-bold bg-[#43cc25]/10 text-[#43cc25] px-3 py-1 rounded-full uppercase">Device RAM</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <Database className="w-10 h-10 mx-auto text-blue-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s3.step3')}</h4>
                        <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full uppercase">Google Cloud</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center shadow-inner">
                        <LinkIcon className="w-10 h-10 mx-auto text-pink-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s3.step4')}</h4>
                        <span className="text-xs font-bold bg-pink-500/10 text-pink-500 px-3 py-1 rounded-full uppercase">Envelope Hash</span>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Workflow 4: UX */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full">
               <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="text-center mb-12">
                     <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{t('workflow.s4.title')}</h2>
                     <p className="text-corporate-600 dark:text-slate-400 font-medium">{t('workflow.s4.desc')}</p>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                     <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl w-full lg:w-64 border border-red-200 dark:border-red-900/50 text-center">
                        <Lock className="w-10 h-10 mx-auto text-red-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s4.step1')}</h4>
                        <span className="text-xs font-bold bg-red-500/10 text-red-500 px-3 py-1 rounded-full uppercase">No LocalStorage</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <KeyRound className="w-10 h-10 mx-auto text-blue-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s4.step2')}</h4>
                        <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full uppercase">Fast Unlock</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-3xl w-full lg:w-64 border border-slate-200 dark:border-slate-800 text-center">
                        <Sparkles className="w-10 h-10 mx-auto text-amber-500 mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s4.step3')}</h4>
                        <span className="text-xs font-bold bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full uppercase">Typing Delay</span>
                     </div>
                     <FlowArrowMob /><FlowArrow />
                     <div className="bg-[#43cc25]/10 p-6 rounded-3xl w-full lg:w-64 border border-[#43cc25]/20 text-center shadow-inner">
                        <Database className="w-10 h-10 mx-auto text-[#43cc25] mb-4" />
                        <h4 className="font-bold text-lg mb-2">{t('workflow.s4.step4')}</h4>
                        <span className="text-xs font-bold bg-[#43cc25]/20 text-green-700 dark:text-[#43cc25] px-3 py-1 rounded-full uppercase">Cost Save</span>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Workflow 5: Vibe Coding */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full">
               <div className="bg-gradient-to-br from-[#111827] to-[#020617] dark:from-[#0f172a] dark:to-[#020617] text-white rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                     <Terminal className="w-64 h-64 text-[#43cc25]" />
                  </div>
                  
                  <div className="text-center mb-12 relative z-10">
                     <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/10">
                        <Moon className="w-6 h-6 text-[#43cc25]" />
                     </div>
                     <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-white">{t('workflow.vibe.title')}</h2>
                     <p className="text-slate-400 font-medium max-w-2xl mx-auto">{t('workflow.vibe.desc')}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 relative z-10">
                     <div className="bg-white/5 hover:bg-white/10 transition-colors p-8 rounded-3xl border border-white/10">
                        <Lock className="w-8 h-8 text-red-400 mb-4" />
                        <h4 className="font-bold text-lg mb-2 text-white">{t('workflow.vibe.card1.title')}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{t('workflow.vibe.card1.desc')}</p>
                     </div>
                     <div className="bg-white/5 hover:bg-white/10 transition-colors p-8 rounded-3xl border border-white/10">
                        <Terminal className="w-8 h-8 text-[#43cc25] mb-4" />
                        <h4 className="font-bold text-lg mb-2 text-white">{t('workflow.vibe.card2.title')}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{t('workflow.vibe.card2.desc')}</p>
                     </div>
                     <div className="bg-white/5 hover:bg-white/10 transition-colors p-8 rounded-3xl border border-white/10">
                        <Palette className="w-8 h-8 text-purple-400 mb-4" />
                        <h4 className="font-bold text-lg mb-2 text-white">{t('workflow.vibe.card3.title')}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{t('workflow.vibe.card3.desc')}</p>
                     </div>
                     <div className="bg-white/5 hover:bg-white/10 transition-colors p-8 rounded-3xl border border-white/10">
                        <Cpu className="w-8 h-8 text-blue-400 mb-4" />
                        <h4 className="font-bold text-lg mb-2 text-white">{t('workflow.vibe.card4.title')}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{t('workflow.vibe.card4.desc')}</p>
                     </div>
                  </div>
               </div>
            </motion.div>

         </div>
      </div>
   );
}
