'use client';
import React from 'react';
import styles from '@STYLES/TextInput.module.scss';

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
  // Build class: default + error or valid
  const classNames = [
    styles.input,
    error ? styles.error : isValid ? styles.valid : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        className={classNames}
        type="text"
        value={value}
        onChange={onChange}
      />
      {error && <div className={styles.errorMsg}>{error}</div>}
    </div>
  );
}
