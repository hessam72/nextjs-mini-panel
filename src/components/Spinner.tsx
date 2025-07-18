'use client';
import React from 'react';
import styles from '@STYLES/Spinner.module.scss';

export default function Spinner() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
}
