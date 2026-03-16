import { Link } from 'react-router-dom';
import { Lock, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMail } from '../context/MailContext';

export default function Inbox() {
  const { mails, deleteMail } = useMail();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMail(id);
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-corporate-200 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-corporate-100 flex items-center justify-between bg-white shrink-0">
        <h1 className="text-2xl font-bold text-corporate-900 tracking-tight">Inbox</h1>
        <div className="flex space-x-2">
           <button className="flex items-center space-x-2 px-3 py-1.5 border border-corporate-200 rounded-lg text-sm font-medium text-corporate-700 hover:bg-corporate-50 transition-colors shadow-sm">
              <Filter size={16} />
              <span>Filter</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative bg-corporate-50/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-corporate-100 text-xs uppercase tracking-wider text-corporate-400 bg-corporate-50/50 sticky top-0 z-10 backdrop-blur-md">
              <th className="px-6 py-4 font-semibold w-1/4">Sender</th>
              <th className="px-6 py-4 font-semibold w-2/4">Subject</th>
              <th className="px-6 py-4 font-semibold text-right w-1/4">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-corporate-100 relative">
            <AnimatePresence>
              {mails.map((mail) => (
                <motion.tr 
                  key={mail.id}
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, scaleY: 0.9, backgroundColor: '#fef2f2' }}
                  transition={{ duration: 0.2 }}
                   className={`group hover:bg-white cursor-pointer transition-colors relative ${mail.isUnread ? 'bg-blue-50/20' : 'bg-transparent'}`}
                >
                  <td className="px-6 py-4 p-0">
                    <div className="flex items-center space-x-3 absolute inset-0 pl-6 pointer-events-none">
                      <div className={mail.isUnread ? "text-accent-blue" : "text-corporate-400"}><Lock size={16} /></div>
                      <span className={`text-sm ${mail.isUnread ? 'font-bold text-corporate-900' : 'font-medium text-corporate-700'}`}>
                        {mail.sender}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 p-0">
                    <Link to={`/mail/${mail.id}`} className={`text-sm flex items-center h-14 w-full ${mail.isUnread ? 'font-bold text-corporate-900' : 'text-corporate-600'} group-hover:text-accent-blue transition-colors`}>
                      {mail.subject}
                    </Link>
                  </td>
                  <td className="px-6 py-4 p-0 relative h-14">
                    <div className="absolute inset-y-0 right-6 flex items-center justify-end space-x-4">
                       <span className={`text-sm ${mail.isUnread ? 'font-bold text-corporate-900' : 'text-corporate-500'}`}>{mail.date}</span>
                       <button 
                         onClick={(e) => handleDelete(e, mail.id)}
                         className="opacity-0 group-hover:opacity-100 p-2 text-corporate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                         title="Delete message"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {mails.length === 0 && (
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
          >
             <div className="w-16 h-16 bg-corporate-50 border border-corporate-200 rounded-full flex items-center justify-center mb-4 text-corporate-300">
                <Lock size={32} />
             </div>
             <p className="text-corporate-900 font-medium">Your inbox is empty</p>
             <p className="text-sm text-corporate-500 mt-1">When you receive a secure message, it will appear here.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
