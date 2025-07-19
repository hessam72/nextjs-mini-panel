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
import { User } from '@TYPES';
import Card from '@/components/Card';



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
        style: { fontSize: '1rem', padding: '1rem', direction: 'rtl' }
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



  const cards = [
    { icon: <FiMail />, title: 'ایمیل', content: user.email },
    { icon: <FiPhone />, title: 'تلفن', content: user.phone },
    { icon: <FiPhone />, title: 'همراه', content: user.cell },
    { icon: <FiHash />, title: 'شناسه', content: user.id?.value },
    { icon: <FiMapPin />, title: 'آدرس', content: address, wide: true },
    {
      icon: <FiCalendar />,
      title: 'تاریخ تولد',
      content: `${birthDate} (${user.dob?.age ?? '—'} سال)`,
    },
    {
      icon: <FiCalendar />,
      title: 'عضویت از',
      content: `${joinedDate} (${user.registered?.age ?? '—'} سال)`,
    },
    { icon: <FiGlobe />, title: 'ملیت', content: user.nat },
    { icon: <FiHash />, title: 'IRN شماره', content: user.IRN_NUMBER },
  ];



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
        {cards.map(({ icon, title, content, wide }) => (
          <Card key={title} icon={icon} title={title} wide={wide}>
            {content ?? 'نامشخص'}
          </Card>
        ))}
      </section>
    </div>
  );
}
