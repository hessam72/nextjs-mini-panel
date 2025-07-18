'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import styles from '@STYLES/dashboard/page.module.scss';

type User = {
  name?: { title?: string; first?: string; last?: string };
  email?: string;
  phone?: string;
  status: 'logged_in' | 'logged_out';
  picture?: { large?: string };
  IRN_NUMBER?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // On mount, load user or redirect
  useEffect(() => {
    const currentIRN = localStorage.getItem('currentIRN');
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const u = users.find(u => u.IRN_NUMBER === currentIRN)
    if (!u || u.status !== 'logged_in') {
      return router.push('/auth');
    }
    setUser(u);
  }, [router]);




  const handleLogout = () => {
    const currentIRN = localStorage.getItem('currentIRN');
    if (!currentIRN) return;

    // Load, update, save
    const users: User[] = JSON.parse(localStorage.getItem('users')!);
    const updated = users.map(u =>
      u.IRN_NUMBER === currentIRN
        ? { ...u, status: 'logged_out' }
        : u
    );
    localStorage.setItem('users', JSON.stringify(updated));

    // Clear active user marker
    localStorage.removeItem('currentIRN');
    router.push('/auth');
  };


  if (!user) return null;


  // Safely extract or fallback
  const fullName = [
    user.name?.title,
    user.name?.first,
    user.name?.last,
  ]
    .filter(Boolean)
    .join(' ') || 'نامشخص';

  const avatar = user.picture?.large || '/default-avatar.png';
  const email = user.email || 'نامشخص';
  const phone = user.phone || user.IRN_NUMBER || 'نامشخص';
  const irn = user.IRN_NUMBER || 'نامشخص';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          <img src={avatar} alt="User Avatar" className={styles.avatar} />
        </div>
        <h1 className={styles.name}>{fullName}</h1>
        <Button onClick={handleLogout}>خروج</Button>
      </header>

      <section className={styles.infoGrid}>
        <div className={styles.card}>
          <h2>ایمیل</h2>
          <p>{email}</p>
        </div>
        <div className={styles.card}>
          <h2>شماره تلفن</h2>
          <p>{phone}</p>
        </div>
        <div className={styles.card}>
          <h2>IRN شماره </h2>
          <p>{irn}</p>
        </div>
      </section>
    </div>
  );
}
