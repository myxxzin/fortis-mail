import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ShieldCheck, Globe, Lock, Cpu, KeyRound, Mail, Send, Sun, Moon, AlertTriangle, GraduationCap, Eye, Facebook, Linkedin, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Landing() {
   const { t, language, setLanguage } = useLanguage();
   const { theme, toggleTheme } = useTheme();
   const [selectedMember, setSelectedMember] = useState<any>(null);

   const teamMembers = [
     { 
       name: t('landing.team.member1'), 
       role: t('landing.team.role1'), 
       img: '/dat.jpg', 
       initial: 'VĐ',
       mssv: '030239230291',
       contact: {
         linkedin: 'https://www.linkedin.com/in/nguyenthimyvien/',
         email: 'mailto:nguyenvien.work@gmail.com'
       }
     },
     { 
       name: t('landing.team.member2'), 
       role: t('landing.team.role2'), 
       img: '/huy.jpg', 
       initial: 'ĐH',
       mssv: '030239230249',
       contact: {
         linkedin: 'https://www.linkedin.com/in/tr%C3%A0-l%C3%AA-108568332/',
         email: 'mailto:bichtrapy20@gmail.com'
       }
     },
     { 
       name: t('landing.team.member3'), 
       role: t('landing.team.role3'), 
       img: '/quan.jpg', 
       initial: 'PQ',
       mssv: '030239230133',
       contact: {
         linkedin: 'https://www.linkedin.com/in/nga-van-b84675315/',
         email: 'mailto:ngavan2208@gmail.com'
       }
     },
     { 
       name: t('landing.team.member4'), 
       role: t('landing.team.role4'), 
       img: '/quy.jpg', 
       initial: 'HQ',
       mssv: '030239230204',
       contact: {
         linkedin: 'https://www.linkedin.com/in/quynh-nguyen-thi-diem-8989963b9',
         email: 'mailto:quynhnguyen.06042000@gmail.com'
       }
     },
     { 
       name: t('landing.team.member5'), 
       role: t('landing.team.role5'), 
       img: '/member5.jpg', 
       initial: 'M5',
       mssv: '030239230146',
       contact: {
         linkedin: 'https://www.linkedin.com/in/harrison1502/',
         email: 'mailto:vohieunghia1502@gmail.com'
       }
     },
     { 
       name: t('landing.team.member6'), 
       role: t('landing.team.role6'), 
       img: '/member6.jpg', 
       initial: 'M6',
       mssv: '030239230075',
       contact: {
         linkedin: 'https://www.linkedin.com/in/voquanghuy/',
         email: 'mailto:huyvo.300605@gmail.com'
       }
     },
   ];

   const containerVariant: Variants = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const itemVariant: Variants = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
   };

   return (
      <div className="min-h-screen bg-[#eef2f7] dark:bg-[#020617] text-corporate-900 dark:text-white selection:bg-[#43cc25] selection:text-white font-sans overflow-x-hidden transition-colors duration-300 relative">
         
         {/* --- Fixed Navigation --- */}
         <nav className="fixed w-full z-50 top-0 border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#020617]/70 backdrop-blur-xl transition-colors">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
               
               {/* Logo Area */}
               <div className="flex flex-1 items-center justify-start">
                  <Link to="/" className="flex items-center space-x-3">
                     <img src={theme === 'dark' ? "/ten.light.png" : "/ten.lightmode.png"} alt="FORTISMail" className="h-[24px] object-contain" />
                  </Link>
               </div>
               
               {/* Center Nav Links */}
               <div className="hidden lg:flex flex-none items-center space-x-8">
                  {[
                     { key: 'demo', href: '#demo' },
                     { key: 'features', href: '#features' },
                     { key: 'how', href: '#how-it-works' },
                     { key: 'limitations', href: '#limitations' },
                     { key: 'team', href: '#team' },
                     { key: 'workflow', href: '/workflow' }
                  ].map((item) => (
                     item.href.startsWith('/') ? (
                        <Link key={item.key} to={item.href} className="text-sm font-bold text-corporate-800 dark:text-corporate-200 hover:text-[#43cc25] dark:hover:text-[#43cc25] transition-colors">
                           {t(`landing.nav.${item.key}`)}
                        </Link>
                     ) : (
                        <a key={item.key} href={item.href} className="text-sm font-bold text-corporate-800 dark:text-corporate-200 hover:text-[#43cc25] dark:hover:text-[#43cc25] transition-colors">
                           {t(`landing.nav.${item.key}`)}
                        </a>
                     )
                  ))}
                  <Link to="/docs" className="text-sm font-bold text-[#43cc25] dark:text-[#43cc25] hover:brightness-110 transition-colors">
                     {t('landing.nav.docs')}
                  </Link>
               </div>

               {/* Nav Controls */}
               <div className="flex flex-1 items-center justify-end space-x-3 md:space-x-4">
                  
                  {/* Unified Language & Theme Toggles (matching Login/Home exactly) */}
                  <div className="flex items-center gap-3 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 px-4 py-2 rounded-full shadow-sm transition-all hover:bg-white/80 dark:hover:bg-white/10">
                     {/* Theme Toggle */}
                     <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center text-corporate-500 dark:text-corporate-300 hover:text-corporate-900 dark:hover:text-white transition-colors"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                     >
                        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                     </button>
                     
                     <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 transition-colors"></div>
                     
                     {/* Language */}
                     <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider">
                        <Globe size={16} className="text-corporate-500 dark:text-corporate-300 mr-1 transition-colors" />
                        <button
                           onClick={() => setLanguage('vi')}
                           className={`${language === 'vi' ? 'text-corporate-900 dark:text-white opacity-100' : 'text-corporate-900 dark:text-white opacity-25 hover:opacity-100'} transition-all`}
                        >
                           VI
                        </button>
                        <span className="text-corporate-300 dark:text-corporate-600 transition-colors opacity-50">|</span>
                        <button
                           onClick={() => setLanguage('en')}
                           className={`${language === 'en' ? 'text-corporate-900 dark:text-white opacity-100' : 'text-corporate-900 dark:text-white opacity-25 hover:opacity-100'} transition-all`}
                        >
                           EN
                        </button>
                     </div>
                  </div>

                  <Link to="/login" className="text-sm font-semibold bg-[linear-gradient(360deg,#226214,#43cc25)] text-white px-5 py-2.5 rounded-full hover:brightness-110 transition-all shadow-[0_4px_14px_0_rgba(67,204,37,0.39)] flex items-center">
                     Open App
                  </Link>
               </div>
            </div>
         </nav>

         {/* --- Main Content --- */}
         <main className="pt-28 pb-24 px-4 w-full flex flex-col items-center">
            
            {/* 1. Hero Section */}
            <motion.div 
               id="demo"
               variants={containerVariant} 
               initial="hidden" 
               animate="show" 
               className="w-full max-w-5xl mx-auto mb-32 scroll-mt-32"
            >
               <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-16 border border-black/5 dark:border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Decorative Elements inside Hero */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#43cc25]/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none" />

                  <motion.div variants={itemVariant} className="flex justify-center items-center gap-4 mb-8">
                     <img src="/hub.png" alt="HUB Logo" className="h-[45px] object-contain opacity-80 mix-blend-multiply dark:mix-blend-normal" />
                     <img src="/ds.png" alt="Data Science Logo" className="h-[45px] object-contain opacity-80 mix-blend-multiply dark:mix-blend-normal" />
                  </motion.div>

                  <motion.div variants={itemVariant} className="inline-flex items-center space-x-2 bg-white dark:bg-white/10 border border-corporate-200 dark:border-white/10 px-4 py-1.5 rounded-full shadow-sm mb-6">
                     <Lock className="w-4 h-4 text-[#43cc25]" />
                     <span className="text-xs font-bold uppercase tracking-wider text-corporate-700 dark:text-corporate-300">
                        {t('landing.hero.badge')}
                     </span>
                  </motion.div>

                  <motion.h1 
                     variants={itemVariant} 
                     className="text-5xl md:text-7xl font-extrabold text-corporate-900 dark:text-white leading-[1.1] tracking-tight max-w-3xl whitespace-pre-line mb-6"
                  >
                     {t('landing.hero.title')}
                  </motion.h1>

                  <motion.p 
                     variants={itemVariant} 
                     className="text-lg md:text-xl text-corporate-600 dark:text-corporate-300 max-w-2xl font-medium leading-relaxed mb-10"
                  >
                     {t('landing.hero.subtitle')}
                  </motion.p>

                  <motion.div variants={itemVariant} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                     <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[linear-gradient(360deg,#226214,#43cc25)] hover:brightness-110 text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(67,204,37,0.39)] transition-all flex items-center justify-center">
                        {t('landing.hero.cta')} <ShieldCheck className="ml-2 w-5 h-5" />
                     </Link>
                     <a href="#what-is-it" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-corporate-800 dark:text-white rounded-xl font-bold hover:bg-corporate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center">
                        {t('landing.hero.explore')}
                     </a>
                  </motion.div>
               </div>
            </motion.div>

            {/* 2. Features */}
            <div id="features" className="w-full max-w-7xl mx-auto mb-32 scroll-mt-24">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-4">
                     {t('landing.features.title')}
                  </h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-[#43cc25]/10 text-[#43cc25] rounded-xl flex items-center justify-center mb-6">
                        <Lock size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.features.f1.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">{t('landing.features.f1.desc')}</p>
                  </div>
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-6">
                        <ShieldCheck size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.features.f2.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">{t('landing.features.f2.desc')}</p>
                  </div>
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                        <Cpu size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.features.f3.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">{t('landing.features.f3.desc')}</p>
                  </div>
               </div>
            </div>

            {/* 3. How It Works */}
            <div id="how-it-works" className="w-full mx-auto mb-32 scroll-mt-24">
               <div className="max-w-6xl mx-auto text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-4">
                     {t('landing.how.title')}
                  </h2>
               </div>
               <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 relative">
                  <div className="hidden md:block absolute top-[45px] left-20 right-20 h-0.5 bg-gradient-to-r from-[#43cc25]/20 via-[#43cc25]/80 to-[#43cc25]/20 z-0" />
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-black/5 dark:border-white/10 z-10 hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-14 h-14 bg-white dark:bg-[#020617] border-2 border-[#43cc25] rounded-full flex items-center justify-center font-bold text-[#43cc25] text-xl mx-auto mb-6"><KeyRound size={24} /></div>
                     <h3 className="text-lg font-bold text-center mb-3">{t('landing.how.s1.title')}</h3>
                     <p className="text-sm text-corporate-600 dark:text-corporate-400 text-center leading-relaxed">{t('landing.how.s1.desc')}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-black/5 dark:border-white/10 z-10 hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-14 h-14 bg-white dark:bg-[#020617] border-2 border-[#43cc25] rounded-full flex items-center justify-center font-bold text-[#43cc25] text-xl mx-auto mb-6"><Send size={24} /></div>
                     <h3 className="text-lg font-bold text-center mb-3">{t('landing.how.s2.title')}</h3>
                     <p className="text-sm text-corporate-600 dark:text-corporate-400 text-center leading-relaxed">{t('landing.how.s2.desc')}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-black/5 dark:border-white/10 z-10 hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-14 h-14 bg-white dark:bg-[#020617] border-2 border-[#43cc25] rounded-full flex items-center justify-center font-bold text-[#43cc25] text-xl mx-auto mb-6"><Mail size={24} /></div>
                     <h3 className="text-lg font-bold text-center mb-3">{t('landing.how.s3.title')}</h3>
                     <p className="text-sm text-corporate-600 dark:text-corporate-400 text-center leading-relaxed">{t('landing.how.s3.desc')}</p>
                  </motion.div>
               </div>
               
               {/* Embedded Encryption Architecture relative to How It Works */}
               <div className="max-w-[1400px] xl:max-w-[1500px] mx-auto mt-20 w-full px-2 lg:px-8 relative">
                  <div className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-12 shadow-xl overflow-hidden relative">
                     
                     <div className="text-center mb-16 relative z-10">
                        <p className="text-sm font-bold text-[#43cc25] uppercase tracking-widest mb-3">{t('landing.workflow.subheader')}</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-6">
                           {t('landing.workflow.title')}
                        </h2>
                        <p className="text-corporate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                           {t('landing.workflow.desc')}
                        </p>
                     </div>
                     
                     <div className="w-full relative z-10 mb-20 md:mb-12">
                        <div className="bg-white dark:bg-[#020617] rounded-3xl py-10 px-4 md:py-12 md:px-8 border border-corporate-200 dark:border-white/5 shadow-inner overflow-x-auto overflow-y-hidden hide-scrollbar">
                           <div className="flex items-center gap-3 mb-8 min-w-max">
                              <KeyRound className="text-[#43cc25] w-6 h-6 shrink-0" />
                              <h3 className="text-corporate-900 dark:text-white font-bold text-xl">{t('landing.workflow.flowtitle')}</h3>
                           </div>
                           
                           <div className="flex flex-nowrap items-center justify-between gap-2 md:gap-4 min-w-max pb-2">
                              {['step1', 'step2', 'step3', 'step4', 'step5', 'step6'].map((step, idx) => (
                                 <div key={step} className="flex items-center gap-1 md:gap-3 shrink-0">
                                    {idx > 0 && (
                                       <div className="text-corporate-400 dark:text-slate-500 px-0.5 md:px-1">
                                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                       </div>
                                    )}
                                    <div className="bg-corporate-50 dark:bg-[#1e293b] border border-corporate-200 dark:border-white/10 px-4 py-2.5 md:px-5 md:py-3.5 rounded-xl text-corporate-900 dark:text-white text-[13px] md:text-sm font-bold whitespace-nowrap shadow-sm shrink-1 md:shrink-0">
                                       {t(`landing.workflow.${step}`)}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="text-center relative z-10 max-w-4xl mx-auto">
                        <p className="text-xs font-bold text-corporate-500 dark:text-slate-400 uppercase tracking-widest mb-6">{t('landing.workflow.tech')}</p>
                        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 max-w-3xl mx-auto">
                           {['React 19', 'TypeScript', 'Vite 8', 'TailwindCSS', 'Zustand', 'Web Crypto API', 'Gmail REST API', 'OAuth2 PKCE', 'Vitest', 'Vercel'].map((tech) => (
                              <span key={tech} className="bg-white dark:bg-[#1e293b] border border-corporate-200/50 dark:border-white/10 text-corporate-700 dark:text-slate-300 px-5 py-2 rounded-full text-sm font-medium hover:bg-corporate-50 dark:hover:bg-white/10 transition-colors cursor-default">
                                 {tech}
                              </span>
                           ))}
                        </div>
                     </div>

                     <div className="absolute top-0 right-0 w-96 h-96 bg-[#43cc25]/10 rounded-full blur-[100px] pointer-events-none" />
                     <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                  </div>
               </div>
            </div>

            {/* 4. Limitations */}
            <div id="limitations" className="w-full max-w-6xl mx-auto mb-32 scroll-mt-24">
               <div className="text-center mb-16">
                  <p className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">{t('landing.limitations.subheader')}</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-4">
                     {t('landing.limitations.title')}
                  </h2>
                  <p className="text-corporate-600 dark:text-corporate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                     {t('landing.limitations.desc')}
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                     <div key={num} className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg transition-all">
                        <div className={`p-3 rounded-xl shrink-0 ${num % 2 === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' : num === 5 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                           <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg mb-1 text-corporate-900 dark:text-white">{t(`landing.limitations.l${num}.title`)}</h3>
                           <p className="text-sm text-corporate-600 dark:text-corporate-400 leading-relaxed">{t(`landing.limitations.l${num}.desc`)}</p>
                        </div>
                     </div>
                  ))}
               </div>
               
               <p className="text-center text-sm font-medium text-corporate-500 max-w-3xl mx-auto">
                  {t('landing.limitations.botdesc')}
               </p>
            </div>

            {/* Section 5 was moved to sit after Section 6 */}
            {/* 6. Team */}
            <div id="team" className="w-full max-w-6xl mx-auto mb-32 scroll-mt-24">
               <div className="flex justify-center items-center gap-8 mb-12">
                  <img src="/hub.png" alt="HUB Logo" className="h-20 md:h-24 object-contain" />
                  <img src="/ds.png" alt="Khoa Logo" className="h-20 md:h-24 object-contain" />
               </div>
               
               <div className="text-center mb-12">
                  <p className="text-sm font-bold text-[#43cc25] uppercase tracking-widest mb-4">{t('landing.team.subheader')}</p>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-4">
                     {t('landing.team.title')}
                  </h2>
                  <p className="text-corporate-600 dark:text-corporate-400 font-medium">
                     {t('landing.team.dept')}
                  </p>
               </div>

               <div className="max-w-2xl mx-auto bg-[#43cc25]/5 dark:bg-[#43cc25]/5 border border-[#43cc25]/20 rounded-[2rem] p-6 mb-16 flex flex-col md:flex-row items-center md:items-start justify-center gap-5">
                  <div className="w-16 h-16 bg-[linear-gradient(360deg,#226214,#43cc25)] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                     <GraduationCap size={32} />
                  </div>
                  <div className="text-center md:text-left py-1">
                     <p className="text-[10px] font-black text-[#43cc25] uppercase tracking-[0.2em] mb-1.5">{t('landing.team.instructor_label')}</p>
                     <h3 className="text-xl font-bold text-corporate-900 dark:text-white mb-1.5">{t('landing.team.instructor_name')}</h3>
                     <p className="text-sm text-corporate-600 dark:text-slate-400">{t('landing.team.instructor_desc')}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="relative bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:shadow-xl group">
                      <div className="w-20 h-20 bg-corporate-100 dark:bg-slate-800 text-corporate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md overflow-hidden relative">
                         <img src={member.img} alt={member.name} className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                         <span className="text-2xl font-bold relative z-0">{member.initial}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-1 dark:text-white">{member.name}</h3>
                      <p className="text-xs font-medium text-slate-400 mb-5">MSSV: {member.mssv}</p>
                      <div className="bg-corporate-50 dark:bg-slate-800 text-corporate-600 dark:text-slate-300 text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-corporate-200/50 dark:border-white/5">
                         {member.role}
                      </div>

                      {/* View Profile Hover Button */}
                      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px]">
                          <button 
                            onClick={() => setSelectedMember(member)}
                            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-corporate-900 dark:text-white px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-corporate-100 dark:border-slate-700 font-bold text-[13px] whitespace-nowrap hover:scale-105 transition-transform"
                          >
                            <Eye size={15} className="text-corporate-500 dark:text-corporate-400" /> View profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Docs CTA was removed per user request */}
         </main>

         {/* 8. Global CTA */}
         <div className="w-full bg-[#111827] dark:bg-[#020617] pt-24 pb-20 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(67,204,37,0.05),transparent)] mix-blend-overlay"></div>
             <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 relative z-10 px-4">
                {t('landing.cta.title')}
             </h2>
             <p className="text-lg md:text-xl text-slate-400 mb-10 relative z-10 px-4 font-medium">
                {t('landing.cta.desc')}
             </p>
             <Link to="/login" className="inline-block bg-[linear-gradient(360deg,#226214,#43cc25)] hover:brightness-110 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-[0_0_40px_rgba(67,204,37,0.4)] text-[17px] relative z-10 hover:scale-105 active:scale-95">
                {t('landing.cta.btn')}
             </Link>
         </div>

         {/* 9. Minimal Footer */}
         <div className="w-full bg-white dark:bg-black py-4 px-6 md:px-12 flex justify-end items-center border-t border-slate-200 dark:border-white/5">
            <a href="mailto:fortismail.contact@gmail.com" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] transition-colors flex items-center gap-2">
               Contact: fortismail.contact@gmail.com <Mail className="w-4 h-4 ml-1" />
            </a>
         </div>

         {/* Profile Modal */}
         {selectedMember && createPortal(
           <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMember(null)}></div>
             
             <div className="relative bg-white dark:bg-slate-900 border border-corporate-200 dark:border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               {/* Close Button */}
               <button 
                 onClick={() => setSelectedMember(null)}
                 className="absolute top-4 right-4 text-corporate-400 hover:text-corporate-900 dark:hover:text-white bg-transparent hover:bg-corporate-50 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors z-10"
               >
                 <X size={20} />
               </button>
               
               <div className="p-8">
                 <div className="flex items-center gap-5 mb-8">
                   <div className="w-[84px] h-[84px] rounded-full bg-corporate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                     {selectedMember.img ? (
                       <img src={selectedMember.img} alt={selectedMember.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                     ) : (
                       <span className="text-corporate-500 dark:text-corporate-300 font-bold text-3xl">{selectedMember.initial}</span>
                     )}
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-corporate-900 dark:text-white mb-1 leading-tight">{selectedMember.name}</h3>
                     <p className="text-sm font-medium text-corporate-500 dark:text-corporate-400">{selectedMember.role}</p>
                   </div>
                 </div>
                 
                 <hr className="border-corporate-100 dark:border-slate-800 mb-6" />
                 
                 <div>
                   <h4 className="text-[15px] font-bold text-corporate-900 dark:text-white mb-4">Contact</h4>
                   <div className="flex items-center gap-3">
                     {/* Facebook */}
                     {selectedMember.contact?.facebook && (
                       <a href={selectedMember.contact.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors">
                         <Facebook size={20} className="fill-current" />
                       </a>
                     )}
                     {/* LinkedIn */}
                     {selectedMember.contact?.linkedin && (
                       <a href={selectedMember.contact.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors">
                         <Linkedin size={20} className="fill-current" />
                       </a>
                     )}
                     {/* Gmail */}
                     {selectedMember.contact?.email && (
                       <a href={selectedMember.contact.email} className="w-10 h-10 rounded-xl bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335] hover:text-white flex items-center justify-center transition-colors">
                         <Mail size={20} />
                       </a>
                     )}
                     
                     {/* Fallback pattern */}
                     {!selectedMember.contact && (
                       <span className="text-sm italic text-corporate-500">Contact information processing...</span>
                     )}
                   </div>
                 </div>
               </div>
             </div>
           </div>,
           document.body
         )}

      </div>
   );
}
