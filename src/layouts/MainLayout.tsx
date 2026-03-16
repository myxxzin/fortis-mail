import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { X, Key, Fingerprint, ShieldCheck, Edit2, Save, User as UserIcon, Building2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  const { user, updateProfile } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile edit state
  const [editForm, setEditForm] = useState({
     name: '',
     age: '',
     department: '',
     position: ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        age: user.age ? String(user.age) : '',
        department: user.department || '',
        position: user.position || ''
      });
    }
  }, [user, isEditingProfile]);

  const handleSaveProfile = () => {
     updateProfile({
        name: editForm.name,
        age: editForm.age ? parseInt(editForm.age) : undefined,
        department: editForm.department,
        position: editForm.position
     });
     setIsEditingProfile(false);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen md:flex-row bg-corporate-50 overflow-hidden relative">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Settings Modal - Used to display Profile & Keys */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-corporate-900/40 backdrop-blur-sm p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-surface rounded-2xl shadow-xl border border-corporate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-full"
            >
               <div className="flex items-center justify-between p-6 border-b border-corporate-100 bg-white">
                  <div className="flex items-center space-x-3">
                     <ShieldCheck className="text-accent-blue" size={24} />
                     <h2 className="text-xl font-bold text-corporate-900">Security Center & Profile</h2>
                  </div>
                  <button onClick={() => {setIsSettingsOpen(false); setIsEditingProfile(false);}} className="text-corporate-400 hover:text-corporate-900 rounded-lg p-1 hover:bg-corporate-50 transition-colors">
                     <X size={20} />
                  </button>
               </div>
               
               <div className="p-6 overflow-y-auto space-y-8">
                  {/* Identity Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 flex items-center"><Fingerprint size={16} className="mr-2" /> Your Identity</h3>
                       {!isEditingProfile ? (
                          <button onClick={() => setIsEditingProfile(true)} className="flex items-center text-xs text-accent-blue hover:text-accent-blue-hover font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                             <Edit2 size={14} className="mr-1" /> Edit Profile
                          </button>
                       ) : (
                          <div className="flex space-x-2">
                             <button onClick={() => setIsEditingProfile(false)} className="text-xs text-corporate-500 hover:text-corporate-900 px-3 py-1.5 font-medium transition-colors">Cancel</button>
                             <button onClick={handleSaveProfile} className="flex items-center text-xs text-white bg-accent-blue hover:bg-accent-blue-hover px-4 py-1.5 rounded-lg shadow-sm font-medium transition-all">
                                <Save size={14} className="mr-1" /> Save
                             </button>
                          </div>
                       )}
                    </div>
                    
                    <div className="bg-corporate-50 p-5 rounded-xl border border-corporate-100">
                       {!isEditingProfile ? (
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-xs text-corporate-400 font-medium mb-1">Full Name</p>
                                <p className="font-semibold text-corporate-900">{user.name}</p>
                             </div>
                             <div>
                                <p className="text-xs text-corporate-400 font-medium mb-1">System Email (Immutable)</p>
                                <p className="text-sm font-medium text-corporate-600">{user.email}</p>
                             </div>
                             <div>
                                <p className="text-xs text-corporate-400 font-medium mb-1">Department</p>
                                <p className="text-sm font-medium text-corporate-700 flex items-center"><Building2 size={14} className="mr-1.5 text-corporate-400" /> {user.department || 'Not set'}</p>
                             </div>
                             <div>
                                <p className="text-xs text-corporate-400 font-medium mb-1">Position / Title</p>
                                <p className="text-sm font-medium text-corporate-700 flex items-center"><Briefcase size={14} className="mr-1.5 text-corporate-400" /> {user.position || 'Not set'}</p>
                             </div>
                             <div>
                                <p className="text-xs text-corporate-400 font-medium mb-1">Age</p>
                                <p className="text-sm font-medium text-corporate-700 flex items-center"><UserIcon size={14} className="mr-1.5 text-corporate-400" /> {user.age || 'Not set'}</p>
                             </div>
                          </div>
                       ) : (
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-xs text-corporate-500 font-medium pl-1">Full Name</label>
                                <input type="text" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} className="w-full bg-white border border-corporate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-corporate-400 font-medium pl-1">System Email (Immutable)</label>
                                <input type="text" disabled value={user.email} className="w-full bg-corporate-100 text-corporate-500 border border-corporate-200 rounded-lg px-3 py-2 text-sm cursor-not-allowed" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-corporate-500 font-medium pl-1">Department</label>
                                <div className="relative">
                                   <Building2 className="absolute left-3 top-2.5 text-corporate-400" size={14} />
                                   <input type="text" value={editForm.department} onChange={e=>setEditForm({...editForm, department: e.target.value})} className="w-full bg-white border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" placeholder="e.g. Engineering" />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-corporate-500 font-medium pl-1">Position / Title</label>
                                <div className="relative">
                                   <Briefcase className="absolute left-3 top-2.5 text-corporate-400" size={14} />
                                   <input type="text" value={editForm.position} onChange={e=>setEditForm({...editForm, position: e.target.value})} className="w-full bg-white border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" placeholder="e.g. Senior Dev" />
                                </div>
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-corporate-500 font-medium pl-1">Age</label>
                                <div className="relative">
                                   <UserIcon className="absolute left-3 top-2.5 text-corporate-400" size={14} />
                                   <input type="number" min="0" max="120" value={editForm.age} onChange={e=>setEditForm({...editForm, age: e.target.value})} className="w-full bg-white border border-corporate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all" placeholder="e.g. 28" />
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                  </div>

                  <div>
                     <h3 className="text-sm uppercase tracking-wider font-semibold text-corporate-500 mb-4 flex items-center"><Key size={16} className="mr-2" /> Public Key (Share with senders)</h3>
                     <p className="text-xs text-corporate-500 mb-2 leading-relaxed">Share this key with anyone so they can send encrypted messages specifically to you. Only your private key can decrypt these messages.</p>
                     <div className="relative group">
                       <pre className="text-xs font-mono text-corporate-700 bg-corporate-50 p-4 rounded-xl border border-corporate-200 overflow-x-auto selection:bg-accent-blue selection:text-white pb-10">
                         {user.publicKey}
                       </pre>
                       <button className="absolute bottom-3 right-3 bg-white border border-corporate-200 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm text-corporate-700 hover:text-accent-blue hover:border-accent-blue transition-all">Copy Public Key</button>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-sm uppercase tracking-wider font-semibold text-red-500 mb-4 flex items-center"><Key size={16} className="mr-2" /> Private Key (DO NOT SHARE)</h3>
                     <p className="text-xs text-corporate-500 mb-2 leading-relaxed">This key is derived from your Master Password. It never leaves your device and is used locally to decrypt incoming messages.</p>
                     <div className="relative">
                       <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl cursor-default transition-opacity hover:opacity-0 group">
                          <span className="bg-corporate-900 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-lg group-hover:scale-95 transition-transform">Hover to reveal</span>
                       </div>
                       <pre className="text-xs font-mono text-corporate-700 bg-red-50 p-4 rounded-xl border border-red-100 overflow-x-auto selection:bg-red-500 selection:text-white">
                         {user.privateKey}
                       </pre>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
