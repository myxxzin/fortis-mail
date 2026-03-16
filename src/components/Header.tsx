import { useState } from 'react';
import { Search, Bell, LogOut, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Mock notifications state specifically for the header
export const MOCK_NOTIFICATIONS = [
  { id: 'msg-1', sender: 'HR Department', subject: '[Confidential] Q3 Bonus Allocation', date: '10:42 AM', isUnread: true, path: '/mail/msg-1' },
  { id: 'notif-2', sender: 'System', subject: 'Your keys were accessed from a new device.', date: 'Yesterday', isUnread: true, path: '/inbox' },
];

export default function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
  };

  return (
    <header className="h-20 border-b border-corporate-100 bg-surface flex items-center justify-between px-8 shrink-0 relative z-40">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search secure messages..." 
          className="w-full bg-corporate-50 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-accent-blue focus:outline-none transition-shadow text-corporate-900 placeholder:text-corporate-400"
        />
      </div>
      
      <div className="flex items-center space-x-5 text-corporate-400 relative">
        <div className="relative">
          <button 
             onClick={() => setShowNotifications(!showNotifications)} 
             className="hover:text-corporate-900 transition-colors relative p-1"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-surface">
                {unreadCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <>
                 <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-corporate-200 overflow-hidden z-50 origin-top-right flex flex-col max-h-[400px]"
                 >
                    <div className="p-4 border-b border-corporate-100 flex items-center justify-between bg-corporate-50/50">
                       <h3 className="font-bold text-sm text-corporate-900">Notifications</h3>
                       {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-accent-blue hover:text-accent-blue-hover flex items-center">
                             <CheckCheck size={14} className="mr-1" /> Mark all read
                          </button>
                       )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                       {notifications.length === 0 ? (
                          <div className="p-8 text-center text-sm text-corporate-500">No recent notifications.</div>
                       ) : (
                          <div className="divide-y divide-corporate-100">
                             {notifications.map(notif => (
                                <Link 
                                  key={notif.id} 
                                  to={notif.path}
                                  onClick={() => setShowNotifications(false)}
                                  className={`block p-4 hover:bg-corporate-50 transition-colors ${notif.isUnread ? 'bg-blue-50/30' : ''}`}
                                >
                                   <div className="flex items-start justify-between mb-1">
                                      <span className={`text-sm ${notif.isUnread ? 'font-bold text-corporate-900' : 'font-medium text-corporate-700'}`}>{notif.sender}</span>
                                      <span className="text-xs text-corporate-400">{notif.date}</span>
                                   </div>
                                   <p className={`text-xs truncate ${notif.isUnread ? 'text-corporate-800' : 'text-corporate-500'}`}>{notif.subject}</p>
                                </Link>
                             ))}
                          </div>
                       )}
                    </div>
                 </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar with Profile Dropdown */}
        <div className="relative border-l border-corporate-200 pl-4 ml-2 flex items-center">
           <button 
             onClick={() => setShowProfile(!showProfile)}
             className="flex items-center space-x-2 hover:bg-corporate-50 p-1.5 rounded-xl transition-colors"
           >
              <div className="h-9 w-9 bg-accent-blue text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                 {user?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                 <p className="text-sm font-bold text-corporate-900 leading-none">{user?.name}</p>
                 <p className="text-xs text-corporate-500 mt-1 leading-none">{user?.position || 'User'}</p>
              </div>
           </button>

           <AnimatePresence>
              {showProfile && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute top-14 right-0 w-72 bg-white rounded-2xl shadow-xl border border-corporate-200 overflow-hidden z-50 origin-top-right flex flex-col"
                   >
                      <div className="p-5 border-b border-corporate-100 bg-corporate-50/50 flex flex-col items-center">
                         <div className="h-16 w-16 bg-accent-blue text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md mb-3">
                            {user?.name.charAt(0) || 'U'}
                         </div>
                         <h3 className="font-bold text-base text-corporate-900">{user?.name}</h3>
                         <p className="text-xs text-corporate-500">{user?.email}</p>
                      </div>
                      <div className="p-4 border-b border-corporate-100">
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-corporate-400">Position</span>
                               <span className="font-medium text-corporate-700">{user?.position || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-corporate-400">Department</span>
                               <span className="font-medium text-corporate-700">{user?.department || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-corporate-400">Age</span>
                               <span className="font-medium text-corporate-700">{user?.age || '-'}</span>
                            </div>
                         </div>
                      </div>
                      <div className="p-2 bg-corporate-50">
                         <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors">
                            <LogOut size={16} />
                            <span>Sign Out</span>
                         </button>
                      </div>
                   </motion.div>
                 </>
              )}
           </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
