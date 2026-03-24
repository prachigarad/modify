// src/app/login/page.tsx
// Drop this file into: src/app/login/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './login.module.css';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to continue.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setError('');
    login(trimmed);
    router.replace('/');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <main className={styles.container}>
      {/* Floating mood bubbles */}
      <div className={styles.bubbles}>
        {['😄', '😢', '😌', '⚡', '🎯', '💕', '🎵', '🌿'].map((emoji, i) => (
          <span
            key={i}
            className={styles.bubble}
            style={{ '--i': i } as React.CSSProperties}
          >
            {emoji}
          </span>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>🎵</div>
          <h1 className={styles.appName}>Moodify</h1>
          <p className={styles.tagline}>Your emotional companion</p>
        </div>

        <div className={styles.form}>
          <label className={styles.label} htmlFor="nameInput">
            What should we call you?
          </label>
          <input
            id="nameInput"
            type="text"
            className={`${styles.input} ${shaking ? styles.shake : ''}`}
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            maxLength={40}
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} onClick={handleSubmit}>
            Let's go →
          </button>
        </div>

        <p className={styles.privacy}>
          🔒 Your name is stored only on this device. No account needed.
        </p>
      </div>
    </main>
  );
}
