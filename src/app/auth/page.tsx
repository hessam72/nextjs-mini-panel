'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@STYLES/auth/page.module.scss';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

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

  useEffect(() => {
    const input = phone.trim();
    if (!input) {
      setError('');
      setIsValid(false);
      return;
    }

    if (!/^[+\u06F0-\u06F90-9]+$/.test(input)) {
      setError('فقط اعداد و علامت + مجاز است');
      setIsValid(false);
      return;
    }

    const normalized = normalizeDigits(input);

    if (!/^(\+98|09)/.test(normalized)) {
      setError('فرمت باید با +98 یا 09 شروع شود');
      setIsValid(false);
      return;
    }

    const digitsOnly = normalized.startsWith('+')
      ? normalized.slice(1)
      : normalized;

    if (normalized.startsWith('+98')) {
      if (!/^\d{12}$/.test(digitsOnly)) {
        setError('برای +98، باید 12 رقم وارد شود');
        setIsValid(false);
        return;
      }
    } else {
      if (!/^\d{11}$/.test(digitsOnly)) {
        setError('برای 09، باید 11 رقم وارد شود');
        setIsValid(false);
        return;
      }
    }

    if (/^(09\d{9}|\+98\d{10})$/.test(normalized)) {
      setError('');
      setIsValid(true);
    } else {
      setError('شماره نامعتبر است');
      setIsValid(false);
    }
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    try {
      const res = await fetch('https://randomuser.me/api/?results=1&nat=us');
      const { results } = await res.json();
      const user = results[0];
      // Add the IRN_NUMBER field with the normalized phone
      const normalizedPhone = normalizeDigits(phone.trim());
      const augmentedUser = { ...user, IRN_NUMBER: normalizedPhone };
      localStorage.setItem('user', JSON.stringify(augmentedUser));
      router.push('/dashboard');
    } catch {
      setError('خطا در ورود، دوباره تلاش کنید');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Spinner />}
      <h1>صفحه ورود</h1>
      <form onSubmit={handleSubmit} noValidate>
        <TextInput
          label="شماره تلفن ایران"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          error={error}
          isValid={isValid}
        />
        <Button onClick={handleSubmit} disabled={!isValid || loading}>
          {loading ? 'در حال ورود…' : 'ورود'}
        </Button>
      </form>
    </div>
  );
}
