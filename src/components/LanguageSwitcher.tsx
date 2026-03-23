import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-6 right-8 z-50 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg transition-all hover:bg-white/10">
      <Globe size={16} className="text-corporate-300" />
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
        <button
          onClick={() => setLanguage('vi')}
          className={`${language === 'vi' ? 'text-white' : 'text-corporate-500 hover:text-corporate-300'} transition-colors`}
        >
          VI
        </button>
        <span className="text-corporate-600">|</span>
        <button
          onClick={() => setLanguage('en')}
          className={`${language === 'en' ? 'text-white' : 'text-corporate-500 hover:text-corporate-300'} transition-colors`}
        >
          EN
        </button>
      </div>
    </div>
  );
};
