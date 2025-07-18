'use client';
import React, { useState } from 'react';
import styles from '@STYLES/OTPInput.module.scss';
import Button from '@/components/Button';

type OTPInputProps = {
  onVerify: (code: string) => void;
  error?: string;
};

export default function OTPInput({ onVerify, error }: OTPInputProps) {
  const [code, setCode] = useState('');
  return (
    <div className={styles.container}>
      <h2>کد تأیید را وارد کنید</h2>
      <input
        type="text"
        maxLength={6}
        value={code}
        onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
        className={styles.input}
      />
      {error && <div className={styles.error}>{error}</div>}
      <Button onClick={() => onVerify(code)}>تأیید کد</Button>
    </div>
  );
}
