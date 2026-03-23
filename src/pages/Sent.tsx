import { Lock, Check, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMail } from '../context/MailContext';
import { useContacts } from '../context/ContactContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Sent() {
  const { sentMails, deliveryAcks } = useMail();
  const { contacts } = useContacts();
  const { t } = useLanguage();

  const resolveAlias = (pubKey: string) => {
    if (pubKey === 'System Key') return 'System';
    const contact = contacts.find(c => c.publicKey === pubKey);
    return contact ? contact.alias : pubKey.substring(0, 24) + '...';
  };

  return (
    <div className="bg-surface dark:bg-[#020617] rounded-2xl shadow-sm border border-corporate-200 dark:border-white/10 flex flex-col h-full overflow-hidden relative transition-colors duration-300">
      <div className="p-6 border-b border-corporate-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#020617] shrink-0 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-corporate-900 dark:text-white tracking-tight">{t('sidebar.sent')}</h1>
      </div>

      <div className="flex-1 overflow-auto bg-corporate-50/20 dark:bg-transparent transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-corporate-100 dark:border-white/10 text-xs uppercase tracking-wider text-corporate-400 dark:text-white bg-corporate-50/50 dark:bg-white/5 transition-colors duration-300">
              <th className="px-6 py-4 font-semibold w-1/4">{t('mail.recipient')}</th>
              <th className="px-6 py-4 font-semibold w-2/4">{t('mail.subject')}</th>
              <th className="px-6 py-4 font-semibold text-right w-1/4">{t('mail.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-corporate-100 dark:divide-white/5 bg-white dark:bg-transparent">
            {sentMails.map((mail) => (
              <tr
                key={mail.id}
                className="group hover:bg-corporate-50/80 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4.5">
                  <div className="flex items-center space-x-3">
                    <div className="text-corporate-400 dark:text-white"><Lock size={16} /></div>
                    <span className="text-sm font-medium text-corporate-700 dark:text-white">
                      {resolveAlias(mail.recipientPubKey)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <Link to={`/mail/${mail.id}`} className="text-sm block w-full text-corporate-600 dark:text-white group-hover:text-accent-blue dark:group-hover:text-accent-blue transition-colors">
                    {mail.subject}
                  </Link>
                </td>
                <td className="px-6 py-4.5 text-right text-sm text-corporate-500 dark:text-white whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-2">
                    <span>{mail.date}</span>
                    {deliveryAcks?.some(ack => ack.mailId === mail.id) ? (
                      <div className="flex items-center text-accent-blue" title="Delivered & Cryptographically ACKed">
                        <CheckCheck size={16} />
                      </div>
                    ) : (
                      <div className="flex items-center text-corporate-400 dark:text-white" title="Sent (Unverified Receipt)">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sentMails.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none"
          >
            <div className="w-16 h-16 bg-corporate-50 dark:bg-white/5 border border-corporate-200 dark:border-white/10 rounded-full flex items-center justify-center mb-4 text-corporate-300 dark:text-white">
              <Lock size={32} />
            </div>
            <p className="text-corporate-900 dark:text-white font-medium">{t('mail.emptySent')}</p>
            <p className="text-sm text-corporate-500 dark:text-white mt-1">{t('mail.emptySentDesc')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
