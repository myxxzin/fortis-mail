import { useState } from 'react';
import { Search, Bell, LogOut, CheckCheck, Menu, Globe, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ onToggleMenu }: { onToggleMenu?: () => void }) {
   const { logout, user } = useAuth();
   const { mails, unreadCount, markAsRead } = useMail();
   const { contacts } = useContacts();
   const navigate = useNavigate();
   const { language, setLanguage } = useLanguage();
   const { theme, toggleTheme } = useTheme();
   const [showNotifications, setShowNotifications] = useState(false);
   const [showProfile, setShowProfile] = useState(false);

   const unreadMails = mails.filter(m => m.isUnread);
   const recentMails = [...mails].sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0;
      const timeB = new Date(b.date).getTime() || 0;
      return timeB - timeA;
   }).slice(0, 5);

   const resolveAlias = (pubKey: string) => {
      if (pubKey === 'System Key') return 'System';
      const contact = contacts.find(c => c.publicKey === pubKey);
      return contact ? contact.alias : (pubKey ? pubKey.substring(0, 24) + '...' : 'Unknown');
   };

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const handleMarkAllRead = async () => {
      // Execute markAsRead concurrently for all unread messages
      await Promise.all(unreadMails.map(mail => markAsRead(mail.id)));
      setShowNotifications(false);
   };

   return (
      <header className="h-20 border-b border-corporate-200 dark:border-white/10 bg-white dark:bg-[#020617] flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40 transition-colors duration-300">
         <div className="flex items-center w-full md:w-96 mr-4">
            <button onClick={onToggleMenu} className="md:hidden p-2 mr-2 text-corporate-500 dark:text-white hover:bg-corporate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
               <Menu size={24} />
            </button>
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-corporate-400 dark:text-white" size={18} />
               <input
                  type="text"
                  placeholder="Search secure messages..."
                  className="w-full bg-corporate-50 dark:bg-slate-800 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-accent-blue focus:outline-none transition-shadow text-corporate-900 dark:text-white placeholder:text-corporate-400 dark:placeholder:text-corporate-500"
               />
            </div>
         </div>

         <div className="flex items-center space-x-5 text-corporate-500 dark:text-white relative shrink-0">
            {/* Language & Theme Controls */}
            <div className="flex items-center space-x-5 border-r border-corporate-200 dark:border-white/10 pr-5">
               {/* Theme Toggle */}
               <button 
                 onClick={toggleTheme} 
                 className="flex items-center justify-center hover:text-corporate-900 dark:hover:text-white transition-colors"
                 title="Toggle Light/Dark Theme"
               >
                 {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
               </button>

               {/* Language Toggle */}
               <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider">
                 <Globe size={16} className="text-corporate-400 dark:text-white mr-0.5" />
                 <button
                   onClick={() => setLanguage('vi')}
                   className={`${language === 'vi' ? 'text-corporate-900 dark:text-white opacity-100' : 'text-corporate-500 dark:text-white opacity-40 hover:opacity-100'} transition-all`}
                 >
                   VI
                 </button>
                 <span className="text-corporate-300 dark:text-white opacity-40">|</span>
                 <button
                   onClick={() => setLanguage('en')}
                   className={`${language === 'en' ? 'text-corporate-900 dark:text-white opacity-100' : 'text-corporate-500 dark:text-white opacity-40 hover:opacity-100'} transition-all`}
                 >
                   EN
                 </button>
               </div>
            </div>

            <div className="relative">
               <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="hover:text-corporate-900 dark:hover:text-white transition-colors relative p-1"
               >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                     <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#020617]">
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
                           className="absolute top-12 right-0 w-80 bg-white dark:bg-[#020617] rounded-2xl shadow-xl border border-corporate-200 dark:border-slate-800 overflow-hidden z-50 origin-top-right flex flex-col max-h-[400px]"
                        >
                           <div className="p-4 border-b border-corporate-100 dark:border-slate-800 flex items-center justify-between bg-corporate-50/50 dark:bg-slate-800/50">
                              <h3 className="font-bold text-sm text-corporate-900 dark:text-white">Notifications</h3>
                              {unreadCount > 0 && (
                                 <button onClick={handleMarkAllRead} className="text-xs text-accent-blue hover:text-accent-blue-hover flex items-center transition-colors">
                                    <CheckCheck size={14} className="mr-1" /> Mark all read
                                 </button>
                              )}
                           </div>
                           <div className="overflow-y-auto flex-1 max-h-80">
                              {recentMails.length === 0 ? (
                                 <div className="p-8 text-center text-sm text-corporate-500 dark:text-white">No incoming secure messages.</div>
                              ) : (
                                 <div className="divide-y divide-corporate-100 dark:divide-slate-800">
                                    {recentMails.map(mail => (
                                       <Link
                                          key={mail.id}
                                          to={`/mail/${mail.id}`}
                                          onClick={() => setShowNotifications(false)}
                                          className={`block p-4 transition-colors ${mail.isUnread ? 'bg-blue-50/60 dark:bg-accent-blue/10 hover:bg-blue-100/50 dark:hover:bg-accent-blue/20' : 'bg-white dark:bg-[#020617] hover:bg-corporate-50 dark:hover:bg-slate-800'}`}
                                       >
                                          <div className="flex items-start justify-between mb-1">
                                             <span className={`text-sm truncate pr-2 ${mail.isUnread ? 'font-bold text-corporate-900 dark:text-white' : 'font-medium text-corporate-700 dark:text-white'}`}>
                                                {mail.senderDisplay || resolveAlias(mail.senderPubKey)}
                                             </span>
                                             <span className={`text-xs whitespace-nowrap ${mail.isUnread ? 'font-bold text-accent-blue' : 'text-corporate-400 dark:text-white'}`}>{mail.date}</span>
                                          </div>
                                          <p className={`text-xs truncate ${mail.isUnread ? 'text-corporate-900 dark:text-white font-semibold' : 'text-corporate-500 dark:text-white'}`}>{mail.subject}</p>
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
            <div className="relative border-l border-corporate-200 dark:border-white/10 pl-4 ml-2 flex items-center">
               <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 hover:bg-corporate-50 dark:hover:bg-white/5 p-1.5 rounded-xl transition-colors"
               >
                  <div className="h-9 w-9 bg-accent-blue text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                     {user?.name.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                     <p className="text-sm font-bold text-corporate-900 dark:text-white leading-none">{user?.name}</p>
                     <p className="text-xs text-corporate-500 dark:text-white mt-1 leading-none">{user?.identityId || 'Identity View'}</p>
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
                           className="absolute top-14 right-0 w-72 bg-white dark:bg-[#020617] rounded-2xl shadow-xl border border-corporate-200 dark:border-slate-800 overflow-hidden z-50 origin-top-right flex flex-col"
                        >
                           <div className="p-5 border-b border-corporate-100 dark:border-slate-800 bg-corporate-50/50 dark:bg-slate-800/50 flex flex-col items-center">
                              <div className="h-16 w-16 bg-accent-blue text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md mb-3">
                                 {user?.name.charAt(0) || 'U'}
                              </div>
                              <h3 className="font-bold text-base text-corporate-900 dark:text-white">{user?.name}</h3>
                              <p className="text-xs text-corporate-500 dark:text-white">{user?.email}</p>
                           </div>
                           <div className="p-4 border-b border-corporate-100 dark:border-slate-800">
                              <div className="space-y-3">
                                 <div className="flex justify-between items-center text-sm">
                                    <span className="text-corporate-500 dark:text-white">Username</span>
                                    <span className="font-medium text-corporate-700 dark:text-white">{user?.identityId || '-'}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="p-2 bg-corporate-50 dark:bg-[#020617]">
                              <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-colors">
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
