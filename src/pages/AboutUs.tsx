import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Users, Target, Eye, ShieldCheck, Zap, Handshake, Globe, Lock, X, Mail, Facebook, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutUs() {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const teamMembers = [
    { 
      name: t('landing.team.member1'), 
      role: t('landing.team.role1'), 
      img: '/dat.jpg', 
      initial: 'VĐ',
      contact: {
        linkedin: 'https://www.linkedin.com/in/nguyenthimyvien/',
        email: 'mailto:nguyenvien.work@gmail.com'
      }
    },
    { 
      name: t('landing.team.member2'), 
      role: t('landing.team.role2'), 
      img: '/huy.jpg', 
      initial: 'ĐH',
      contact: {
        linkedin: 'https://www.linkedin.com/in/tr%C3%A0-l%C3%AA-108568332/',
        email: 'mailto:bichtrapy20@gmail.com'
      }
    },
    { 
      name: t('landing.team.member3'), 
      role: t('landing.team.role3'), 
      img: '/quan.jpg', 
      initial: 'PQ',
      contact: {
        linkedin: 'https://www.linkedin.com/in/nga-van-b84675315/',
        email: 'mailto:ngavan2208@gmail.com'
      }
    },
    { 
      name: t('landing.team.member4'), 
      role: t('landing.team.role4'), 
      img: '/quy.jpg', 
      initial: 'HQ',
      contact: {
        linkedin: 'https://www.linkedin.com/in/quynh-nguyen-thi-diem-8989963b9',
        email: 'mailto:quynhnguyen.06042000@gmail.com'
      }
    },
    { 
      name: t('landing.team.member5'), 
      role: t('landing.team.role5'), 
      img: '/member5.jpg', 
      initial: 'M5',
      contact: {
        linkedin: 'https://www.linkedin.com/in/harrison1502/',
        email: 'mailto:vohieunghia1502@gmail.com'
      }
    },
    { 
      name: t('landing.team.member6'), 
      role: t('landing.team.role6'), 
      img: '/member6.jpg', 
      initial: 'M6',
      contact: {
        linkedin: 'https://www.linkedin.com/in/voquanghuy/',
        email: 'mailto:huyvo.300605@gmail.com'
      }
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-full pb-10 overflow-y-auto hide-scrollbar">
      {/* Header aligned with the mockup */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-corporate-900 dark:text-white mb-2">
          About FortisMail
        </h1>
        <div className="text-sm font-medium text-corporate-600 dark:text-corporate-400 flex items-center gap-2">
          <span>Secure</span>
          <span className="w-1 h-1 rounded-full bg-corporate-400 dark:bg-corporate-600"></span>
          <span>Private</span>
          <span className="w-1 h-1 rounded-full bg-corporate-400 dark:bg-corporate-600"></span>
          <span>Reliable</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full pr-2">

        {/* Meet Our Team */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Users className="text-[#43cc25] dark:text-[#52e033]" size={20} />
            <h2 className="text-base font-bold text-corporate-900 dark:text-white">Meet Our Team</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative w-full bg-white dark:bg-slate-900 border border-corporate-200 dark:border-white/10 rounded-[1.25rem] flex flex-col items-center justify-center py-6 px-4 shadow-sm">
                <div className="w-[84px] h-[84px] rounded-full bg-corporate-200 dark:bg-slate-700 mb-4 overflow-hidden flex items-center justify-center shrink-0">
                  {member.img ? (
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="text-corporate-500 dark:text-corporate-300 font-bold text-3xl">{member.initial}</span>
                  )}
                </div>
                <h3 className="font-bold text-corporate-900 dark:text-white text-[15px] mb-1 text-center">{member.name}</h3>
                <p className="text-[13px] text-corporate-500 dark:text-corporate-400 text-center">{member.role}</p>
                
                {/* View Profile Hover Button */}
                <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px]">
                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-corporate-900 dark:text-white px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-corporate-100 dark:border-slate-700 font-bold text-[13px] whitespace-nowrap hover:scale-105 transition-transform"
                    >
                      <Eye size={15} className="text-corporate-500 dark:text-corporate-400" /> View profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Our Mission */}
          <div className="bg-white dark:bg-slate-900 border border-corporate-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-[#43cc25] dark:text-[#52e033]" size={18} />
              <h2 className="text-[14px] font-bold text-corporate-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-[13px] text-corporate-700 dark:text-slate-300 font-medium leading-relaxed">
              To protect user data and deliver fast, secure messaging.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-white dark:bg-slate-900 border border-corporate-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="text-[#43cc25] dark:text-[#52e033]" size={18} />
              <h2 className="text-[14px] font-bold text-corporate-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-[13px] text-corporate-700 dark:text-slate-300 font-medium leading-relaxed">
              To become a trusted platform for safe digital communication.
            </p>
          </div>
        </div>

        {/* Core Values and Why FortisMail Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          
          {/* Our Core Values */}
          <div>
            <h2 className="text-[14px] font-bold text-corporate-900 dark:text-white mb-3 px-1">Our Core Values</h2>
            <div className="grid grid-cols-2 gap-3">
              
              <div className="bg-white dark:bg-slate-900 border border-corporate-200 dark:border-white/10 shadow-sm rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="text-[#43cc25] dark:text-[#52e033] shrink-0" size={18} />
                  <div>
                    <h3 className="text-[13px] font-bold text-corporate-900 dark:text-white mb-0.5">Security First</h3>
                    <p className="text-[12px] text-corporate-500 dark:text-slate-400">Manage security</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-corporate-200 dark:border-white/10 shadow-sm rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Zap className="text-[#43cc25] dark:text-[#52e033] shrink-0" size={18} />
                  <div>
                    <h3 className="text-[13px] font-bold text-corporate-900 dark:text-white mb-0.5">Performance</h3>
                    <p className="text-[12px] text-corporate-500 dark:text-slate-400">Speed experience</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-corporate-200 dark:border-white/10 shadow-sm rounded-xl p-4 flex items-center">
                <div className="flex items-start gap-2">
                  <Handshake className="text-[#43cc25] dark:text-[#52e033] shrink-0" size={18} />
                  <div>
                    <h3 className="text-[13px] font-bold text-corporate-900 dark:text-white leading-tight mt-0.5">Trust &<br/>Transparency</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-corporate-200 dark:border-white/10 shadow-sm rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Globe className="text-[#43cc25] dark:text-[#52e033] shrink-0" size={18} />
                  <div>
                    <h3 className="text-[13px] font-bold text-corporate-900 dark:text-white mb-0.5">User Focus</h3>
                    <p className="text-[12px] text-corporate-500 dark:text-slate-400">More security</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Why FortisMail Table */}
          <div>
            <h2 className="text-[14px] font-bold text-corporate-900 dark:text-white mb-3 px-1">Why FortisMail?</h2>
            <div className="overflow-hidden rounded-xl border border-corporate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-900">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#f8fafc] dark:bg-slate-800 text-corporate-700 dark:text-slate-300 border-b border-corporate-200 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-[40%]">Protect</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-corporate-100 dark:divide-white/5">
                  <tr className="hover:bg-corporate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-corporate-900 dark:text-white flex items-center gap-2">
                      <Lock size={14} className="text-corporate-500 dark:text-corporate-400" /> Encryption
                    </td>
                    <td className="px-4 py-3 text-corporate-600 dark:text-slate-400">End-to-end protection</td>
                  </tr>
                  <tr className="hover:bg-corporate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-corporate-900 dark:text-white flex items-center gap-2">
                      <Zap size={14} className="text-corporate-500 dark:text-corporate-400" /> Speed
                    </td>
                    <td className="px-4 py-3 text-corporate-600 dark:text-slate-400">Fast and reliable delivery</td>
                  </tr>
                  <tr className="hover:bg-corporate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-corporate-900 dark:text-white flex items-center gap-2">
                      <Eye size={14} className="text-corporate-500 dark:text-corporate-400" /> Privacy
                    </td>
                    <td className="px-4 py-3 text-corporate-600 dark:text-slate-400">No tracking, full privacy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

      </div>

      {/* Profile Modal */}
      {selectedMember && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMember(null)}></div>
          
          <div className="relative bg-white dark:bg-slate-900 border border-corporate-200 dark:border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-corporate-400 hover:text-corporate-900 dark:hover:text-white bg-transparent hover:bg-corporate-50 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-[84px] h-[84px] rounded-full bg-corporate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {selectedMember.img ? (
                    <img src={selectedMember.img} alt={selectedMember.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="text-corporate-500 dark:text-corporate-300 font-bold text-3xl">{selectedMember.initial}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-corporate-900 dark:text-white mb-1 leading-tight">{selectedMember.name}</h3>
                  <p className="text-sm font-medium text-corporate-500 dark:text-corporate-400">{selectedMember.role}</p>
                </div>
              </div>
              
              <hr className="border-corporate-100 dark:border-slate-800 mb-6" />
              
              <div>
                <h4 className="text-[15px] font-bold text-corporate-900 dark:text-white mb-4">Contact</h4>
                <div className="flex items-center gap-3">
                  {/* Facebook */}
                  {selectedMember.contact?.facebook && (
                    <a href={selectedMember.contact.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-colors">
                      <Facebook size={20} className="fill-current" />
                    </a>
                  )}
                  {/* LinkedIn */}
                  {selectedMember.contact?.linkedin && (
                    <a href={selectedMember.contact.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors">
                      <Linkedin size={20} className="fill-current" />
                    </a>
                  )}
                  {/* Gmail */}
                  {selectedMember.contact?.email && (
                    <a href={selectedMember.contact.email} className="w-10 h-10 rounded-xl bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335] hover:text-white flex items-center justify-center transition-colors">
                      <Mail size={20} />
                    </a>
                  )}
                  
                  {/* Fallback pattern */}
                  {!selectedMember.contact && (
                    <span className="text-sm italic text-corporate-500">Contact information processing...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

