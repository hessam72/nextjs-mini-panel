'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@STYLES/auth/page.module.scss';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import OTPInput from '@/components/OTPInput';

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
  const [storedUser, setStoredUser] = useState<any>(null);

  // Live validation (same as before)...
  useEffect(() => {
    const input = phone.trim();
    if (!input) { setError(''); setIsValid(false); return; }
    if (!/^[+\u06F0-\u06F90-9]+$/.test(input)) {
      setError('فقط اعداد و علامت + مجاز است'); setIsValid(false); return;
    }
    const normalized = normalizeDigits(input);
    if (!/^(\+98|09)/.test(normalized)) {
      setError('فرمت باید با +98 یا 09 شروع شود'); setIsValid(false); return;
    }
    const digitsOnly = normalized.startsWith('+') ? normalized.slice(1) : normalized;
    if (normalized.startsWith('+98')) {
      if (!/^\d{12}$/.test(digitsOnly)) {
        setError('برای +98، باید 12 رقم وارد شود'); setIsValid(false); return;
      }
    } else {
      if (!/^\d{11}$/.test(digitsOnly)) {
        setError('برای 09، باید 11 رقم وارد شود'); setIsValid(false); return;
      }
    }
    if (/^(09\d{9}|\+98\d{10})$/.test(normalized)) {
      setError(''); setIsValid(true);
    } else {
      setError('شماره نامعتبر است'); setIsValid(false);
    }
  }, [phone]);

  // On submit, decide new user vs OTP flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    const normalizedPhone = normalizeDigits(phone.trim());
    const existing = localStorage.getItem('user');
    if (existing) {
      const u = JSON.parse(existing);
      if (u.IRN_NUMBER === normalizedPhone) {
        // OTP flow
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('otp', otp);
        alert(`کد ورود شما: ${otp}`);
        setStoredUser(u);
        setOtpMode(true);
        return;
      }
    }
    // New user flow
    setLoading(true);
    try {
      const res = await fetch('https://randomuser.me/api/?results=1&nat=us');
      const { results } = await res.json();
      const user = {
        ...results[0],
        IRN_NUMBER: normalizedPhone,
        status: 'logged_in',
      };
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard');
    } catch {
      setError('خطا در ورود، دوباره تلاش کنید');
      setLoading(false);
    }
  };

  // OTP verification callback
  const handleOtpVerify = (code: string) => {
    const realOtp = localStorage.getItem('otp');
    if (code === realOtp && storedUser) {
      // login succeeded
      localStorage.removeItem('otp');
      storedUser.status = 'logged_in';
      localStorage.setItem('user', JSON.stringify(storedUser));
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
            <h1 className={styles.title}>ورود به حساب کاربری</h1>
            <p className={styles.subtitle}>لطفاً شماره تلفن خود را وارد کنید</p>
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              <TextInput
                label="شماره تلفن ایران"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                error={error}
                isValid={isValid}
              />
              <Button onClick={handleSubmit} disabled={!isValid || loading}>
                {loading ? 'در حال پردازش…' : 'دریافت کد'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
