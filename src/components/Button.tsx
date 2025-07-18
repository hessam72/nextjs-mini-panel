'use client';
import React from 'react';
import styles from '@STYLES/Button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export default function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
