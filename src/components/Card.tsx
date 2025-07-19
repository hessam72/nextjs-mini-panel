'use client';

import React, { ReactNode } from 'react';
import styles from '@STYLES/Card.module.scss';

export type CardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  wide?: boolean;
};

export default function Card({ icon, title, children, wide = false }: CardProps) {
  const className = wide ? styles.cardWide : styles.card;
  return (
    <div className={className}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
