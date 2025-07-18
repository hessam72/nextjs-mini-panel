'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@STYLES/auth/page.module.scss';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import OTPInput from '@/components/OTPInput';
import {  User } from '@TYPES';
import { FiUser, FiPhone, FiLogIn } from 'react-icons/fi';

// Normalize Persian digits → Latin
const normalizeDigits = (str: string) =>
  str.replace(/[\u06F0-\u06F9]/g, d =>
    String.fromCharCode(d.charCodeAt(0) - 0x06F0 + 48)
  );



export default function AuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);



  // only guest users can visit this page
  useEffect(() => {
    const currentIRN = localStorage.getItem('currentIRN');
    if (!currentIRN) return;                 // no one’s in session
    const users: User[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );
    const me = users.find(u => u.IRN_NUMBER === currentIRN);
    if (me?.status === 'logged_in') {
      router.replace('/dashboard');
    }
  }, [router]);


  // Live phone validation
  useEffect(() => {
    const input = phone.trim();
    if (!input) {
      setError(''); setIsValid(false); return;
    }
    if (!/^[+\u06F0-\u06F90-9]+$/.test(input)) {
      setError('فقط اعداد و علامت + مجاز است'); setIsValid(false); return;
    }
    const normalized = normalizeDigits(input);
    if (!/^(\+98|09)/.test(normalized)) {
      setError('فرمت باید با +98 یا 09 شروع شود'); setIsValid(false); return;
    }
    const digits = normalized.startsWith('+') ? normalized.slice(1) : normalized;
    if (normalized.startsWith('+98')) {
      if (!/^\d{12}$/.test(digits)) {
        setError('برای +98، باید 12 رقم وارد شود'); setIsValid(false); return;
      }
    } else {
      if (!/^\d{11}$/.test(digits)) {
        setError('برای 09، باید 11 رقم وارد شود'); setIsValid(false); return;
      }
    }
    setError(''); setIsValid(true);
  }, [phone]);

  // Main submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    const normalizedPhone = normalizeDigits(phone.trim());
    // Load stored users array
    const users: User[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );
    const existing = users.find(u => u.IRN_NUMBER === normalizedPhone);

    if (existing) {
      // OTP flow for existing user
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('otp', otp);
      localStorage.setItem('currentIRN', normalizedPhone);
      alert(`کد ورود شما: ${otp}`);
      setPendingUser(existing);
      setOtpMode(true);
      return;
    }

    // New user flow
    setLoading(true);
    try {
      const res = await fetch(
        'https://randomuser.me/api/?results=1&nat=us'
      );
      const { results } = await res.json();
      const newUser: User = {
        ...results[0],
        IRN_NUMBER: normalizedPhone,
        status: 'logged_in',
      };
      // Append and persist
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentIRN', normalizedPhone);
      router.push('/dashboard');
    } catch {
      setError('خطا در ورود، دوباره تلاش کنید');
      setLoading(false);
    }
  };

  // OTP verification handler
  const handleOtpVerify = (code: string) => {
    const realOtp = localStorage.getItem('otp');
    const currentIRN = localStorage.getItem('currentIRN');
    if (code === realOtp && pendingUser && currentIRN) {
      // Mark user logged_in in array
      const users: User[] = JSON.parse(
        localStorage.getItem('users') || '[]'
      );
      const updated = users.map(u =>
        u.IRN_NUMBER === currentIRN
          ? { ...u, status: 'logged_in' }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updated));
      localStorage.removeItem('otp');
      router.push('/dashboard');
    } else {
      setError('کد اشتباه است');
    }
  };



return (
  <div className={styles.page}>
    {loading && <Spinner />}

    <div className={styles.card}>
      {otpMode ? (
        <OTPInput onVerify={handleOtpVerify} error={error} />
      ) : (
        <>
          <div className={styles.header}>
            <FiUser className={styles.heroIcon} />
            <h1 className={styles.title}>ورود به حساب کاربری</h1>
          </div>

          <p className={styles.subtitle}>
            <FiPhone className={styles.subIcon} />
            لطفاً شماره تلفن خود را وارد کنید
          </p>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <TextInput
              label="شماره تلفن"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              error={error}
              isValid={isValid}
            />

            <Button
              onClick={handleSubmit}
              disabled={!isValid || loading}
            >
              {loading
                ? 'در حال پردازش…'
                : (
                  <>
                    ورود
                    <FiLogIn className={styles.btnIcon} />
                  </>
                )}
            </Button>
          </form>
        </>
      )}
    </div>
  </div>
)


}
