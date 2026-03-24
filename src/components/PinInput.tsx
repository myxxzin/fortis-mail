import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface PinInputHandle {
  focus: () => void;
}

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: () => void;
  onEnter?: () => void;
}

const PinInput = forwardRef<PinInputHandle, PinInputProps>(({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false, 
  autoFocus = false,
  onComplete,
  onEnter
}, ref) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      // Focus on the first empty input, or the last input if all filled
      const firstEmptyIndex = value.length < length ? value.length : length - 1;
      setTimeout(() => inputRefs.current[firstEmptyIndex]?.focus(), 10);
    }
  }));

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) {
        let newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
        return;
    }
    
    if (val.length > 1) {
       const digits = val.split('');
       let newValue = value.split('');
       for (let i = 0; i < digits.length; i++) {
           if (index + i < length) newValue[index + i] = digits[i];
       }
       const finalString = newValue.join('').slice(0, length);
       onChange(finalString);
       const nextIndex = Math.min(index + digits.length, length - 1);
       inputRefs.current[nextIndex]?.focus();
       if (finalString.length === length && onComplete) {
           onComplete();
       }
       return;
    }

    let newValue = value.split('');
    newValue[index] = val;
    const finalVal = newValue.join('');
    onChange(finalVal);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else {
      if (finalVal.length === length && onComplete) {
         onComplete();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      let newValue = value.split('');
      if (newValue[index]) {
         newValue[index] = '';
         onChange(newValue.join(''));
      } else if (index > 0) {
         newValue[index - 1] = '';
         onChange(newValue.join(''));
         inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      if (onEnter) onEnter();
      else if (onComplete && value.length === length) onComplete();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
      if (pasteData) {
          onChange(pasteData);
          const nextIndex = Math.min(pasteData.length, length - 1);
          inputRefs.current[nextIndex]?.focus();
      }
  };

  const pins = Array.from({ length }, (_, i) => value[i] || '');

  return (
    <div className="flex space-x-2 sm:space-x-3 justify-center w-full">
      {pins.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={digit ? '●' : ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-xl sm:text-2xl bg-white dark:bg-slate-900 border-2 border-corporate-200 dark:border-slate-700 text-corporate-900 dark:text-white rounded-xl focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all shadow-sm selection:bg-transparent"
        />
      ))}
    </div>
  );
});

export default PinInput;
