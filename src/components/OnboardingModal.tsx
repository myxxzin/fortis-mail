import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PinInput from './PinInput';
import type { PinInputHandle } from './PinInput';
export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [alias, setAlias] = useState(user?.name || '');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const confirmPinRef = useRef<PinInputHandle>(null);

  const isAliasSet = user?.name !== user?.identityId && !!user?.name;
  const isPinSet = !!user?.pinHash;

  // Initialize step based on what's missing
  useState(() => {
    if (isAliasSet && !isPinSet) setStep(2);
  });

  const handleNext = () => {
    if (!alias.trim()) {
      toast.error(t('onboarding.errAliasEmpty'));
      return;
    }
    setStep(2);
  };

  const handleFinish = async () => {
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      toast.error(t('onboarding.errPinLength'));
      return;
    }
    if (pin !== confirmPin) {
      toast.error(t('onboarding.errPinMatch'));
      return;
    }

    setIsSaving(true);
    try {
      // Hash the PIN simply with crypto.subtle for local storage / firestore
      const enc = new TextEncoder();
      const pinData = enc.encode(pin + (user?.identityId || ''));
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', pinData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const pinHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      await updateProfile({
        name: alias,
        alias: alias,
        pinHash: pinHash
      });
      
      toast.success(t('onboarding.success'));
      onComplete();
    } catch (error) {
       toast.error(t('onboarding.errorSave'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-corporate-900/40 dark:bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-corporate-200 dark:border-slate-800 w-full max-w-md overflow-hidden relative"
      >
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-corporate-900 dark:text-white mb-2">
              {t('onboarding.title')}
            </h2>
            <p className="text-sm text-corporate-500 dark:text-gray-400">
              {t('onboarding.subtitle')}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step === 1 ? 'bg-accent-blue text-white ring-4 ring-blue-50 dark:ring-accent-blue/20' : 'bg-green-500 text-white'}`}>
              {step > 1 ? <CheckCircle2 size={16} /> : '1'}
            </div>
            <div className={`w-16 h-1 mx-2 rounded-full ${step > 1 ? 'bg-green-500' : 'bg-corporate-100 dark:bg-slate-800'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step === 2 ? 'bg-accent-blue text-white ring-4 ring-blue-50 dark:ring-accent-blue/20' : 'bg-corporate-100 dark:bg-slate-800 text-corporate-400 dark:text-slate-500'}`}>
              2
            </div>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-corporate-700 dark:text-gray-300 mb-2">
                  {t('onboarding.aliasLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-corporate-400" />
                  </div>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                    placeholder={t('onboarding.aliasPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 bg-corporate-50 dark:bg-slate-800 border border-corporate-200 dark:border-slate-700 text-corporate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all font-medium"
                  />
                </div>
                <p className="mt-2 text-xs text-corporate-500 dark:text-gray-400 flex items-start">
                  <AlertCircle size={14} className="mr-1 shrink-0 mt-0.5" />
                  {t('onboarding.aliasHelp')}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3 rounded-xl font-semibold transition-all shadow-md shadow-accent-blue/20 hover:shadow-lg hover:shadow-accent-blue/30 active:scale-[0.98]"
              >
                {t('onboarding.next')}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-corporate-700 dark:text-gray-300 mb-2">
                  {t('onboarding.pinLabel')}
                </label>
                <div className="mb-6">
                  <PinInput 
                    value={pin} 
                    onChange={setPin} 
                    autoFocus={true} 
                    onComplete={() => confirmPinRef.current?.focus()}
                    onEnter={() => confirmPinRef.current?.focus()}
                  />
                </div>
                
                <label className="block text-sm font-medium text-corporate-700 dark:text-gray-300 mb-2">
                  {t('onboarding.confirmPinLabel')}
                </label>
                <div>
                  <PinInput 
                    ref={confirmPinRef}
                    value={confirmPin} 
                    onChange={setConfirmPin} 
                    onEnter={handleFinish}
                  />
                </div>

                <p className="mt-6 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-start">
                  <AlertCircle size={16} className="mr-2 shrink-0 mt-0.5" />
                  {t('onboarding.pinHelp')}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-corporate-100 dark:bg-slate-800 text-corporate-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-corporate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('onboarding.back')}
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isSaving}
                  className="flex-1 bg-accent-blue hover:bg-accent-blue-hover text-white py-3 rounded-xl font-semibold transition-all shadow-md shadow-accent-blue/20 hover:shadow-lg hover:shadow-accent-blue/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSaving ? t('onboarding.saving') : t('onboarding.finish')}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
