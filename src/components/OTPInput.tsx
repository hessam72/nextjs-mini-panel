'use client';
import React, { useState, useRef } from 'react';
import styles from '@STYLES/OTPInput.module.scss';
import Button from '@/components/Button';

type OTPInputProps = {
  onVerify: (code: string) => void;
  error?: string;
};

export default function OTPInput({ onVerify, error }: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // When all four digits filled, auto‑submit or enable verify
  const fullCode = digits.join('');

  // Focus next on input
  const handleChange = (idx: number, val: string) => {
    if (!/^\d$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    // move focus
    if (idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  // Handle backspace to move back
  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && digits[idx] === '') {
      if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
    }
  };

  // Paste support
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').trim().slice(0,4);
    if (/^\d{4}$/.test(paste)) {
      const arr = paste.split('');
      setDigits(arr);
      setTimeout(() => inputsRef.current[3]?.focus(), 0);
    }
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <h2>کد تأیید را وارد کنید</h2>
      <div className={styles.inputs} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={styles.box}
            value={d}
            ref={el => { inputsRef.current[i] = el }}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
          />
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Button
        onClick={() => onVerify(fullCode)}
        disabled={fullCode.length < 4}
      >
        تأیید کد
      </Button>
    </div>
  );
}
