import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Menu, X, Github, Globe, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// Section components
import GettingStartedSection from './docs/sections/GettingStartedSection';
import EncryptionSection from './docs/sections/EncryptionSection';
import AuthenticationSection from './docs/sections/AuthenticationSection';

import SecuritySection from './docs/sections/SecuritySection';
import ReferenceSection from './docs/sections/ReferenceSection';

const NAVIGATION_GROUPS = {
  vi: [
    {
      title: 'TỔNG QUAN',
      items: [
        { id: 'getting-started', label: 'Bắt đầu nhanh' },
      ]
    },
    {
      title: 'CỐT LÕI',
      items: [
        { id: 'encryption', label: 'Mã hóa (Encryption)' },
        { id: 'authentication', label: 'Xác thực (Auth)' },
      ]
    },

    {
      title: 'HỆ THỐNG',
      items: [
        { id: 'security', label: 'Bảo mật (Security)' },
        { id: 'reference', label: 'Tham khảo API' },
      ]
    }
  ],
  en: [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'getting-started', label: 'Getting Started' },
      ]
    },
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'encryption', label: 'Encryption' },
        { id: 'authentication', label: 'Authentication' },
      ]
    },

    {
      title: 'SYSTEM',
      items: [
        { id: 'security', label: 'Security' },
        { id: 'reference', label: 'Reference' },
      ]
    }
  ]
};

export default function Docs() {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();

  const groups = NAVIGATION_GROUPS[language];

  // Flatten items for scroll spy
  const navItems = groups.flatMap(g => g.items);

  // Scroll Spy logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [language]); // Depend on language since it might re-render slightly differently

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, 
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const NavItemComponent = ({ id, label }: { id: string, label: string }) => {
    const isActive = activeSection === id;
    return (
      <button
        onClick={() => scrollToSection(id)}
        className={`w-full text-left px-4 py-2 flex items-center rounded-xl text-sm font-bold transition-all duration-200 ${
          isActive 
            ? 'bg-white dark:bg-white/10 text-[#43cc25] dark:text-[#43cc25] shadow-sm border border-black/5 dark:border-white/10'  
            : 'text-corporate-600 dark:text-corporate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-corporate-900 dark:hover:text-white border border-transparent'
        }`}
      >
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#43cc25] mr-2"></div>}
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] dark:bg-[#020617] text-corporate-900 dark:text-white font-sans flex flex-col selection:bg-[#43cc25] selection:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#020617]/70 backdrop-blur-xl transition-colors text-corporate-900 dark:text-white">
        <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 text-corporate-500 hover:text-corporate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center space-x-3">
               <img src={theme === 'dark' ? "/ten.light.png" : "/ten.lightmode.png"} alt="FORTISMail" className="h-[22px] object-contain" />
            </Link>
            <span className="hidden lg:flex items-center ml-6 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-corporate-600 dark:text-corporate-300 text-xs px-2.5 py-1 rounded-md font-bold tracking-wide">
              DOCS
            </span>
            
            {/* Quick Search Mockup */}
            <div className="hidden md:flex ml-8 items-center bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 text-corporate-500 dark:text-corporate-400 px-3 py-1.5 rounded-lg text-sm w-64 cursor-text">
              <Search className="w-4 h-4 mr-2 opacity-70" />
              <span className="opacity-70 text-xs font-bold uppercase tracking-wider">Search documentation...</span>
              <span className="ml-auto flex gap-1">
                <kbd className="font-sans text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-black/5 dark:border-slate-600 font-bold">Ctrl</kbd>
                <kbd className="font-sans text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-black/5 dark:border-slate-600 font-bold">K</kbd>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-corporate-600 dark:text-corporate-400 hover:text-[#43cc25] dark:hover:text-[#43cc25] transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline block uppercase">{language}</span>
            </button>
            
            <Link to="/" className="text-sm font-bold text-corporate-600 dark:text-corporate-400 flex items-center hover:text-[#43cc25] dark:hover:text-[#43cc25] transition-colors">
               <ArrowLeft className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">{language === 'vi' ? 'Trang chủ' : 'Frontpage'}</span>
            </Link>
            
            <div className="w-px h-5 bg-black/10 dark:bg-white/10 hidden sm:block"></div>
            
            <a href="https://github.com/myxxzin/secure-webmail" target="_blank" rel="noreferrer" className="hidden sm:flex items-center text-sm font-bold text-corporate-600 dark:text-corporate-400 hover:text-corporate-900 dark:hover:text-white transition-colors">
               <Github className="w-4 h-4 mr-1.5" /> GitHub
            </a>
            
            <Link to="/login" className="bg-[linear-gradient(360deg,#226214,#43cc25)] hover:brightness-110 text-white text-sm font-bold py-2 px-5 rounded-xl shadow-md transition-all hidden sm:block">
              {language === 'vi' ? 'Mở ứng dụng' : 'Launch App'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Layout Area */}
      <div className="flex flex-1 w-full max-w-[90rem] mx-auto pt-16 relative">
        
        {/* Left Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-[#eef2f7]/50 dark:bg-[#020617]/50 w-72 border-r border-black/5 dark:border-white/10 py-8 px-6 overflow-y-auto transform transition-transform duration-300 z-40
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl bg-[#eef2f7] dark:bg-[#020617]' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-8">
            {groups.map((group, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-extrabold text-corporate-900 dark:text-white mb-3 px-2 tracking-widest uppercase opacity-60">
                  {group.title}
                </h4>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <NavItemComponent key={item.id} id={item.id} label={item.label} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-30 lg:hidden top-16 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0 px-5 sm:px-8 md:px-16 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto xl:max-w-4xl">
            <GettingStartedSection />
            <div className="w-full h-px bg-black/5 dark:bg-white/10 my-16"></div>
            <EncryptionSection />
            <div className="w-full h-px bg-black/5 dark:bg-white/10 my-16"></div>
            <AuthenticationSection />
            <div className="w-full h-px bg-black/5 dark:bg-white/10 my-16"></div>

            <SecuritySection />
            <div className="w-full h-px bg-black/5 dark:bg-white/10 my-16"></div>
            <ReferenceSection />
          </div>
        </main>
      </div>
    </div>
  );
}
