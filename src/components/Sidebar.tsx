import { Link, useLocation } from 'react-router-dom';
import { Inbox, Send, FileEdit, Settings, ShieldAlert, Users, Info } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useLanguage } from '../contexts/LanguageContext';


export default function Sidebar({ onOpenSettings, onMobileClose }: { onOpenSettings: () => void, onMobileClose?: () => void }) {
  const location = useLocation();
  const { unreadCount } = useMail();
  const { t } = useLanguage();

  return (
    <div className="w-full md:w-64 bg-white dark:bg-[#020617] border-r border-corporate-200 dark:border-white/10 h-full flex flex-col shrink-0 transition-colors duration-300">
      <div className="h-20 flex px-6 border-b border-corporate-100 dark:border-white/10 bg-white dark:bg-[#020617] shrink-0 transition-colors duration-300">
        <Link to="/inbox" onClick={onMobileClose} className="flex items-center w-full group space-x-3">
          <img src="/logo.png" alt="FortisMail Logo" className="h-8 object-contain group-hover:scale-105 transition-transform" />
          <img src="/ten.lightmode.png" alt="FortisMail Text" className="h-[18px] object-contain dark:hidden" />
          <img src="/ten.light.png" alt="FortisMail Text" className="h-4 object-contain hidden dark:block" />
        </Link>
      </div>

      <div className="px-4 mb-6 mt-6 shrink-0">
        <Link id="tour-compose" to="/compose" onClick={onMobileClose} className="w-full bg-corporate-900 border border-transparent dark:bg-white hover:bg-black dark:hover:bg-corporate-100 text-white dark:text-corporate-900 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all shadow-md font-bold">
          <FileEdit size={18} />
          <span>{t('sidebar.compose')}</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-corporate-400 dark:text-white mb-2 px-2 mt-4">{t('sidebar.folders')}</div>
        {[
          { icon: Inbox, label: t('sidebar.inbox'), path: '/inbox', count: unreadCount > 0 ? unreadCount : undefined },
          { icon: Send, label: t('sidebar.sent'), path: '/sent' },
          { icon: FileEdit, label: t('sidebar.drafts'), path: '/drafts' },
          { icon: Users, label: t('sidebar.contacts'), path: '/contacts' },
          { icon: Info, label: t('sidebar.aboutUs'), path: '/about' },
        ].map((item) => (
          <Link
            key={item.label}
            id={`tour-${item.path.replace('/', '')}`}
            to={item.path}
            onClick={onMobileClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${location.pathname === item.path
              ? 'bg-blue-50 dark:bg-accent-blue/20 text-accent-blue font-semibold'
              : 'text-corporate-600 dark:text-white hover:bg-corporate-50 dark:hover:bg-white/5 hover:text-corporate-900 dark:hover:text-white'
              }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon size={18} className={location.pathname === item.path ? 'text-accent-blue' : 'text-corporate-400 dark:text-white'} />
              <span>{item.label}</span>
            </div>
            {item.count && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${location.pathname === item.path ? 'bg-accent-blue text-white' : 'bg-corporate-100 dark:bg-white/10 text-corporate-600 dark:text-white'
                }`}>
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-corporate-200 dark:border-white/10 bg-corporate-50 dark:bg-[#020617] mt-auto transition-colors duration-300">

        <button
          id="tour-settings"
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-corporate-600 dark:text-white hover:bg-corporate-100 dark:hover:bg-white/10 hover:text-corporate-900 dark:hover:text-white rounded-xl transition-colors font-medium border border-transparent hover:border-corporate-200 dark:hover:border-white/10"
        >
          <div className="flex items-center space-x-3">
            <Settings size={18} className="text-corporate-400 dark:text-white" />
            <span>{t('sidebar.securitySettings')}</span>
          </div>
          <ShieldAlert size={14} className="text-orange-400" />
        </button>
      </div>
    </div>
  );
}
