import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PinInput from './PinInput';
import type { PinInputHandle } from './PinInput';

export default function ChangePinModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const confirmPinRef = useRef<PinInputHandle>(null);

  const verifyCurrentPin = async (autoVal?: string | any) => {
    const pinToVerify = typeof autoVal === 'string' ? autoVal : currentPin;
    if (pinToVerify.length !== 6 || !/^\d+$/.test(pinToVerify)) {
      toast.error(t('onboarding.errPinLength'));
      return;
    }
    
    // Hash and verify
    const enc = new TextEncoder();
    const pinData = enc.encode(pinToVerify + (user?.identityId || ''));
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', pinData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const currentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (currentHash !== user?.pinHash) {
      toast.error(t('settings.errCurrentPin'));
      return;
    }

    setStep(2);
  };

  const handleFinish = async (autoVal?: string | any) => {
    const pinToVerify = typeof autoVal === 'string' ? autoVal : confirmPin;
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast.error(t('onboarding.errPinLength'));
      return;
    }
    if (newPin !== pinToVerify) {
      toast.error(t('settings.pinNotMatch'));
      return;
    }

    setIsSaving(true);
    try {
      const enc = new TextEncoder();
      const pinData = enc.encode(newPin + (user?.identityId || ''));
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', pinData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const pinHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      await updateProfile({
        pinHash: pinHash
      });
      
      toast.success(t('onboarding.success'));
      onClose();
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
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-corporate-400 dark:text-gray-500 hover:text-corporate-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-corporate-50 dark:hover:bg-white/10"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-corporate-900 dark:text-white mb-2">
              {t('settings.changePinTitle')}
            </h2>
            <p className="text-sm text-corporate-500 dark:text-gray-400">
              {t('settings.changePinSubtitle')}
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
                <label className="block text-sm font-medium text-corporate-700 dark:text-gray-300 mb-2 text-center">
                  {t('settings.currentPin')}
                </label>
                <div className="mb-6">
                  <PinInput 
                    value={currentPin} 
                    onChange={setCurrentPin} 
                    autoFocus={true} 
                    onComplete={verifyCurrentPin}
                    onEnter={verifyCurrentPin}
                  />
                </div>
              </div>

              <button
                onClick={verifyCurrentPin}
                className="w-full bg-accent-blue hover:bg-accent-blue-hover text-white py-3 rounded-xl font-semibold transition-all shadow-md shadow-accent-blue/20 hover:shadow-lg hover:shadow-accent-blue/30 active:scale-[0.98]"
              >
                {t('onboarding.next')}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-corporate-700 dark:text-gray-300 mb-2 text-center">
                  {t('settings.newPin')}
                </label>
                <div className="mb-6">
                  <PinInput 
                    value={newPin} 
                    onChange={setNewPin} 
                    autoFocus={true} 
                    onComplete={() => confirmPinRef.current?.focus()}
                    onEnter={() => confirmPinRef.current?.focus()}
                  />
                </div>
                
                <label className="block text-sm font-medium text-corporate-700 dark:text-gray-300 mb-2 text-center">
                  {t('settings.confirmPin')}
                </label>
                <div>
                  <PinInput 
                    ref={confirmPinRef}
                    value={confirmPin} 
                    onChange={setConfirmPin} 
                    onEnter={handleFinish}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
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
