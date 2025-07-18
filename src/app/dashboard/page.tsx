'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiMail,
  FiPhone,
  FiHash,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiGlobe,
  FiLogOut,
} from 'react-icons/fi';
import Button from '@/components/Button';
import styles from '@STYLES/dashboard/page.module.scss';
import toast from 'react-hot-toast';

type User = {
  name?: { title?: string; first?: string; last?: string };
  gender?: string;
  dob?: { date: string; age: number };
  registered?: { date: string; age: number };
  location?: {
    street?: { number?: number; name?: string };
    city?: string;
    state?: string;
    country?: string;
    postcode?: string | number;
    timezone?: { offset?: string; description?: string };
  };
  email?: string;
  phone?: string;
  cell?: string;
  id?: { name?: string; value?: string };
  picture?: { large?: string };
  nat?: string;
  IRN_NUMBER?: string;
  status: 'logged_in' | 'logged_out';
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentIRN = localStorage.getItem('currentIRN');
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const u = users.find(u => u.IRN_NUMBER === currentIRN);
    if (!u || u.status !== 'logged_in') {
      toast.error(`به منظور دسترسی به داشبورد وارد شوید`, {
        duration: 4000,
        style: { fontSize: '1rem', padding: '1rem',direction:'rtl' }
      });
      router.replace('/auth');
      return;
    }
    setUser(u);
  }, [router]);

  const handleLogout = () => {
    const currentIRN = localStorage.getItem('currentIRN');
    if (!currentIRN) return;
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map(u =>
      u.IRN_NUMBER === currentIRN
        ? { ...u, status: 'logged_out' }
        : u
    );
    localStorage.setItem('users', JSON.stringify(updated));
    localStorage.removeItem('currentIRN');
    router.push('/auth');
  };

  if (!user) return null;

  const fullName =
    [user.name?.title, user.name?.first, user.name?.last]
      .filter(Boolean)
      .join(' ') || 'نامشخص';

  const joinedDate = user.registered
    ? new Date(user.registered.date).toLocaleDateString('fa-IR')
    : 'نامشخص';

  const birthDate = user.dob
    ? new Date(user.dob.date).toLocaleDateString('fa-IR')
    : 'نامشخص';

  const address = user.location
    ? `${user.location.street?.number || ''} ${user.location.street?.name || ''}, ${user.location.city}, ${user.location.state}`
    : 'نامشخص';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.avatarWrapper}>
          {user.picture?.large
            ? <img src={user.picture.large} alt="Avatar" className={styles.avatar} />
            : <FiUser className={styles.avatarIcon} />
          }
        </div>
        <h1 className={styles.name}>{fullName}</h1>
        <Button onClick={handleLogout} >
          <FiLogOut className={styles.logoutIcon} /> خروج
        </Button>
      </header>

      <section className={styles.infoGrid}>
        <div className={styles.card}>
          <FiMail className={styles.icon} />
          <h2>ایمیل</h2>
          <p>{user.email || 'نامشخص'}</p>
        </div>
        <div className={styles.card}>
          <FiPhone className={styles.icon} />
          <h2>تلفن</h2>
          <p>{user.phone || 'نامشخص'}</p>
        </div>
        <div className={styles.card}>
          <FiPhone className={styles.icon} />
          <h2>همراه</h2>
          <p>{user.cell || 'نامشخص'}</p>
        </div>
        <div className={styles.card}>
          <FiHash className={styles.icon} />
          <h2>شناسه</h2>
          <p>{user.id?.value || 'نامشخص'}</p>
        </div>
        <div className={styles.cardWide}>
          <FiMapPin className={styles.icon} />
          <h2>آدرس</h2>
          <p>{address}</p>
        </div>
        <div className={styles.card}>
          <FiCalendar className={styles.icon} />
          <h2>تاریخ تولد</h2>
          <p>{birthDate} ({user.dob?.age || '—'} سال)</p>
        </div>
        <div className={styles.card}>
          <FiCalendar className={styles.icon} />
          <h2>عضویت از</h2>
          <p>{joinedDate} ({user.registered?.age || '—'} سال)</p>
        </div>
        <div className={styles.card}>
          <FiGlobe className={styles.icon} />
          <h2>ملیت</h2>
          <p>{user.nat || 'نامشخص'}</p>
        </div>
        <div className={styles.card}>
          <FiHash className={styles.icon} />
          <h2>IRN شماره</h2>
          <p>{user.IRN_NUMBER}</p>
        </div>
      </section>
    </div>
  );
}
