import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Menu, X, ShieldCheck, Github, Globe, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
        className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
          isActive 
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold'  
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200">
      {/* Top Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
        <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-1.5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-bold text-lg hidden sm:block tracking-tight">SecureMail</span>
            </Link>
            <span className="hidden lg:flex items-center ml-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide">
              DOCS
            </span>
            
            {/* Quick Search Mockup */}
            <div className="hidden md:flex ml-8 items-center bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg text-sm w-64 cursor-text">
              <Search className="w-4 h-4 mr-2 opacity-70" />
              <span className="opacity-70">Search documentation...</span>
              <span className="ml-auto flex gap-1">
                <kbd className="font-sans text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">Ctrl</kbd>
                <kbd className="font-sans text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">K</kbd>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{language.toUpperCase()}</span>
            </button>
            
            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
               <ArrowLeft className="w-4 h-4 mr-1.5" /> <span className="hidden sm:inline">{language === 'vi' ? 'Trang chủ' : 'Frontpage'}</span>
            </Link>
            
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            
            <a href="https://github.com/myxxzin/secure-webmail" target="_blank" rel="noreferrer" className="hidden sm:flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <Github className="w-4 h-4 mr-1.5" /> GitHub
            </a>
            
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm shadow-blue-600/20 transition-all hidden sm:block">
              {language === 'vi' ? 'Mở ứng dụng' : 'Launch App'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Layout Area */}
      <div className="flex flex-1 w-full max-w-[90rem] mx-auto pt-16 relative">
        
        {/* Left Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] w-72 border-r border-slate-200 dark:border-slate-800 py-8 px-6 overflow-y-auto transform transition-transform duration-300 z-40
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="space-y-8">
            {groups.map((group, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 px-2 tracking-wide">
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
            <div className="w-full h-px bg-slate-200 dark:bg-slate-800/50 my-16"></div>
            <EncryptionSection />
            <div className="w-full h-px bg-slate-200 dark:bg-slate-800/50 my-16"></div>
            <AuthenticationSection />
            <div className="w-full h-px bg-slate-200 dark:bg-slate-800/50 my-16"></div>

            <SecuritySection />
            <div className="w-full h-px bg-slate-200 dark:bg-slate-800/50 my-16"></div>
            <ReferenceSection />
          </div>
        </main>
      </div>
    </div>
  );
}
