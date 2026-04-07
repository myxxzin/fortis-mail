import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ShieldCheck, ArrowRight, Globe, Lock, Code, Cpu, Shield, KeyRound, Mail, Github, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Landing() {
   const { t, language, setLanguage } = useLanguage();
   const { theme } = useTheme();

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
               <div className="flex items-center space-x-3">
                  <img src={theme === 'dark' ? "/ten.light.png" : "/ten.lightmode.png"} alt="FORTISMail" className="h-[22px] object-contain" />
               </div>
               
               {/* Nav Controls */}
               <div className="flex items-center space-x-4 md:space-x-6">
                  {/* Language Toggle */}
                  <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider border-r border-black/10 dark:border-white/10 pr-4 md:pr-6">
                     <Globe size={16} className="text-corporate-500 dark:text-white mr-0.5" />
                     <button
                       onClick={() => setLanguage('vi')}
                       className={`${language === 'vi' ? 'text-[#226214] dark:text-[#43cc25] opacity-100' : 'text-corporate-500 dark:text-white opacity-50 hover:opacity-100'} transition-all`}
                     >
                       VI
                     </button>
                     <span className="text-corporate-300 dark:text-white opacity-40">|</span>
                     <button
                       onClick={() => setLanguage('en')}
                       className={`${language === 'en' ? 'text-[#226214] dark:text-[#43cc25] opacity-100' : 'text-corporate-500 dark:text-white opacity-50 hover:opacity-100'} transition-all`}
                     >
                       EN
                     </button>
                  </div>

                  <Link to="/login" className="hidden sm:block text-sm font-bold text-corporate-600 dark:text-corporate-300 hover:text-[#43cc25] dark:hover:text-[#43cc25] transition-colors">
                     {t('landing.nav.login')}
                  </Link>
                  <Link to="/register" className="text-sm font-bold bg-[linear-gradient(360deg,#226214,#43cc25)] text-white px-5 py-2 rounded-xl hover:brightness-110 transition-all shadow-md flex items-center">
                     {t('landing.nav.register')} <ArrowRight size={16} className="ml-1.5" />
                  </Link>
               </div>
            </div>
         </nav>

         {/* --- Main Content --- */}
         <main className="pt-28 pb-24 px-4 w-full flex flex-col items-center">
            
            {/* 1. Hero Section */}
            <motion.div 
               variants={containerVariant} 
               initial="hidden" 
               animate="show" 
               className="w-full max-w-5xl mx-auto mb-32"
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

            {/* 2. What is FORTISMail */}
            <div id="what-is-it" className="w-full max-w-6xl mx-auto mb-32 scroll-mt-24">
               <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div 
                     initial={{ opacity: 0, x: -30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6 }}
                     className="space-y-6"
                  >
                     <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-corporate-900 dark:text-white">
                        {t('landing.what.title')}
                     </h2>
                     <p className="text-lg text-corporate-600 dark:text-corporate-300 leading-relaxed font-medium pb-2 border-l-4 border-[#43cc25] pl-4">
                        {t('landing.what.desc')}
                     </p>
                     <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="Fortis Shield" className="h-16 object-contain drop-shadow-[0_0_15px_rgba(67,204,37,0.4)]" />
                        <span className="font-bold text-corporate-600 dark:text-corporate-400">Zero-Knowledge Architecture</span>
                     </div>
                  </motion.div>
                  
                  <motion.div 
                     initial={{ opacity: 0, x: 30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6 }}
                     className="bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-black/5 dark:border-white/10 rounded-2xl p-6 relative overflow-hidden"
                  >
                     <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#43cc25]/10 rounded-full blur-3xl z-0" />
                     <div className="relative z-10 flex flex-col space-y-4">
                        <div className="flex items-center bg-white dark:bg-[#020617] p-4 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
                           <Shield className="text-red-500 mr-4 shrink-0" size={28} />
                           <div>
                              <h4 className="font-bold text-sm">Traditional Email</h4>
                              <p className="text-xs text-corporate-500">Servers can scan and read plain text.</p>
                           </div>
                        </div>
                        <div className="flex justify-center py-1">
                           <div className="w-1 h-6 bg-corporate-200 dark:bg-slate-700 rounded block" />
                        </div>
                        <div className="flex items-center bg-[linear-gradient(360deg,#226214,#43cc25)] p-4 rounded-xl shadow-lg ring-4 ring-[#43cc25]/20">
                           <Lock className="text-white mr-4 shrink-0" size={28} />
                           <div className="text-white">
                              <h4 className="font-bold text-sm">FORTISMail (E2EE)</h4>
                              <p className="text-xs text-green-50 opacity-90">Ciphertext only via ECC & AES-GCM Hybrid.</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </div>

            {/* 3. User Guide (Timeline) */}
            <div className="w-full max-w-6xl mx-auto mb-32">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-4">
                     {t('landing.guide.title')}
                  </h2>
               </div>

               <div className="grid md:grid-cols-3 gap-6 relative">
                  {/* Decorative Line linking steps */}
                  <div className="hidden md:block absolute top-[45px] left-20 right-20 h-0.5 bg-gradient-to-r from-[#43cc25]/20 via-[#43cc25]/80 to-[#43cc25]/20 z-0" />

                  {/* Step 1 */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-black/5 dark:border-white/10 z-10 hover:-translate-y-2 transition-transform duration-300"
                  >
                     <div className="w-14 h-14 bg-white dark:bg-[#020617] border-2 border-[#43cc25] rounded-full flex items-center justify-center font-bold text-[#43cc25] text-xl shadow-[0_0_15px_rgba(67,204,37,0.3)] mx-auto mb-6">
                        <KeyRound size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-center mb-3">{t('landing.guide.step1Title')}</h3>
                     <p className="text-sm text-corporate-600 dark:text-corporate-400 text-center leading-relaxed">
                        {t('landing.guide.step1Desc')}
                     </p>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-black/5 dark:border-white/10 z-10 hover:-translate-y-2 transition-transform duration-300"
                  >
                     <div className="w-14 h-14 bg-white dark:bg-[#020617] border-2 border-[#43cc25] rounded-full flex items-center justify-center font-bold text-[#43cc25] text-xl shadow-[0_0_15px_rgba(67,204,37,0.3)] mx-auto mb-6">
                        <Send size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-center mb-3">{t('landing.guide.step2Title')}</h3>
                     <p className="text-sm text-corporate-600 dark:text-corporate-400 text-center leading-relaxed">
                        {t('landing.guide.step2Desc')}
                     </p>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-black/5 dark:border-white/10 z-10 hover:-translate-y-2 transition-transform duration-300"
                  >
                     <div className="w-14 h-14 bg-white dark:bg-[#020617] border-2 border-[#43cc25] rounded-full flex items-center justify-center font-bold text-[#43cc25] text-xl shadow-[0_0_15px_rgba(67,204,37,0.3)] mx-auto mb-6">
                        <Mail size={24} />
                     </div>
                     <h3 className="text-lg font-bold text-center mb-3">{t('landing.guide.step3Title')}</h3>
                     <p className="text-sm text-corporate-600 dark:text-corporate-400 text-center leading-relaxed">
                        {t('landing.guide.step3Desc')}
                     </p>
                  </motion.div>
               </div>
            </div>

            {/* 4. Our Team */}
            <div id="team" className="w-full max-w-6xl mx-auto border-t border-black/10 dark:border-white/10 pt-24 mb-10">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-4">
                     {t('landing.team.title')}
                  </h2>
                  <p className="text-corporate-600 dark:text-corporate-400 max-w-2xl mx-auto font-medium">
                     {t('landing.team.desc')}
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Member 1 */}
                  <div className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xl group">
                     <div className="w-20 h-20 bg-corporate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-corporate-400 dark:text-slate-500">V</span>
                     </div>
                     <h3 className="font-bold text-lg mb-1">{t('landing.team.member1')}</h3>
                     <p className="text-xs font-semibold text-[#43cc25] uppercase tracking-wider">{t('landing.team.role1')}</p>
                  </div>

                  {/* Member 2 */}
                  <div className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xl group">
                     <div className="w-20 h-20 bg-corporate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-corporate-400 dark:text-slate-500">Đ</span>
                     </div>
                     <h3 className="font-bold text-lg mb-1">{t('landing.team.member2')}</h3>
                     <p className="text-xs font-semibold text-[#43cc25] uppercase tracking-wider">{t('landing.team.role2')}</p>
                  </div>

                  {/* Member 3 */}
                  <div className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xl group">
                     <div className="w-20 h-20 bg-corporate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-corporate-400 dark:text-slate-500">P</span>
                     </div>
                     <h3 className="font-bold text-lg mb-1">{t('landing.team.member3')}</h3>
                     <p className="text-xs font-semibold text-[#43cc25] uppercase tracking-wider">{t('landing.team.role3')}</p>
                  </div>

                  {/* Member 4 */}
                  <div className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xl group">
                     <div className="w-20 h-20 bg-corporate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-corporate-400 dark:text-slate-500">H</span>
                     </div>
                     <h3 className="font-bold text-lg mb-1">{t('landing.team.member4')}</h3>
                     <p className="text-xs font-semibold text-[#43cc25] uppercase tracking-wider">{t('landing.team.role4')}</p>
                  </div>
               </div>
            </div>
            {/* 5. Core Technology */}
            <div id="core-tech" className="w-full max-w-7xl mx-auto border-t border-black/10 dark:border-white/10 pt-24 mb-20 px-4">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-corporate-900 dark:text-white mb-4">
                     {t('landing.tech.title')}
                  </h2>
                  <p className="text-corporate-600 dark:text-corporate-400 max-w-2xl mx-auto font-medium">
                     {t('landing.tech.desc')}
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* E2E */}
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-[#43cc25]/10 text-[#43cc25] rounded-xl flex items-center justify-center mb-6">
                        <Lock size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.tech.e2e.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">
                        {t('landing.tech.e2e.desc')}
                     </p>
                  </div>

                  {/* Zero-Knowledge */}
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-[#43cc25]/10 text-[#43cc25] rounded-xl flex items-center justify-center mb-6">
                        <ShieldCheck size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.tech.zeroKnowledge.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">
                        {t('landing.tech.zeroKnowledge.desc')}
                     </p>
                  </div>
                  
                  {/* ECC & AES */}
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-[#43cc25]/10 text-[#43cc25] rounded-xl flex items-center justify-center mb-6">
                        <KeyRound size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.tech.eccAes.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">
                        {t('landing.tech.eccAes.desc')}
                     </p>
                  </div>
                  
                  {/* PBKDF2 */}
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-[#43cc25]/10 text-[#43cc25] rounded-xl flex items-center justify-center mb-6">
                        <Cpu size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.tech.pbkdf2.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">
                        {t('landing.tech.pbkdf2.desc')}
                     </p>
                  </div>
                  
                  {/* Architecture */}
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-[#43cc25]/10 text-[#43cc25] rounded-xl flex items-center justify-center mb-6">
                        <Code size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.tech.architecture.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">
                        {t('landing.tech.architecture.desc')}
                     </p>
                  </div>
                  
                  {/* Local PIN */}
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                     <div className="w-12 h-12 bg-[#43cc25]/10 text-[#43cc25] rounded-xl flex items-center justify-center mb-6">
                        <Shield size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3">{t('landing.tech.pin.title')}</h3>
                     <p className="text-corporate-600 dark:text-corporate-400 text-sm leading-relaxed">
                        {t('landing.tech.pin.desc')}
                     </p>
                  </div>
               </div>
            </div>
         </main>

         {/* --- Mega Footer --- */}
         <footer className="w-full bg-white dark:bg-[#020617] border-t border-black/5 dark:border-white/10 pt-16 pb-8 relative z-20">
            <div className="max-w-7xl mx-auto px-6">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                  
                  {/* Column 1: Brand & Contact (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col space-y-6">
                     <div className="flex items-center space-x-3 mb-2">
                        <img src={theme === 'dark' ? "/ten.light.png" : "/ten.lightmode.png"} alt="FORTISMail" className="h-[28px] object-contain" />
                     </div>
                     <p className="text-corporate-600 dark:text-corporate-400 font-medium leading-relaxed max-w-sm">
                        {t('landing.hero.subtitle')}
                     </p>
                     <div className="pt-2">
                        <h4 className="font-bold text-corporate-900 dark:text-white mb-3">{t('landing.footer.contact')}</h4>
                        <p className="text-corporate-600 dark:text-corporate-400 text-sm mb-2">{t('landing.footer.hotline')}</p>
                        <p className="text-corporate-600 dark:text-corporate-400 text-sm mb-4">{t('landing.footer.email')}</p>
                     </div>
                     {/* Social Links */}
                     <div>
                        <h4 className="font-bold text-corporate-900 dark:text-white mb-3">FORTISMail Community</h4>
                        <div className="flex items-center space-x-4">
                           <a href="#" className="w-10 h-10 rounded-full bg-corporate-100 dark:bg-white/5 flex items-center justify-center text-corporate-600 dark:text-white hover:bg-[#43cc25] dark:hover:bg-[#43cc25] hover:text-white transition-colors">
                              <Github size={20} />
                           </a>
                           <a href="#" className="w-10 h-10 rounded-full bg-corporate-100 dark:bg-white/5 flex items-center justify-center text-corporate-600 dark:text-white hover:bg-[#43cc25] dark:hover:bg-[#43cc25] hover:text-white transition-colors">
                              <Code size={20} />
                           </a>
                           <a href="#" className="w-10 h-10 rounded-full bg-corporate-100 dark:bg-white/5 flex items-center justify-center text-corporate-600 dark:text-white hover:bg-[#43cc25] dark:hover:bg-[#43cc25] hover:text-white transition-colors">
                              <ShieldCheck size={20} />
                           </a>
                        </div>
                     </div>
                  </div>

                  {/* Column 2, 3, 4: Link Groups */}
                  <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                     
                     {/* About */}
                     <div>
                        <h4 className="font-bold text-corporate-900 dark:text-white mb-6 text-lg">{t('landing.footer.about')}</h4>
                        <ul className="space-y-4">
                           <li><a href="#what-is-it" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.intro')}</a></li>
                           <li><a href="#team" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.team')}</a></li>
                           <li><a href="#core-tech" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.routing')}</a></li>
                           <li><Link to="/docs" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.whitepaper')}</Link></li>
                        </ul>
                     </div>

                     {/* Features */}
                     <div>
                        <h4 className="font-bold text-corporate-900 dark:text-white mb-6 text-lg">{t('landing.footer.features')}</h4>
                        <ul className="space-y-4">
                           <li><a href="#core-tech" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.e2e')}</a></li>
                           <li><a href="#core-tech" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.zeroQ')}</a></li>
                           <li><a href="#core-tech" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.ecc')}</a></li>
                           <li><a href="#core-tech" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.pbkdf')}</a></li>
                        </ul>
                     </div>

                     {/* Privacy */}
                     <div className="col-span-2 md:col-span-1">
                        <h4 className="font-bold text-corporate-900 dark:text-white mb-6 text-lg">{t('landing.footer.privacy')}</h4>
                        <ul className="space-y-4">
                           <li><a href="#what-is-it" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.privacyPolicy')}</a></li>
                           <li><a href="#what-is-it" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.terms')}</a></li>
                           <li><a href="#what-is-it" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.guide')}</a></li>
                           <li><a href="#what-is-it" className="text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] text-sm transition-colors">{t('landing.footer.faq')}</a></li>
                        </ul>
                     </div>

                  </div>
               </div>
               
               {/* Bottom bar */}
               <div className="border-t border-black/5 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-corporate-500">
                  <p className="mb-4 md:mb-0 font-medium">{t('landing.footer')}</p>
                  <div className="flex items-center space-x-5">
                     <span className="flex items-center"><Lock size={16} className="mr-2 text-[#43cc25]" /> End-to-End Encrypted</span>
                     <span className="flex items-center"><Shield size={16} className="mr-2 text-[#43cc25]" /> Zero-Knowledge</span>
                  </div>
               </div>
            </div>
         </footer>
      </div>
   );
}
