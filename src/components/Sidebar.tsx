import { Link, useLocation } from 'react-router-dom';
import { Inbox, Send, FileEdit, Settings, ShieldAlert, Cpu, Users } from 'lucide-react';
import { useMail } from '../context/MailContext';

export default function Sidebar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const location = useLocation();
  const { unreadCount } = useMail();

  return (
    <div className="w-full md:w-64 bg-surface border-r border-corporate-200 h-full flex flex-col shrink-0">
      <div className="h-20 flex px-6 border-b border-corporate-100 bg-corporate-50 shrink-0">
        <Link to="/inbox" className="flex items-center w-full group">
          <img src="/logo.png" alt="FortisMail" className="h-10 object-contain group-hover:scale-105 transition-transform" />
        </Link>
      </div>

      <div className="px-4 mb-6 mt-6 shrink-0">
        <Link to="/compose" className="w-full bg-corporate-900 hover:bg-corporate-800 text-white flex items-center justify-center space-x-2 py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.15)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)] font-medium">
          <FileEdit size={18} />
          <span>New Secure Mail</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-corporate-400 mb-2 px-2 mt-4">Folders</div>
        {[
          { icon: Inbox, label: 'Inbox', path: '/inbox', count: unreadCount > 0 ? unreadCount : undefined },
          { icon: Send, label: 'Sent', path: '/sent' },
          { icon: FileEdit, label: 'Drafts', path: '/drafts' },
          { icon: Users, label: 'Contacts', path: '/contacts' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${location.pathname === item.path
                ? 'bg-blue-50 text-accent-blue font-semibold'
                : 'text-corporate-600 hover:bg-corporate-50 hover:text-corporate-900'
              }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon size={18} className={location.pathname === item.path ? 'text-accent-blue' : 'text-corporate-400'} />
              <span>{item.label}</span>
            </div>
            {item.count && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${location.pathname === item.path ? 'bg-accent-blue text-white' : 'bg-corporate-100 text-corporate-600'
                }`}>
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-corporate-200 bg-corporate-50/50 mt-auto">
        <div className="flex items-center space-x-2 text-xs text-corporate-500 mb-4 px-2">
          <Cpu size={14} className="text-green-500" />
          <span className="font-medium">Core Online</span>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-corporate-600 hover:bg-corporate-100 hover:text-corporate-900 rounded-xl transition-colors font-medium border border-transparent hover:border-corporate-200"
        >
          <div className="flex items-center space-x-3">
            <Settings size={18} className="text-corporate-400" />
            <span>Security Settings</span>
          </div>
          <ShieldAlert size={14} className="text-orange-400" />
        </button>
      </div>
    </div>
  );
}
