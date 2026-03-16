import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockSentMails = [
  { id: 'sent-1', recipient: 'External Partner', subject: 'Project Alpha Final Deliverable', date: 'Oct 14' },
  { id: 'sent-2', recipient: 'HR Manager', subject: 'Re: Q3 Bonus Allocation', date: 'Oct 12' },
];

export default function Sent() {
  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-corporate-200 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-corporate-100 flex items-center justify-between bg-white shrink-0">
        <h1 className="text-2xl font-bold text-corporate-900 tracking-tight">Sent Messages</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-corporate-100 text-xs uppercase tracking-wider text-corporate-400 bg-corporate-50/50">
              <th className="px-6 py-4 font-semibold w-1/4">To</th>
              <th className="px-6 py-4 font-semibold w-2/4">Subject</th>
              <th className="px-6 py-4 font-semibold text-right w-1/4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-corporate-100">
            {mockSentMails.map((mail) => (
              <tr 
                key={mail.id} 
                className="group hover:bg-corporate-50/80 cursor-pointer transition-colors bg-white"
              >
                <td className="px-6 py-4.5">
                  <div className="flex items-center space-x-3">
                    <div className="text-corporate-400"><Lock size={16} /></div>
                    <span className="text-sm font-medium text-corporate-700">
                      {mail.recipient}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <Link to={`/mail/${mail.id}`} className="text-sm block w-full text-corporate-600 group-hover:text-accent-blue transition-colors">
                    {mail.subject}
                  </Link>
                </td>
                <td className="px-6 py-4.5 text-right text-sm text-corporate-500 whitespace-nowrap">
                  <span>{mail.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
