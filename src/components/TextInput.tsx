'use client';
import React from 'react';
import styles from '@STYLES/TextInput.module.scss';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

type TextInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isValid?: boolean;
};

export default function TextInput({
  label,
  value,
  onChange,
  error,
  isValid = false,
}: TextInputProps) {
  // Determine classes
  const inputClasses = [
    styles.input,
    error ? styles.error : isValid ? styles.valid : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          className={inputClasses}
          type="text"
          value={value}
          onChange={onChange}
        />
        {/* Icons */}
        {isValid && !error && (
          <FiCheckCircle className={styles.iconSuccess} />
        )}
        {error && (
          <FiXCircle className={styles.iconError} />
        )}
      </div>
      {error && <div className={styles.errorMsg}>{error}</div>}
    </div>
  );
}
