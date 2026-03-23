import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Globe, Moon, Sun } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="absolute top-6 right-8 z-50 flex items-center gap-4 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 px-4 py-2 rounded-full shadow-lg transition-all hover:bg-white/80 dark:hover:bg-white/10">
      
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="flex items-center justify-center text-corporate-500 dark:text-corporate-300 hover:text-corporate-900 dark:hover:text-white transition-colors"
        title="Toggle Light/Dark Theme"
      >
        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <div className="w-[1px] h-4 bg-black/20 dark:bg-white/20 transition-colors"></div>

      {/* Language */}
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
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
  );
};
