'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import styles from '@STYLES/dashboard/page.module.scss';


export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth');
  };

  return (
    <div className={styles.container}>
      <h1>خوش آمدید به داشبورد!</h1>
      <p>شما با موفقیت وارد شده‌اید.</p>
      <div className={styles.actions}>
        <Button onClick={handleLogout}>خروج</Button>
      </div>
    </div>
  );
}
